import Logo from '../assets/img/BuenSaborLogo.png';
import { useState } from 'react';

// Icons
import usuarioLogeado from '../assets/img/usuarioLogeado.jpg';



import { IconShoppingCartFilled, IconUserFilled, IconReceiptFilled, IconMapPinFilled, IconToolsKitchen2, IconLogout, IconX} from '@tabler/icons-react';
//Modal
import ModalLogin from './ModalLogin';


const Navbar: React.FC = () => {
  const [UsuarioLogeado, setUsuarioLogeado] = useState<boolean>(false);
  const [NavbarAbierto, setNavbarAbierto] = useState<boolean>(false);
  const [abrirModalLogin, setAbrirModalLogin] = useState<boolean>(false);
  
  const navbarLinks = [
    { icon:<IconUserFilled stroke={1} fill='white' className="w-7 h-7  lg:w-7 lg:h-7" /> , texto: 'Mi Perfil' },
    { icon:<IconReceiptFilled stroke={1} fill='white' className="w-7 h-7  lg:w-7 lg:h-7" /> , texto: 'Mis Ordenes' },
    { icon:<IconMapPinFilled stroke={1} fill='white' className="w-7 h-7  lg:w-7 lg:h-7"/> , texto: 'Mis Direcciones' },
  ]

  const navbarLinks2 =  [
    { icon:<IconToolsKitchen2 color="white" stroke={2} fill='white' className="w-7 h-7  lg:w-7 lg:h-7" /> , texto: 'Menu' },
    { icon:<IconUserFilled stroke={1} fill='white' className="w-7 h-7  lg:w-7 lg:h-7" /> , texto: 'Contactanos' },
  ]

  const Logearse = (): void => {
    // setUsuarioLogeado(true); // Abre el modal de login
    setAbrirModalLogin(true); // Abre el modal de login
  };

  const cerrarModalLogin = (): void => {
    setAbrirModalLogin(false); // Cierra el modal de login
  };

  const abrirNavbar = (): void => {
    setNavbarAbierto(!NavbarAbierto);
  };

  return (
    <>
      <nav className="w-screen h-17 bg-primary flex justify-between items-center px-4 z-10 lg:px-10">
        <img src={Logo} alt="Logo Buen Sabor" />
        <div className="flex items-center gap-5">
          {UsuarioLogeado ? (
            <p onClick={abrirNavbar} className="cursor-pointer">Martinez SA</p>
          ) : (
            <p onClick={Logearse} className="cursor-pointer">INGRESAR</p>
          )}
          <IconShoppingCartFilled />
        </div>
      </nav>

      {/* Navbar Abierto */}
      <section className={`z-20 pt-6 w-60 fixed top-0 right-0 h-full bg-secondary transition-transform duration-300 lg:w-70 ${NavbarAbierto ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-end">
          <IconX stroke={2} color='white' onClick={abrirNavbar} className="w-7 h-7 cursor-pointer mr-4" />

        </div> 
        <div className="p-4 pt-0 flex align-top justify-between lg:mr-5">
          <img src={usuarioLogeado} alt="Usuario" className="w-12 h-12 rounded-full mx-auto" />
          <div className="text-start mt-2 flex flex-col gap-1">
            <p className="font-tertiary text-tertiary text-sm lg:text-base">Martinez SA</p>
            <p className="text-xs text-quaternary ">tengo3prop@gmail.com</p>
          </div>
        </div>
        <hr className='text-quaternary w-40 m-auto lg:w-50' />
        <div className="p-4 ml-4 cursor-pointer lg:pl-0">
          {navbarLinks.map((link, index) => (
            <div key={index} className="flex items-center gap-2 w-50 m-auto mb-4 mt-4">
              {link.icon}
              <p className="text-quaternary lg:text-base">{link.texto}</p>
            </div>
          ))}
        </div>
        <hr className='text-quaternary w-40 m-auto lg:w-50' />
        <div className='p-4 ml-4 mb-4 cursor-pointer lg:pl-0'>
          {navbarLinks2.map((link, index) => (
            <div key={index} className="flex items-center gap-2 w-50 m-auto mb-4 mt-4">
              {link.icon}
              <p className="text-quaternary lg:text-base">{link.texto}</p>
            </div>
          ))}
        </div>
        <div className='p-4 ml-4 mb-4 cursor-pointer lg:pl-0'>
          <div className='flex items-center gap-2 w-50 m-auto mb-4'>
            <IconLogout stroke={2} color='white' fill='none' className="w-7 h-7  lg:w-7 lg:h-7"  />
            <p className="text-quaternary lg:text-base">Cerrar Sesion</p>
          </div>
        </div>
      </section>

      {/* Modal Login */}
      {abrirModalLogin && (
        <div className="fixed inset-0  bg-opacity-60 flex justify-center items-center z-30 mt-30">
          <div className="relative bg-primary p-5 pt-0 rounded-xl shadow-lg">
            <ModalLogin />
            <IconX stroke={2} onClick={cerrarModalLogin} className="absolute top-4 right-4" />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;