import { ChangeEvent, useState } from 'react'
import { FaSearch, FaTimes, FaPencilAlt, FaRegTrashAlt, FaAngleUp } from "react-icons/fa";
import { RubroInsumo } from '../../types/RubroInsumo';

const Categorias = () => {
  const [modalAbierto, setModalAbierto] = useState<boolean>(false);
  const [nombreRubro, setNombreRubro] = useState<string>("");
  const [tipoRubro, setTipoRubro] = useState<string>("");
  const [rubroPadreSeleccionado, setRubroPadreSeleccionado] = useState<string>("");
  const [rubros, setRubros] = useState<RubroInsumo[]>([]);
  const [subCategoriasAbiertas, setSubCategoriasAbiertas] = useState<{ [key: number]: boolean }>({});

  const abrirModal = () => {
    setModalAbierto(!modalAbierto);
    setNombreRubro("");
    setTipoRubro("");
    setRubroPadreSeleccionado("");
  };

  const opcionElegida = (opcion: string) => {
    return setOpcionFiltrar(opcion);
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setBusqueda(e.target.value);
  };

  const [busqueda, setBusqueda] = useState<string>("")
  const [opcionFiltrar, setOpcionFiltrar] = useState<string>('')

  const crearRubro = (e: React.FormEvent) => {
  e.preventDefault();
  if (!nombreRubro || !tipoRubro) return;

  const nuevoRubro: RubroInsumo = {
    id: Date.now(),
    denominacion: nombreRubro,
    activo: true,
    rubroPadre: undefined,
    subRubros: [],
  };

  // Si tiene rubro padre, se guarda como subrubro
  if (tipoRubro === "Insumo" && rubroPadreSeleccionado) {
    setRubros((prevRubros) =>
      prevRubros.map((rubro) =>
        rubro.denominacion === rubroPadreSeleccionado
          ? {
              ...rubro,
              subRubros: [...rubro.subRubros, { ...nuevoRubro }]
            }
          : rubro
      )
    );
  } else {
    setRubros([...rubros, nuevoRubro]);
  }

  abrirModal();
  console.log("Nuevo rubro creado:", nuevoRubro);
};

  const agregarSubRubro = (rubroId: number, subRubroNombre: string) => {
    setRubros(
      rubros.map((rubro) =>
        rubro.id === rubroId
          ? { ...rubro, subRubros: [...rubro.subRubros, { id: Date.now(), denominacion: subRubroNombre, activo: true, subRubros: [] }] }
          : rubro
      )
    );
  };

  const toggleSubCategorias = (rubroId: number) => {
    setSubCategoriasAbiertas((prevState) => ({
      ...prevState,
      [rubroId]: !prevState[rubroId],
    }));
  };

  const rubrosPadres = rubros.filter((r) => !r.rubroPadre);

  return (
    <>
      <div className='w-4/5 mt-10 flex justify-around items-center'>
        <form action="" className='flex items-center'>
          <input type="search" name="" id="" placeholder='Buscar' onChange={handleChange} className='bg-white py-2 p-0.5 pl-3 border rounded-2xl focus:border-none  focus:outline-3 focus:outline-[#BD1E22]' />
          <FaSearch className={`relative right-7 ${busqueda === "" ? "relative" : "hidden"}`} />
        </form>
        <div className='flex gap-5'>
          <button className={`font-bold py-2 rounded-lg px-3 bg-white cursor-pointer ${opcionFiltrar === "Insumos" ? "shadow-xl/10" : ""}`} onClick={() => opcionElegida("Insumos")}>Insumos</button>
          <button className={`font-bold py-2 rounded-lg px-3 bg-white cursor-pointer ${opcionFiltrar === "Productos" ? "shadow-xl/10" : ""}`} onClick={() => opcionElegida("Productos")}>Productos</button>
        </div >
        <button className='bg-secondary text-white px-3 py-2 rounded-2xl cursor-pointer' onClick={abrirModal}>+ Agregar Categoria</button>
      </div >

      <div className="mt-10 bg-white h-10 w-8/10 pl-10 flex items-center rounded-4xl text-base shadow-xl/10 font-semibold">
        Nombre
      </div>

      {rubros.map((rubro) => (
        <div key={rubro.id} className="w-8/10 mt-5 flex flex-col rounded-4xl text-base font-semibold">
          <div className="flex items-center h-10">
            <div className="w-1/2 pl-10 flex items-center gap-5">
              <p className="underline">{rubro.denominacion}</p>
            </div>
            <div className="flex justify-end w-full pr-10 gap-5">
              <FaPencilAlt className="text-black cursor-pointer transition-colors hover:text-tertiary" />
              <FaRegTrashAlt className="text-black cursor-pointer transition-colors hover:text-tertiary" onClick={() => setRubros(rubros.filter((r) => r.id !== rubro.id))} />
              <FaAngleUp onClick={() => toggleSubCategorias(rubro.id)} className={`text-black cursor-pointer transition-colors hover:text-tertiary h-5 transform ${subCategoriasAbiertas[rubro.id] ? "rotate-180" : ""}`} />
            </div>
          </div>

          {subCategoriasAbiertas[rubro.id] && (
            <div className="w-8/10 pl-16 pr-10 py-3">
              <div className="mb-2">
                {rubro.subRubros.map((subrubro) => (
                  <p key={subrubro.id} className="text-sm">- {subrubro.denominacion}</p>
                ))}
              </div>
            </div>
          )}

          <hr className="w-full"></hr>
        </div>
      ))}

      {modalAbierto && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40"></div>
          <div className="rounded-3xl p-5 absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-primary flex justify-center items-center shadow-lg w-5/10 flex-col">
            <button onClick={abrirModal} className="cursor-pointer absolute top-4 right-4 text-secondary hover:text-tertiary transition-colors"><FaTimes className="h-6 w-6" /></button>
            <h4 className="mt-5 font-bold text-2xl text-secondary">Agregar nueva categoría</h4>
            <form onSubmit={crearRubro} className="flex flex-col mt-5 w-full gap-2">
              <label htmlFor="nombre">Nombre</label>
              <input type="text" id="nombre" placeholder="Nombre..." value={nombreRubro} onChange={(e) => setNombreRubro(e.target.value)} className="bg-white mb-2 py-2 pl-3 border rounded-2xl focus:border-none focus:outline-3 focus:outline-[#BD1E22]" />

              <label>Tipo:</label>
              <div className="flex gap-10 items-center">
                <label className="flex items-center gap-2">
                  <input type="radio" className="cursor-pointer" name="tipoCategoria" value="Insumo" onChange={(e) => setTipoRubro(e.target.value)} />Insumo
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" className="cursor-pointer" name="tipoCategoria" value="Producto" onChange={(e) => setTipoRubro(e.target.value)} /> Producto
                </label>
              </div>

              {tipoRubro === "Insumo" && (
                <>
                  <label htmlFor="rubroPadre">Rubro Padre (Opcional)</label>
                  <select id="rubroPadre" className="bg-white py-2 px-3 border rounded-2xl" onChange={(e) => setRubroPadreSeleccionado(e.target.value)}>
                    <option value="">Seleccionar...</option>
                    {rubrosPadres.map((rubro) => (
                      <option key={rubro.id} value={rubro.denominacion}>
                        {rubro.denominacion}
                      </option>
                    ))}
                  </select>
                </>
              )}

              <div className="flex justify-around mt-5">
                <button type="button" onClick={abrirModal} className="underline font-semibold cursor-pointer">Cancelar</button>
                <button type="submit" className="py-1 px-4 font-semibold rounded-2xl text-white bg-tertiary cursor-pointer">Crear</button>
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default Categorias;