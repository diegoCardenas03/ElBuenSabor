import { ChangeEvent, useEffect, useState, useCallback } from 'react';
import { FaSearch, FaTimes } from "react-icons/fa";
import { RubroInsumoDTO } from '../../types/RubroInsumo/RubroInsumoDTO';
import { RubroProductoDTO } from '../../types/RubroProducto/RubroProductoDTO';
import Swal from "sweetalert2";
import CategoriasLista from "./CategoriasLista";

// Tipos internos para el manejo en frontend
type RubroInsumo = RubroInsumoDTO & {
  id: number;
  subRubros: RubroInsumo[];
  tipo: "Insumo";
};
type RubroProducto = RubroProductoDTO & {
  id: number;
  tipo: "Producto";
};
type Rubro = RubroInsumo | RubroProducto;

// Función inmutable para agregar un subrubro a un árbol
function agregarSubRubro(
  rubros: RubroInsumo[],
  padreId: number,
  nuevo: RubroInsumo
): RubroInsumo[] {
  return rubros.map(rubro => {
    if (rubro.id === padreId) {
      return {
        ...rubro,
        subRubros: [...rubro.subRubros, nuevo]
      };
    }
    return {
      ...rubro,
      subRubros: agregarSubRubro(rubro.subRubros, padreId, nuevo)
    };
  });
}

// Función para detectar si un rubro es hijo de otro (para mostrar sólo raíz en la lista)
function rubroPadreIdEnData(rubros: RubroInsumo[], id: number): boolean {
  function search(rubros: RubroInsumo[]): boolean {
    for (const rubro of rubros) {
      if (rubro.subRubros.some(sub => sub.id === id)) return true;
      if (search(rubro.subRubros)) return true;
    }
    return false;
  }
  return search(rubros);
}

// Para el select: recorre todo el árbol y cada rubro aparece SOLO UNA VEZ (aunque el backend lo mande duplicado)
const obtenerTodosRubrosUnicosAnidados = (rubros: RubroInsumo[], depth = 0, visitados = new Set<number>()): {rubro: RubroInsumo, depth: number}[] => {
  let result: {rubro: RubroInsumo, depth: number}[] = [];
  for (const rubro of rubros) {
    if (!visitados.has(rubro.id)) {
      visitados.add(rubro.id);
      result.push({ rubro, depth });
      result = result.concat(obtenerTodosRubrosUnicosAnidados(rubro.subRubros, depth + 1, visitados));
    }
  }
  return result;
};

