import Confirmar from './commons/Confirmar';
import { useState } from 'react';

// Icons
import iconFacebook from '../assets/icons/facebook.svg';
import iconGoogle from '../assets/icons/iconGoogle.svg';
import { IconEye } from '@tabler/icons-react';
import { IconEyeOff } from '@tabler/icons-react';


const ModalLogin: React.FC = () => {
  const [VerContrasenia, setVerContrasenia] = useState<boolean>(false);

  const verPassword = (): void => {
    setVerContrasenia(!VerContrasenia);
  }

  return (
    <>
      {/* Modal Login */}
      <section className="p-5 px-0 rounded-xl w-60 h-auto bg-primary m-auto">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-lg font-extrabold text-secondary">Inicia Sesión</h2>
            <p className="text-tertiary">¡Vamos y entra a tu cuenta!</p>
          </div>
        </div>
        <form action="" className="flex flex-col">
          <label className="text-secondary text-xs">Correo</label>
          <input type="email" placeholder="Correo..." className="mb-4 border-b-1 border-secondary outline-none"/>

          <label className="text-secondary text-xs">Contraseña</label>
          <div className="relative mb-4">
            <input type="password" placeholder="Contraseña..." className="w-full border-b-1 border-secondary outline-none pr-10"/>
            {VerContrasenia ? (
              <IconEye stroke={2} onClick={verPassword} className='absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer'/>
            ) : (
              <IconEyeOff stroke={2} onClick={verPassword} className='absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer'/>
            )}
          </div>

          <p className="mb-5 text-secondary text-xs cursor-pointer">¿Olvidaste tu contraseña?</p>
          <Confirmar className="mx-auto mb-5 cursor-pointer" texto="Continuar" colorFondo={"bg-secondary"} colorTexto="text-white" ancho="w-50" alto="h-10" rounded="rounded-xl"/>
        </form>

        <p className="font-tertiary text-center w-55 text-3xl mb-5">O</p>

        {/* Contenedor para centrar los botones */}
        <div className="flex flex-col gap-2 items-center">
          {/* Botón Facebook */}
          <button className=" cursor-pointer flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#166FE5] text-white font-medium py-2 px-4 w-full max-w-xs rounded-md shadow-md">
            <img src={iconFacebook} alt="Facebook" className="w-5 h-5" />
            Log In with Facebook
          </button>

          {/* Botón Google */}
          <button className=" cursor-pointer flex items-center justify-center gap-2 border border-gray-300 bg-white hover:bg-gray-100 text-gray-600 font-medium py-2 px-4 w-full max-w-xs rounded-md shadow-md">
            <img src={iconGoogle} alt="Google" className="w-5 h-5" />
            Log In with Google
          </button>
        </div>
        <p className='mt-4 text-secondary text-xs text-center cursor-pointer'>¿No tenés cuenta? Registrate</p>
      </section>
    </>
  )
}

export default ModalLogin