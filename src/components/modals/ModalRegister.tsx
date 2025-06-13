import { useEffect, useState } from "react";
import Confirmar from '../commons/Confirmar';
import iconFacebook from '../../assets/icons/facebook.svg';
import iconGoogle from '../../assets/icons/iconGoogle.svg';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuthHandler } from "../../hooks/useAuthHandler";
import { useAuth0 } from "@auth0/auth0-react";
import { Loader } from "../commons/Loader";

interface ModalRegisterProps {
  onClose?: () => void; // Para cerrar el modal desde el componente padre
}


const ModalRegister: React.FC<ModalRegisterProps> = ({onClose}) => {

  const [VerContrasenia, setVerContrasenia] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

  const { loginWithPopup, isAuthenticated } = useAuth0();
  const { authStatus } = useAuthHandler();

  useEffect(() => {
    if (isAuthenticated && authStatus === 'completed') {
      onClose?.();
    }
  }, [isAuthenticated, authStatus, onClose]);

  const verPassword = (): void => {
    setVerContrasenia(!VerContrasenia);
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await loginWithPopup({
      authorizationParams: {
        connection: 'google-oauth2',
        prompt: 'select_account'
      }
    });
    } catch (error) {
      console.error('Error en login con Google:', error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <>
      <section className="py-3 pb-0 rounded-xl w-60 h-90 bg-primary m-auto sm:w-80 sm:px-2 sm:py-5 font-primary md:w-90 md:h-100" >
        <div className="flex justify-between items-center mb-3">
          <div>
            <h2 className="text-2xl font-extrabold text-secondary sm:text-3xl">Registrate</h2>
            <p className="text-tertiary">¡Vamos y crea una cuenta!</p>
          </div>
        </div>
        <form action="" className="flex flex-col">
          <label className="text-secondary text-xs">Nombre Completo</label>
          <input type="text" placeholder="Nombre Completo..." className="mb-4 border-b-1 border-secondary outline-none" />

          <label className="text-secondary text-xs">Telefono</label>
          <div className="relative mb-4">
            <input type="tel" placeholder="Telefono..." className="w-full border-b-1 border-secondary outline-none pr-10" />
          </div>
          <label className="text-secondary text-xs">Email</label>
          <div className="relative mb-4">
            <input type="email" placeholder="Correo..." className="w-full border-b-1 border-secondary outline-none pr-10" />
          </div>
          <label className="text-secondary text-xs">Contraseña</label>
          <div className="relative mb-4">
            <input type="password" placeholder="Contraseña..." className="w-full border-b-1 border-secondary outline-none pr-10" />
            {VerContrasenia ? (
              <FaEye className="absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer" onClick={verPassword} />
            ) : (
              <FaEyeSlash className='absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer' onClick={verPassword} />
            )}
          </div>
          <label className="text-secondary text-xs">Repetir Contraseña</label>
          <div className="relative mb-4">
            <input type="password" placeholder="Contraseña..." className="w-full border-b-1 border-secondary outline-none pr-10" />
            {VerContrasenia ? (
              <FaEye className="absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer" onClick={verPassword} />
            ) : (
              <FaEyeSlash className='absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer' onClick={verPassword} />
            )}
          </div>
          <Confirmar className="mx-auto mb-2 cursor-pointer" texto="Continuar" colorFondo={"bg-secondary"} colorTexto="text-white" ancho="w-50" alto="h-10" rounded="rounded-xl" />
        </form>
        <p className="font-tertiary text-center text-3xl mb-2">O</p>

        {/* Contenedor para centrar los botones */}
        <div className="flex flex-col gap-2 items-center">
          {/* Botón Facebook */}
          <button className=" cursor-pointer flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#166FE5] text-white font-medium py-1 px-3 w-full max-w-xs rounded-md shadow-md">
            <img src={iconFacebook} alt="Facebook" className="w-4 h-4" />
            Log In with Facebook
          </button>

          {/* Botón Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading || authStatus === 'checking'}
            className=" cursor-pointer flex items-center justify-center gap-2 border border-gray-300 bg-white hover:bg-gray-100 text-gray-600 font-medium py-1 px-3 w-full max-w-xs rounded-md shadow-md">
            <img src={iconGoogle} alt="Google" className="w-4 h-4" />
            {isGoogleLoading || authStatus === 'checking' ? <Loader/> : 'Log In with Google'}
          </button>
        </div>
        <p className='mt-4 text-secondary text-xs text-center cursor-pointer pb-5'>¿Ya tenés cuenta? Iniciá sesión</p>
      </section>
    </>
  )
}

export default ModalRegister;