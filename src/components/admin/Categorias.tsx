import { ChangeEvent, useState } from 'react';
import { FaSearch, FaTimes, FaPencilAlt, FaRegTrashAlt, FaAngleUp } from "react-icons/fa";
import { RubroInsumoDTO } from '../../types/RubroProducto/RubroProductoDTO';
import { RubroProductoDTO } from '../../types/RubroInsumo/RubroInsumoDTO';

type Rubro = RubroInsumoDTO | RubroProductoDTO;

const Categorias = () => {
  const [modalAbierto, setModalAbierto] = useState<boolean>(false);
  const [nombreRubro, setNombreRubro] = useState<string>("");
  const [tipoRubro, setTipoRubro] = useState<"Insumo" | "Producto">("Insumo");
  const [rubroPadreSeleccionado, setRubroPadreSeleccionado] = useState<string>("");
  const [rubrosInsumos, setRubrosInsumos] = useState<RubroInsumo[]>([]);
  const [rubrosProductos, setRubrosProductos] = useState<RubroProducto[]>([]);
  const [busqueda, setBusqueda] = useState<string>("");
  const [opcionFiltrar, setOpcionFiltrar] = useState<"Insumo" | "Producto" | "">("");

  // Función recursiva para eliminar rubros Insumo
  const eliminarRubroInsumo = (rubros: RubroInsumo[], id: number): RubroInsumo[] => {
    return rubros.filter(rubro => rubro.id !== id)
      .map(rubro => ({
        ...rubro,
        subRubros: eliminarRubroInsumo(rubro.subRubros, id)
      }));
  };

  // Función recursiva para filtrar rubros Insumo
  const filtrarRubrosInsumos = (rubros: RubroInsumo[], termino: string): RubroInsumo[] => {
    const term = termino.toLowerCase();
    return rubros.filter(rubro => {
      const nombreMatch = rubro.denominacion.toLowerCase().includes(term);
      const subRubrosFiltrados = filtrarRubrosInsumos(rubro.subRubros, termino);
      return nombreMatch || subRubrosFiltrados.length > 0;
    }).map(rubro => ({
      ...rubro,
      subRubros: filtrarRubrosInsumos(rubro.subRubros, termino)
    }));
  };

  // Filtrar resultados
  const filteredInsumos = filtrarRubrosInsumos(rubrosInsumos, busqueda);
  const filteredProductos = rubrosProductos.filter(rubro => 
    rubro.denominacion.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Obtener todos los rubros Insumo anidados
  const obtenerRubrosInsumoAnidados = (rubros: RubroInsumo[]): RubroInsumo[] => {
    return rubros.flatMap(rubro => [rubro, ...obtenerRubrosInsumoAnidados(rubro.subRubros)]);
  };

  // Crear nuevo rubro
  const crearRubro = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreRubro || !tipoRubro) return;

    if (tipoRubro === "Insumo") {
      const nuevoRubro: RubroInsumo = {
        id: Date.now(),
        denominacion: nombreRubro,
        activo: true,
        tipo: "Insumo",
        subRubros: [],
      };

      if (rubroPadreSeleccionado) {
        const encontrarPadre = (rubros: RubroInsumo[]): RubroInsumo | undefined => {
          for (const rubro of rubros) {
            if (rubro.id === Number(rubroPadreSeleccionado)) return rubro;
            const encontrado = encontrarPadre(rubro.subRubros);
            if (encontrado) return encontrado;
          }
        };

        const padre = encontrarPadre(rubrosInsumos);
        if (padre) {
          padre.subRubros.push(nuevoRubro);
          setRubrosInsumos([...rubrosInsumos]);
        }
      } else {
        setRubrosInsumos([...rubrosInsumos, nuevoRubro]);
      }
    } else {
      const nuevoProducto: RubroProducto = {
        id: Date.now(),
        denominacion: nombreRubro,
        activo: true,
        tipo: "Producto",
      };
      setRubrosProductos([...rubrosProductos, nuevoProducto]);
    }

    setModalAbierto(false);
    setNombreRubro("");
    setRubroPadreSeleccionado("");
  };

  // Componente de rubro
  const RubroItem = ({ rubro, nivel = 0 }: { rubro: Rubro; nivel?: number }) => {
    const [subAbierto, setSubAbierto] = useState(false);

    return (
      <div className="w-full">
        <div className="flex items-center h-10">
          <div className="w-1/2 pl-10 flex items-center gap-5" style={{ marginLeft: `${rubro.tipo === "Insumo" ? nivel * 20 : 0}px` }}>
            <p className="underline">{rubro.denominacion}</p>
          </div>
          <div className="flex justify-end w-full pr-10 gap-5">
            <FaPencilAlt className="cursor-pointer hover:text-tertiary" />
            <FaRegTrashAlt
              className="cursor-pointer hover:text-tertiary"
              onClick={() => {
                if (rubro.tipo === "Insumo") {
                  const nuevosRubros = eliminarRubroInsumo(rubrosInsumos, rubro.id);
                  setRubrosInsumos(nuevosRubros);
                } else {
                  setRubrosProductos(rubrosProductos.filter(r => r.id !== rubro.id));
                }
              }}
            />
            {rubro.tipo === "Insumo" && rubro.subRubros.length > 0 && (
              <FaAngleUp
                onClick={() => setSubAbierto(!subAbierto)}
                className={`cursor-pointer h-5 ${subAbierto ? "rotate-180" : ""}`}
              />
            )}
          </div>
        </div>

        {rubro.tipo === "Insumo" && subAbierto && (
          <div className="ml-5">
            {rubro.subRubros.map((subrubro) => (
              <RubroItem key={subrubro.id} rubro={subrubro} nivel={nivel + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className='w-5/6 mt-10 flex justify-around items-center'>
        <form className='flex items-center'>
          <input 
            type="search" 
            placeholder='Buscar' 
            onChange={(e) => setBusqueda(e.target.value)} 
            className='bg-white py-2 pl-3 pr-8 border rounded-2xl focus:outline-[#BD1E22]' 
          />
          <FaSearch className={`relative right-7 ${busqueda ? "hidden" : "block"}`} />
        </form>
        <div className='flex gap-2'>
          <button 
            className={`font-bold py-2 rounded-lg px-3 ${opcionFiltrar === "Insumo" ? "bg-gray-200" : "bg-white"}`} 
            onClick={() => setOpcionFiltrar("Insumo")}
          >
            Insumos
          </button>
          <button 
            className={`font-bold py-2 rounded-lg px-3 ${opcionFiltrar === "Producto" ? "bg-gray-200" : "bg-white"}`} 
            onClick={() => setOpcionFiltrar("Producto")}
          >
            Productos
          </button>
        </div>
        <button 
          className='bg-secondary text-white px-2 py-2 rounded-2xl cursor-pointer'
          onClick={() => setModalAbierto(true)}
        >
          +Agregar Categoría
        </button>
      </div>

      <div className="mt-10 bg-white h-10 w-8/10 pl-10 flex items-center rounded-t-lg font-semibold">
        Nombre
      </div>

      <ul className='w-8/10'>
        {opcionFiltrar === "Insumo" && filteredInsumos.map((rubro) => (
          <li className='border-b-1 mt-2 underline-offset-6 font-semibold text-md' key={rubro.id}>
            <RubroItem rubro={rubro} />
          </li>
        ))}

        {opcionFiltrar === "Producto" && filteredProductos.map((rubro) => (
          <li className='border-b-1 mt-2 underline-offset-6 font-semibold text-md' key={rubro.id}>
            <RubroItem rubro={rubro} />
          </li>
        ))}
      </ul>

      {modalAbierto && (
        <div className="fixed inset-0 bg-black/50 z-40">
          <div className="rounded-3xl p-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary w-1/2">
            <button
              onClick={() => setModalAbierto(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
            >
              <FaTimes className="text-secondary h-6 w-6" />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-secondary">Nueva Categoría</h2>
            <form onSubmit={crearRubro}>
              <div className="mb-4">
                <label className="block mb-2">Nombre</label>
                <input
                  type="text"
                  placeholder='Nombre de la categoria'
                  className="w-full p-2 border rounded bg-white"
                  value={nombreRubro}
                  onChange={(e) => setNombreRubro(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2">Tipo</label>
                <div className="flex gap-4">
                  <label>
                    <input
                      type="radio"
                      name="tipo"
                      value="Insumo"
                      checked={tipoRubro === "Insumo"}
                      onChange={() => setTipoRubro("Insumo")}
                    />
                    <span className="ml-2">Insumo</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="tipo"
                      value="Producto"
                      checked={tipoRubro === "Producto"}
                      onChange={() => setTipoRubro("Producto")}
                    />
                    <span className="ml-2">Producto</span>
                  </label>
                </div>
              </div>

              {tipoRubro === "Insumo" && (
                <div className="mb-4">
                  <label className="block mb-2">Rubro Padre (Opcional)</label>
                  <select
                    className="w-full p-2 border rounded bg-white"
                    onChange={(e) => setRubroPadreSeleccionado(e.target.value)}
                  >
                    <option value="">Ninguno</option>
                    {obtenerRubrosInsumoAnidados(rubrosInsumos).map((rubro) => (
                      <option key={rubro.id} value={rubro.id}>
                        {"— ".repeat(rubro.subRubros.length)} {rubro.denominacion}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-4 mt-6">
                <button 
                  type="button" 
                  onClick={() => setModalAbierto(false)} 
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-tertiary text-white rounded hover:bg-secondary transition-colors"
                >
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Categorias;