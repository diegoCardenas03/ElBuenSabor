import React from 'react';
import usuarioImg from '../assets/img/usuarioLogeado.jpg';
import iconLogin from '../assets/icons/user.svg';
import iconOrders from '../assets/icons/order.svg';
import iconLocation from '../assets/icons/location.svg';
import iconMenu from '../assets/icons/menu.svg';
import iconLogout from '../assets/icons/logout.svg';
import iconClose from '../assets/icons/close.svg';

interface NavbarProps {
  open: boolean;
  onClose: () => void;
  usuarioLogeado: boolean;
  nombreUsuario: string;
}

const navbarLinks = [
  { icon: iconLogin, texto: 'Mi Perfil' },
  { icon: iconOrders, texto: 'Mis Ordenes' },
  { icon: iconLocation, texto: 'Mis Direcciones' },
];

const navbarLinks2 = [
  { icon: iconMenu, texto: 'Menu' },
  { icon: iconLogin, texto: 'Contactanos' },
];

export const Navbar: React.FC<NavbarProps> = ({
  open,
  onClose,
  usuarioLogeado,
  nombreUsuario,
}) => {
  if (!usuarioLogeado) return null;

  return (
    <div className={`z-20 pt-6 w-60 fixed top-0 right-0 h-full bg-secondary transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex justify-end">
        <img src={iconClose} alt="Cerrar Navbar" onClick={onClose} className="w-7 h-7 cursor-pointer mr-4" />
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
          <div key={index} className="flex items-center gap-2 w-50 m-auto mb-4 mt-4">
            <img src={link.icon} alt={link.texto} className="w-7 h-7" />
            <p className="text-quaternary">{link.texto}</p>
          </div>
        ))}
      </div>
      <hr className='text-quaternary w-40 m-auto' />
      <div className='p-4 ml-4 mb-4 cursor-pointer'>
        {navbarLinks2.map((link, index) => (
          <div key={index} className="flex items-center gap-2 w-50 m-auto mb-4 mt-4">
            <img src={link.icon} alt={link.texto} className="w-7 h-7" />
            <p className="text-quaternary">{link.texto}</p>
          </div>
        ))}
      </div>
      <div className='p-4 ml-4 mb-4 cursor-pointer'>
        <div className='flex items-center gap-2 w-50 m-auto mb-4'>
          <img src={iconLogout} alt="Cerrar Sesion" className="w-7 h-7" />
          <p className="text-quaternary">Cerrar Sesion</p>
        </div>
      </div>
    </div>
  );
};
