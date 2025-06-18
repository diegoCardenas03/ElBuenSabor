import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import iconFacebook from '../../assets/icons/facebook.svg';
import iconGoogle from '../../assets/icons/iconGoogle.svg';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth0 } from '@auth0/auth0-react';
import { useAuthHandler } from '../../hooks/useAuthHandler';
import { Loader } from '../commons/Loader';
import Swal from 'sweetalert2';

interface ModalLoginProps {
  onClose?: () => void;
  onSwitchToRegister?: () => void;
}

type LoginFormData = {
  email: string;
  password: string;
};

const ModalLogin: React.FC<ModalLoginProps> = ({ onClose, onSwitchToRegister }) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });

  const [verContrasenia, setVerContrasenia] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const [isTraditionalLoading, setIsTraditionalLoading] = useState<boolean>(false);

  const { loginWithPopup, isAuthenticated } = useAuth0();
  
  // ✅ USAR FUNCIONES CENTRALIZADAS
  const { authStatus, loginTraditional } = useAuthHandler();

  // Cerrar modal cuando se complete la autenticación
  useEffect(() => {
    if (isAuthenticated && authStatus === 'completed') {
      onClose?.();
    }
  }, [isAuthenticated, authStatus, onClose]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ✅ LOGIN TRADICIONAL SIMPLIFICADO
  const handleTraditionalLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsTraditionalLoading(true);

    try {
      // ✅ USAR FUNCIÓN CENTRALIZADA
      const result = await loginTraditional(formData.email, formData.password);

      Swal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: `Hola ${result.data.nombreCompleto}`,
        timer: 2000,
        showConfirmButton: false
      });

      onClose?.();

    } catch (error: any) {
      console.error('Error en login:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error de inicio de sesión',
        text: error?.response?.data?.message || 'Credenciales incorrectas'
      });
    } finally {
      setIsTraditionalLoading(false);
    }
  };

  // Login con Google
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

  const verPassword = (): void => {
    setVerContrasenia(!verContrasenia);
  };

  return (
    <>
      <section className="py-3 pb-0 rounded-xl w-60 h-auto bg-primary m-auto sm:w-80 sm:px-2 sm:py-5 font-primary">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h2 className="text-lg font-extrabold text-secondary sm:text-xl">Inicia Sesión</h2>
            <p className="text-tertiary">¡Vamos y entra a tu cuenta!</p>
          </div>
        </div>

        <form onSubmit={handleTraditionalLogin} className="flex flex-col">
          <label className="text-secondary text-xs">Correo</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Correo..."
            className="mb-4 border-b border-secondary outline-none bg-transparent"
            required
          />

          <label className="text-secondary text-xs">Contraseña</label>
          <div className="relative mb-4">
            <input
              type={verContrasenia ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Contraseña..."
              className="w-full border-b border-secondary outline-none bg-transparent pr-10"
              required
            />
            <div className='absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer'>
              {verContrasenia ? (
                <FaEye className="text-secondary" onClick={verPassword} />
              ) : (
                <FaEyeSlash className='text-secondary' onClick={verPassword} />
              )}
            </div>
          </div>

          <p className="mb-5 text-secondary text-xs cursor-pointer hover:underline">¿Olvidaste tu contraseña?</p>

          <button
            type="submit"
            disabled={isTraditionalLoading}
            className="mx-auto mb-2 cursor-pointer bg-secondary text-white w-50 h-10 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isTraditionalLoading ? <Loader /> : 'Iniciar Sesión'}
          </button>
        </form>

        <p className="font-tertiary text-center text-3xl my-3">O</p>

        {/* Botones de redes sociales */}
        <div className="flex flex-col gap-3 items-center w-full">
          {/* Botón Facebook */}
          <button className="flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#166FE5] text-white font-medium py-2 w-full max-w-xs rounded-md shadow-md transition-colors cursor-pointer">
            <img src={iconFacebook} alt="Facebook" className="w-5 h-5 object-contain" style={{ minWidth: '20px' }} />
            <span className="whitespace-nowrap">Continuar con Facebook</span>
          </button>

          {/* Botón Google */}
          <button
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading || authStatus === 'checking'}
            className="flex items-center justify-center gap-3 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 w-full max-w-xs rounded-md shadow-md transition-colors cursor-pointer"
          >
            <img src={iconGoogle} alt="Google" className="w-5 h-5 object-contain" style={{ minWidth: '20px' }} />
            <span className="whitespace-nowrap">
              {isGoogleLoading || authStatus === 'checking' ? <Loader /> : 'Continuar con Google'}
            </span>
          </button>
        </div>

        <p className='mt-4 text-secondary text-xs text-center cursor-pointer hover:underline' onClick={onSwitchToRegister}>
          ¿No tenés cuenta? Registrate
        </p>
      </section>
    </>
  );
};

export default ModalLogin;