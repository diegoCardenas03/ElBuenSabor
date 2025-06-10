import usuarioImg from '../../assets/img/usuarioLogeado.jpg';
import { useState } from 'react';
import ModalLogin from '../modals/ModalLogin';
import ModalRegister from '../modals/ModalRegister';
import { FaTimes, FaUser, FaClipboardList, FaMapMarkerAlt, FaUtensils, FaSignOutAlt  } from "react-icons/fa";
import { Link } from 'react-router-dom';

interface NavbarProps {
  open: boolean;
  onClose: () => void;
  usuarioLogeado: boolean;
  nombreUsuario: string;
}

const navbarLinks = [
  { icon: <FaUser stroke='1' fill='white' className="w-6 h-6" />, texto: 'Mi Perfil', to:'/MiPerfil' },
  { icon: <FaClipboardList  stroke='1' fill='white' className="w-6 h-6" />, texto: 'Mis Ordenes', to:'/MisPedidos' },
  { icon: <FaMapMarkerAlt stroke='1' fill='white' className="w-6 h-6" />, texto: 'Mis Direcciones', to:'/MisDirecciones' }
];

const navbarLinks2 = [
  { icon: <FaUtensils  color="white" stroke='1' fill='white' className="w-6 h-6" />, texto: 'Menu', to:'/Menu' },
  { icon: <FaUser stroke='1' fill='white' className="w-6 h-6" />, texto: 'Contactanos', to:'' }
];

export const Navbar: React.FC<NavbarProps> = ({
  open,
  onClose,
  usuarioLogeado,
  nombreUsuario,
}) => {
  const [abrirModalLogin, setAbrirModalLogin] = useState<boolean>(false);


  // Si no está logeado, muestra solo el botón de login
  if (!usuarioLogeado) {
    return (
      <>
        <div className={`z-20 pt-6 w-60 fixed top-0 right-0 h-full bg-secondary transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex justify-end">
            <FaTimes stroke='2' color='white' onClick={onClose} className="w-7 h-7 cursor-pointer mr-4"/>
          </div>
          <div className="flex flex-col items-center justify-center h-full">
            <button
              className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-full font-semibold cursor-pointer"
              onClick={() => setAbrirModalLogin(true)}
            >
              Ingresar
            </button>
          </div>
        </div>
        {/* Modal Login */}
        {abrirModalLogin && (
          <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-30">
            <div className="relative bg-primary p-5 pt-0 rounded-xl shadow-lg overflow-y-auto overflow-x-hidden">
              <ModalRegister />
              {/* <ModalRegister/> */}
              <FaTimes stroke='4' onClick={() => setAbrirModalLogin(false)} className="w-6 h-6 absolute top-4 right-4 cursor-pointer"/>

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
          <FaTimes stroke='2' color='white' onClick={onClose} className="w-7 h-7 cursor-pointer mr-4" aria-label="cerrar navbar"/>
        </div>
        <div className="p-4 pt-0 flex align-top justify-between">
          <img src={usuarioImg} alt="Usuario" className="w-12 h-12 rounded-full mx-auto" />
          <div className="text-start mt-2 flex flex-col gap-1">
            <p className="font-tertiary text-tertiary text-sm">{nombreUsuario}</p>
            <p className="text-xs text-quaternary">tengo3prop@gmail.com</p>
          </div>
        </div>
        <hr className='text-quaternary w-40 m-auto ' />
        <div className="p-4 ml-4 cursor-pointer">
          {navbarLinks.map((link, index) => (
            <Link to={link.to} key={index} className='text-white flex items-center gap-2 w-50 m-auto mb-4 mt-4'>
              {link.icon}
              <p className='text-quarternary'>{link.texto}</p>
            </Link>
          ))}
        </div>
        <hr className='text-quaternary w-40 m-auto' />
        <div className='p-4 ml-4 mb-4 cursor-pointer'>
            {navbarLinks2.map((link, index) => (
              <Link to={link.to} key={index} className='text-white flex items-center gap-2 w-50 m-auto mb-4 mt-4'>
                {link.icon}
                <p className='text-quarternary'>{link.texto}</p>
              </Link>
            ))}
        </div>
        <div className='p-4 ml-4 mb-4 cursor-pointer'>
          <div className='flex items-center gap-2 w-50 m-auto mb-4'>
            <FaSignOutAlt className="w-6 h-6 text-white" />
            <p className="text-quaternary">Cerrar Sesion</p>
          </div>
        </div>
      </div>
      {/* Modal Login */}
      {abrirModalLogin && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-30">
          <div className="relative bg-primary p-5 pt-0 rounded-xl shadow-lg">
            <ModalLogin />
            <FaTimes stroke='2' onClick={() => setAbrirModalLogin(false)} className="absolute top-4 right-4 cursor-pointer"/>
          </div>
        </div>
      )}
    </>
  );
};