const Categorias = () => {
  const [modalAbierto, setModalAbierto] = useState<boolean>(false);
  const [nombreRubro, setNombreRubro] = useState<string>("");
  const [tipoRubro, setTipoRubro] = useState<"Insumo" | "Producto">("Insumo");
  const [rubroPadreSeleccionado, setRubroPadreSeleccionado] = useState<string>("");
  const [rubrosInsumos, setRubrosInsumos] = useState<RubroInsumo[]>([]);
  const [rubrosProductos, setRubrosProductos] = useState<RubroProducto[]>([]);
  const [busqueda, setBusqueda] = useState<string>("");
  const [opcionFiltrar, setOpcionFiltrar] = useState<"Insumo" | "Producto" | "">("Insumo");
  const [abiertos, setAbiertos] = useState<{ [id: number]: boolean }>({});

  const [editando, setEditando] = useState<boolean>(false);
  const [rubroEditando, setRubroEditando] = useState<Rubro | null>(null);

  // Función para cargar rubros desde el backend
  const cargarRubros = useCallback(async () => {
    // Traer todos los Rubros Insumo
    try {
      const res = await fetch('http://localhost:8080/api/rubroinsumo');
      if (!res.ok) throw new Error('Fallo al traer rubros insumo');
      const data: any[] = await res.json();
      function mapRubroInsumo(dto: any): RubroInsumo {
        return {
          id: dto.id,
          denominacion: dto.denominacion,
          activo: dto.activo,
          tipo: "Insumo",
          subRubros: (dto.subRubros || []).map(mapRubroInsumo)
        }
      }
      setRubrosInsumos(data.map(mapRubroInsumo));
    } catch (error) {
      Swal.fire({
        position: "bottom-end",
        icon: "error",
        title: "Error al cargar rubros insumo",
        showConfirmButton: false,
        timer: 1000,
        width: "20em"
      });
      console.error("Error fetch rubros insumo", error);
    }

    // Traer todos los Rubros Producto
    try {
      const res = await fetch('http://localhost:8080/api/rubroProducto');
      if (!res.ok) throw new Error('Fallo al traer rubros producto');
      const data: any[] = await res.json();
      setRubrosProductos(
        data.map(dto => ({
          id: dto.id,
          denominacion: dto.denominacion,
          activo: dto.activo,
          tipo: "Producto"
        }))
      );
    } catch (error) {
      Swal.fire({
        position: "bottom-end",
        icon: "error",
        title: "Error al cargar rubros producto",
        showConfirmButton: false,
        timer: 1000,
        width: "20em"
      });
      console.error("Error fetch rubros producto", error);
    }
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    cargarRubros();
  }, [cargarRubros]);

  const toggleAbierto = (id: number) => {
    setAbiertos(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const eliminarRubroInsumo = (rubros: RubroInsumo[], id: number): RubroInsumo[] => {
    return rubros
      .filter(rubro => rubro.id !== id)
      .map(rubro => ({
        ...rubro,
        subRubros: eliminarRubroInsumo(rubro.subRubros, id)
      }));
  };

  const limpiarAbiertos = (obj: { [id: number]: boolean }, id: number, rubros: RubroInsumo[]) => {
    delete obj[id];
    rubros.forEach(sub => limpiarAbiertos(obj, sub.id, sub.subRubros));
  };

  const handleEliminar = async (rubro: Rubro) => {
    try {
      if (rubro.tipo === "Insumo") {
        const res = await fetch(`http://localhost:8080/api/rubroinsumo/${rubro.id}`, { 
          method: "DELETE" 
        });
        if (!res.ok) throw new Error('Error al eliminar rubro insumo');
      } else {
        const res = await fetch(`http://localhost:8080/api/rubroProducto/${rubro.id}`, { 
          method: "DELETE" 
        });
        if (!res.ok) throw new Error('Error al eliminar rubro producto');
      }
      
      // Recargar datos después de eliminar
      await cargarRubros();
      
      Swal.fire({
        position: "bottom-end",
        icon: "success",
        title: "Categoría eliminada correctamente",
        showConfirmButton: false,
        timer: 1000,
        width: "20em"
      });
    } catch (error) {
      Swal.fire({
        position: "bottom-end",
        icon: "error",
        title: "Error al eliminar categoría",
        showConfirmButton: false,
        timer: 1000,
        width: "20em"
      });
      console.error("Error al eliminar rubro", error);
    }
  };

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

  // Filtrar solo los rubros raíz (los que no son hijos de nadie)
  const filteredInsumos = filtrarRubrosInsumos(rubrosInsumos, busqueda)
    .filter(rubro => !rubroPadreIdEnData(rubrosInsumos, rubro.id));

  const filteredProductos = rubrosProductos.filter(rubro =>
    rubro.denominacion.toLowerCase().includes(busqueda.toLowerCase())
  );

  const encontrarPadre = (rubros: RubroInsumo[], id: number): RubroInsumo | undefined => {
    for (const rubro of rubros) {
      if (rubro.id === id) return rubro;
      const encontrado = encontrarPadre(rubro.subRubros, id);
      if (encontrado) return encontrado;
    }
  };

  const crearRubro = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreRubro || !tipoRubro) return;

    try {
      if (editando && rubroEditando) {
        if (tipoRubro === "Insumo") {
          const rubroEditado: RubroInsumoDTO = {
            denominacion: nombreRubro,
            activo: true,
            rubroPadreId: rubroPadreSeleccionado ? Number(rubroPadreSeleccionado) : undefined,
            tipo: "Insumo"
          };
          const res = await fetch(`http://localhost:8080/api/rubroinsumo/${rubroEditando.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(rubroEditado)
          });
          if (!res.ok) throw new Error('Error en PUT rubro insumo');
          
          // Recargar datos después de editar
          await cargarRubros();
          
          Swal.fire({
            position: "bottom-end",
            icon: "success",
            title: "Categoría actualizada correctamente",
            showConfirmButton: false,
            timer: 1000,
            width: "20em"
          });
        } else {
          const rubroEditado: RubroProductoDTO = {
            denominacion: nombreRubro,
            activo: true,
          };
          const res = await fetch(`http://localhost:8080/api/rubroProducto/${rubroEditando.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(rubroEditado)
          });
          if (!res.ok) throw new Error('Error en PUT rubro producto');
          
          // Recargar datos después de editar
          await cargarRubros();
          
          Swal.fire({
            position: "bottom-end",
            icon: "success",
            title: "Categoría actualizada correctamente",
            showConfirmButton: false,
            timer: 1000,
            width: "20em"
          });
        }
      } else {
        if (tipoRubro === "Insumo") {
          const nuevoRubro: RubroInsumoDTO = {
            denominacion: nombreRubro,
            activo: true,
            rubroPadreId: rubroPadreSeleccionado ? Number(rubroPadreSeleccionado) : undefined,
            tipo: "Insumo"
          };
          const res = await fetch("http://localhost:8080/api/rubroinsumo/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevoRubro)
          });
          if (!res.ok) throw new Error('Error en POST rubro insumo');
          
          // Recargar datos después de crear
          await cargarRubros();
          
          Swal.fire({
            position: "bottom-end",
            icon: "success",
            title: "Categoría creada correctamente",
            showConfirmButton: false,
            timer: 1000,
            width: "20em"
          });
        } else {
          const nuevoProducto: RubroProductoDTO = {
            denominacion: nombreRubro,
            activo: true,
          };
          const res = await fetch("http://localhost:8080/api/rubroProducto/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevoProducto)
          });
          if (!res.ok) throw new Error('Error en POST rubro producto');
          
          // Recargar datos después de crear
          await cargarRubros();
          
          Swal.fire({
            position: "bottom-end",
            icon: "success",
            title: "Categoría creada correctamente",
            showConfirmButton: false,
            timer: 1000,
            width: "20em"
          });
        }
      }

      setModalAbierto(false);
      setNombreRubro("");
      setRubroPadreSeleccionado("");
      setEditando(false);
      setRubroEditando(null);

    } catch (error) {
      Swal.fire({
        position: "bottom-end",
        icon: "error",
        title: "Error al procesar la categoría",
        showConfirmButton: false,
        timer: 1000,
        width: "20em"
      });
      console.error("Error general crear/editar rubro", error);
    }
  };

  const handleEditar = (rubro: Rubro) => { 
    setEditando(true); 
    setRubroEditando(rubro); 
    setNombreRubro(rubro.denominacion); 
    setTipoRubro(rubro.tipo); 
    setModalAbierto(true);
    
    if (rubro.tipo === "Insumo") {
      const buscarPadre = (rubros: RubroInsumo[], id: number, padreId?: number): number | "" => {
        for (const rubroItem of rubros) {
          if (rubroItem.subRubros.some(sub => sub.id === id)) return rubroItem.id;
          const resultado = buscarPadre(rubroItem.subRubros, id, rubroItem.id);
          if (resultado) return resultado;
        }
        return "";
      };
      const padreId = buscarPadre(rubrosInsumos, rubro.id);
      setRubroPadreSeleccionado(padreId ? String(padreId) : "");
    } else {
      setRubroPadreSeleccionado("");
    }
  };

  return (
    <>
      <div className='w-5/6 mt-10 flex justify-around items-center'>
        <form className='flex items-center'>
          <input type="search" placeholder='Buscar' onChange={(e) => setBusqueda(e.target.value)} className='bg-white py-2 pl-3 pr-8 border rounded-2xl focus:outline-[#BD1E22]' />
          <FaSearch className={`relative right-7 ${busqueda ? "hidden" : "block"}`} />
        </form>
        <div className='flex gap-2'>
          <button className={`font-bold py-2 rounded-lg px-3 ${opcionFiltrar === "Insumo" ? "bg-gray-200" : "bg-white"}`} onClick={() => setOpcionFiltrar("Insumo")} type="button" > Insumos </button>
          <button className={`font-bold py-2 rounded-lg px-3 ${opcionFiltrar === "Producto" ? "bg-gray-200" : "bg-white"}`} onClick={() => setOpcionFiltrar("Producto")} type="button"> Productos </button>
        </div>
        <button className='bg-secondary text-white px-2 py-2 rounded-2xl cursor-pointer' onClick={() => { setModalAbierto(true); setEditando(false); setRubroEditando(null); setNombreRubro(""); setTipoRubro("Insumo"); setRubroPadreSeleccionado(""); }} > +Agregar Categoría
        </button>
      </div>

      <div className="mt-10 bg-white h-10 w-8/10 pl-10 flex items-center rounded-t-lg font-semibold">Nombre</div>

      <CategoriasLista
        opcionFiltrar={opcionFiltrar}
        filteredInsumos={filteredInsumos}
        filteredProductos={filteredProductos}
        abiertos={abiertos}
        toggleAbierto={toggleAbierto}
        handleEditar={handleEditar}
        handleEliminar={handleEliminar}
      />

      {modalAbierto && (
        <div className="fixed inset-0 bg-black/50 z-40">
          <div className="rounded-3xl p-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary w-1/2">
            <button onClick={() => { setModalAbierto(false); setEditando(false); setRubroEditando(null); setNombreRubro(""); setTipoRubro("Insumo"); setRubroPadreSeleccionado(""); }} className="absolute top-4 right-4 text-gray-500 hover:text-red-600" >
              <FaTimes className="text-secondary h-6 w-6" />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-secondary">
              {editando ? "Editar Categoría" : "Nueva Categoría"}
            </h2>
            <form onSubmit={crearRubro}>
              <div className="mb-4">
                <label className="block mb-2">Nombre</label>
                <input type="text" placeholder='Nombre de la categoria' className="w-full p-2 border rounded bg-white" value={nombreRubro} onChange={(e) => setNombreRubro(e.target.value)} required />
              </div>

              <div className="mb-4">
                <label className="block mb-2">Tipo</label>
                <div className="flex gap-4">
                  <label>
                    <input type="radio" name="tipo" value="Insumo" checked={tipoRubro === "Insumo"} onChange={() => setTipoRubro("Insumo")} disabled={editando} />
                    <span className="ml-2">Insumo</span>
                  </label>
                  <label>
                    <input type="radio" name="tipo" value="Producto" checked={tipoRubro === "Producto"} onChange={() => setTipoRubro("Producto")} disabled={editando} />
                    <span className="ml-2">Producto</span>
                  </label>
                </div>
              </div>

              {tipoRubro === "Insumo" && (
                <div className="mb-4">
                  <label className="block mb-2">Rubro Padre (Opcional)</label>
                  <select className="w-full p-2 border rounded bg-white" onChange={(e) => setRubroPadreSeleccionado(e.target.value)} value={rubroPadreSeleccionado} disabled={editando && rubroEditando?.tipo === "Insumo" && (rubroEditando as RubroInsumo).subRubros.length > 0} >
                    <option value="">Ninguno</option>
                    {obtenerTodosRubrosUnicosAnidados(rubrosInsumos)
                      .filter(({rubro}) => !editando || rubro.id !== rubroEditando?.id)
                      .map(({rubro, depth}) => (
                        <option key={rubro.id} value={rubro.id}>
                          {"— ".repeat(depth)} {rubro.denominacion}
                        </option>
                      ))}
                  </select>
                  {editando && rubroEditando?.tipo === "Insumo" && (rubroEditando as RubroInsumo).subRubros.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">No puedes cambiar el padre si el rubro tiene subrubros.</p>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-4 mt-6">
                <button type="button" onClick={() => { setModalAbierto(false); setEditando(false); setRubroEditando(null); setNombreRubro(""); setTipoRubro("Insumo"); setRubroPadreSeleccionado(""); }} className="px-4 py-2 text-gray-600 hover:text-gray-800"> Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-tertiary text-white rounded hover:bg-secondary transition-colors"> {editando ? "Guardar Cambios" : "Crear"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Categorias;