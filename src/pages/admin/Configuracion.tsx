import { useState } from 'react'
import { AdminHeader } from '../../components/admin/AdminHeader'
import { Rol } from '../../types/enums/Rol'
import Categorias from '../../components/admin/Categorias';
import Roles from '../../components/admin/Roles';

const Configuracion = () => {

  const [opcionPrincipal, setOpcionPrincipal] = useState<string>("Categorias");

  const elegirOpcionPrincipal = (opcion: string)=>{
    return setOpcionPrincipal(opcion);
  }

  

  return (
    <>
      <AdminHeader rol={Rol.ADMIN} />
      <main className="flex flex-col items-center w-full m-auto pt-10 min-h-screen pb-20 bg-primary font-primary">
        <div className='flex justify-around w-4/5'>
          <button className={`text-tertiary font-bold text-xl cursor-pointer w-[200px] py-2 rounded-4xl ${opcionPrincipal === "Categorias"
            ? 'bg-white shadow-lg'
            : ''
          }`} onClick={() => elegirOpcionPrincipal("Categorias")}>Categorias</button>

          <button className={`text-tertiary font-bold text-xl cursor-pointer w-[200px] py-2 rounded-4xl ${opcionPrincipal === "Roles"
            ? 'bg-white shadow-lg'
            : ''
          }`} onClick={() => elegirOpcionPrincipal("Roles")}>Roles</button>          
        </div>

        {opcionPrincipal === "Categorias" ? <Categorias/> : <Roles/>}




      </main>



    </>
  )
}

export default Configuracion