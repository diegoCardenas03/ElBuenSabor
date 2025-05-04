import Confirmar from '../commons/Confirmar';
import { useState } from 'react';
import iconFacebook from '../../assets/icons/facebook.svg';
import iconGoogle from '../../assets/icons/iconGoogle.svg';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ModalLogin: React.FC = () => {
  const [VerContrasenia, setVerContrasenia] = useState<boolean>(false);

  const verPassword = (): void => {
    setVerContrasenia(!VerContrasenia);
  }

  return (
    <>
      {/* Modal Login */}
      <section className="py-3 pb-0 rounded-xl w-60 h-auto bg-primary m-auto sm:w-80 sm:px-2 sm:py-5 font-primary">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h2 className="text-lg font-extrabold text-secondary sm:text-xl">Inicia Sesión</h2>
            <p className="text-tertiary">¡Vamos y entra a tu cuenta!</p>
          </div>
        </div>
        
        <form action="" className="flex flex-col">
          <label className="text-secondary text-xs">Correo</label>
          <input type="email" placeholder="Correo..." className="mb-4 border-b border-secondary outline-none bg-transparent"/>

          <label className="text-secondary text-xs">Contraseña</label>
          <div className="relative mb-4">
            <input type={VerContrasenia ? "text" : "password"} placeholder="Contraseña..." className="w-full border-b border-secondary outline-none bg-transparent pr-10"/>
            <div className='absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer'>
              {VerContrasenia ? (
                <FaEye className="text-dark" onClick={verPassword}/>
              ) : (
                <FaEyeSlash className='text-dark' onClick={verPassword}/>
              )}
            </div>
          </div>

          <p className="mb-5 text-secondary text-xs cursor-pointer hover:underline">¿Olvidaste tu contraseña?</p>
          
          <Confirmar 
            className="mx-auto mb-2 cursor-pointer" 
            texto="Continuar" 
            colorFondo="bg-secondary" 
            colorTexto="text-white" 
            ancho="w-50" 
            alto="h-10" 
            rounded="rounded-xl"
          />
        </form>

        <p className="font-tertiary text-center text-3xl my-3">O</p>

        {/* Botones de redes sociales - Versión corregida */}
        <div className="flex flex-col gap-3 items-center w-full">
          {/* Botón Facebook - Alineación corregida */}
          <button className="flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#166FE5] text-white font-medium py-2 w-full max-w-xs rounded-md shadow-md transition-colors">
            <img src={iconFacebook} alt="Facebook" className="w-5 h-5 object-contain"style={{ minWidth: '20px' }}/>
            <span className="whitespace-nowrap">Continuar con Facebook</span>
          </button>

          {/* Botón Google - Alineación corregida */}
          <button className="flex items-center justify-center gap-3 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 w-full max-w-xs rounded-md shadow-md transition-colors">
            <img src={iconGoogle} alt="Google" className="w-5 h-5 object-contain"style={{ minWidth: '20px' }}/>
            <span className="whitespace-nowrap">Continuar con Google</span>
          </button>
        </div>
        
        <p className='mt-4 text-secondary text-xs text-center cursor-pointer hover:underline'>¿No tenés cuenta? Registrate</p>
      </section>
    </>
  )
}

export default ModalLogin;