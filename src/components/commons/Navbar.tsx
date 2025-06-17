import usuarioImg from '../../assets/img/usuarioLogeado.jpg';
import { useState } from 'react';
import ModalLogin from '../modals/ModalLogin';
import ModalRegister from '../modals/ModalRegister';
import { FaTimes, FaUser, FaClipboardList, FaMapMarkerAlt, FaUtensils, FaSignOutAlt } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

interface NavbarProps {
  open: boolean;
  onClose: () => void;
  usuarioLogeado: boolean;
  nombreUsuario: string;
  fotoUsuario?: string | null;
  emailUsuario?: string | null;
  whiteUserBar?: boolean;
}

const navbarLinks = [
  { icon: <FaUser stroke='1' fill='white' className="w-6 h-6" />, texto: 'Mi Perfil', to: '/MiPerfil' },
  { icon: <FaClipboardList stroke='1' fill='white' className="w-6 h-6" />, texto: 'Mis Ordenes', to: '/MisPedidos' },
  { icon: <FaMapMarkerAlt stroke='1' fill='white' className="w-6 h-6" />, texto: 'Mis Direcciones', to: '/MisDirecciones' }
];

const navbarLinks2 = [
  { icon: <FaUtensils className="w-6 h-6" />, texto: 'Menu', to: '/Menu' },
  { icon: <FaUser stroke='1' className="w-6 h-6" />, texto: 'Contactanos', to: '' }
];

export const Navbar: React.FC<NavbarProps> = ({
  open,
  onClose,
  usuarioLogeado,
  nombreUsuario,
  whiteUserBar = false,
  fotoUsuario,
  emailUsuario
}) => {
  const [abrirModalLogin, setAbrirModalLogin] = useState<boolean>(false);
  const [tipoModal, setTipoModal] = useState<'login' | 'register'>('login');

  const { logout } = useAuth0();

  // ✅ AGREGAR: Función para manejar clics en enlaces
  const handleLinkClick = () => {
    onClose(); // Cerrar el navbar antes de navegar
  };

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };

  const abrirLogin = () => {
    setTipoModal('login');
    setAbrirModalLogin(true);
  };

  const abrirRegister = () => {
    setTipoModal('register');
    setAbrirModalLogin(true);
  };

  const cerrarModal = () => {
    setAbrirModalLogin(false);
  };

  // ✅ AGREGAR: Funciones para cambiar entre modales
  const cambiarARegister = () => {
    console.log('Cambiando a registro desde navbar');
    setTipoModal('register');
  };

  const cambiarALogin = () => {
    console.log('Cambiando a login desde navbar');
    setTipoModal('login');
  };

  // Si no está logeado, muestra solo el botón de login
  if (!usuarioLogeado) {
    return (
      <>
        <div className={`z-20 pt-6 w-60 fixed top-0 right-0 h-full bg-secondary transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex justify-end">
            <FaTimes stroke='2' color={whiteUserBar ? "white" : "black"} onClick={onClose} className="w-7 h-7 cursor-pointer mr-4" />
          </div>
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <button
              className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-full font-semibold cursor-pointer"
              onClick={abrirLogin}
            >
              Ingresar
            </button>
            {/* ✅ AGREGAR: Botón de registro */}
          </div>
        </div>

        {/* ✅ CORREGIR: Modal dinámico con funciones de cambio */}
        {abrirModalLogin && (
          <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-30">
            <div className="relative bg-primary p-5 pt-0 rounded-xl shadow-lg overflow-y-auto overflow-x-hidden">
              {tipoModal === 'login' ? (
                <ModalLogin
                  onClose={cerrarModal}
                  onSwitchToRegister={cambiarARegister} // ✅ AGREGAR
                />
              ) : (
                <ModalRegister
                  onClose={cerrarModal}
                  onSwitchToLogin={cambiarALogin} // ✅ AGREGAR
                />
              )}
              <FaTimes stroke='4' onClick={cerrarModal} className="w-6 h-6 absolute top-4 right-4 cursor-pointer" />
            </div>
          </div>
        )}
      </>
    );
  }

  // Si está logeado, muestra el menú lateral completo
  return (
    <>
      <div className={`z-20 pt-6 w-60 fixed top-0 right-0 h-full bg-secondary transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'} `}>
        <div className="flex justify-end">
          <FaTimes stroke='2' color={whiteUserBar ? "white" : "black"} onClick={onClose} className="w-7 h-7 cursor-pointer mr-4" aria-label="cerrar navbar" />
        </div>
        <div className="p-4 pt-0 flex flex-row items-center gap-3">
          <img
            src={fotoUsuario || usuarioImg}
            alt="Usuario"
            className="w-12 h-12 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex flex-col min-w-0">
            <p className={`font-tertiary text-tertiary text-sm ${whiteUserBar ? "text-white" : "text-black"} truncate max-w-[120px]`}>
              {nombreUsuario}
            </p>
            <p className={`text-xs ${whiteUserBar ? "text-white" : "text-quaternary"} truncate max-w-[120px]`}>
              {emailUsuario || "Sin email"}
            </p>
          </div>
        </div>
        <hr className={`${whiteUserBar ? "border-white" : "text-quaternary"} w-40 m-auto`} />
        <div className="p-4 ml-4 cursor-pointer">
          {navbarLinks.map((link, index) => (
            <Link
              to={link.to}
              key={index}
              className={`flex items-center gap-2 w-50 m-auto mb-4 mt-4 ${whiteUserBar ? "text-white" : "text-black"}`}
              onClick={handleLinkClick} // ✅ AGREGAR: Cerrar navbar al hacer clic
            >
              {link.icon}
              <p className={whiteUserBar ? "text-white" : "text-black"}>{link.texto}</p>
            </Link>
          ))}
        </div>
        <hr className={`${whiteUserBar ? "border-white" : "text-quaternary"} w-40 m-auto`} />
        <div className='p-4 ml-4 mb-4 cursor-pointer'>
          {navbarLinks2.map((link, index) => (
            <Link
              to={link.to}
              key={index}
              className={`flex items-center gap-2 w-50 m-auto mb-4 mt-4 ${whiteUserBar ? "text-white" : "text-black"}`}
              onClick={handleLinkClick} // ✅ AGREGAR: Cerrar navbar al hacer clic
            >
              {link.icon}
              <p className={whiteUserBar ? "text-white" : "text-black"}>{link.texto}</p>
            </Link>
          ))}
        </div>
        <div className='p-4 ml-4 mb-4 cursor-pointer'>
          <div
            className={`flex items-center gap-2 w-50 m-auto mb-4 ${whiteUserBar ? "text-white" : "text-black"}`}
            onClick={handleLogout}
            tabIndex={0}
            role="button"
            aria-label="Cerrar Sesión"
          >
            <FaSignOutAlt className="w-6 h-6" color={whiteUserBar ? "white" : "black"} />
            <p className={whiteUserBar ? "text-white" : "text-quaternary"}>Cerrar Sesion</p>
          </div>
        </div>
      </div>
    </>
  );
};