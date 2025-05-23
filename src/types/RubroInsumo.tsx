export interface RubroInsumo {
    id: number;
    denominacion: string;
    activo: boolean;
    rubroPadre?: RubroInsumo;
    subRubros: RubroInsumo[];
}




// const opcionElegida = (opcion: string) => {
//     return setOpcionFiltrar(opcion);
//   }

//   const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
//     setBusqueda(e.target.value);
//   };

//   const [busqueda, setBusqueda] = useState<string>("")
//   const [opcionFiltrar, setOpcionFiltrar] = useState<string>('')

// <div className='w-4/5 mt-10 flex justify-around items-center'>
//         <form action="" className='flex items-center'>
//           <input type="search" name="" id="" placeholder='Buscar' onChange={handleChange} className='bg-white py-2 p-0.5 pl-3 border rounded-2xl focus:border-none  focus:outline-3 focus:outline-[#BD1E22]' />
//           <FaSearch className={`relative right-7 ${busqueda === "" ? "relative" : "hidden"}`} />
//         </form>
//         <div className='flex gap-5'>
//           <button className={`font-bold py-2 rounded-lg px-3 bg-white cursor-pointer ${opcionFiltrar === "Insumos" ? "shadow-xl/10" : ""}`} onClick={() => opcionElegida("Insumos")}>Insumos</button>
//           <button className={`font-bold py-2 rounded-lg px-3 bg-white cursor-pointer ${opcionFiltrar === "Productos" ? "shadow-xl/10" : ""}`} onClick={() => opcionElegida("Productos")}>Productos</button>
//         </div >
//         <button className='bg-secondary text-white px-3 py-2 rounded-2xl cursor-pointer' onClick={abrirModal}>+ Agregar Categoria</button>
//       </div >