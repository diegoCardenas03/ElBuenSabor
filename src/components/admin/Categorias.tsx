import { ChangeEvent, useState } from 'react'
import { FaSearch, FaTimes, FaPencilAlt, FaRegTrashAlt, FaAngleUp } from "react-icons/fa";

const Categorias = () => {

  const [busqueda, setBusqueda] = useState<string>("")
  const [opcionFiltrar, setOpcionFiltrar] = useState<string>('')
  const [modalAbierto, setModalAbierto] = useState<boolean>(false)

  const opcionElegida = (opcion: string) => {
    return setOpcionFiltrar(opcion);
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setBusqueda(e.target.value);
  };

  const abrirModal = () => {
    setModalAbierto(!modalAbierto)
  }


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

      {/* ACA EMPIEZA LA TABLA  */}
      < div className='mt-10 bg-white h-10 w-8/10 pl-10 flex items-center rounded-4xl text-base shadow-xl/10 font-semibold' > Nombre</div >




      {/*Modal creacion de Categoria  */}
      {
        modalAbierto && (
          <>
            <div className="fixed inset-0 bg-black/50 z-40"></div>
            <div className='rounded-3xl p-5 absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-primary  flex justify-center items-center shadow-lg w-5/10 flex-col'>
              <button onClick={abrirModal} className='cursor-pointer absolute top-4 right-4 text-secondary hover:text-tertiary transition-colors'>
                <FaTimes className='h-6 w-6' />
              </button>
              <h4 className='mt-5 font-bold text-2xl text-secondary'>Agregar nueva categoria</h4>
              <form action="" className='flex flex-col mt-5 w-full gap-2'>
                <label htmlFor="">Nombre</label>
                <input type="text" name="" id="" placeholder='Nombre...' className='bg-white mb-2 py-2 p-0.5 pl-3 border rounded-2xl focus:border-none  focus:outline-3 focus:outline-[#BD1E22]' />
                <label htmlFor="">Tipo:</label>
                <div className='flex gap-10 items-center'>
                  <label className='flex items-center gap-2' htmlFor="">Insumo <input type="radio" className='cursor-pointer' name="tipoCategoria" id="" /></label>

                  <label className='flex items-center gap-2' htmlFor="">Producto <input type="radio" className='cursor-pointer' name="tipoCategoria" id="" /></label>

                </div>
                <div className='flex justify-around mt-5'>
                  <button onClick={abrirModal} className='underline font-semibold cursor-pointer'>Cancelar</button>
                  <button type='submit' className='py-1 px-4 font-semibold rounded-2xl text-white bg-tertiary cursor-pointer'>Crear</button>
                </div>
              </form>
            </div>
          </>


        )
      }
    </>
  )
}

export default Categorias