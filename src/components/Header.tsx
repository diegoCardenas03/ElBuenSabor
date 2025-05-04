import React, { useState } from 'react';
import { FaArrowLeft, FaShoppingCart } from "react-icons/fa";
import { Navbar } from './Navbar';
import logo from "../assets/el_buen_sabor_logo.png";
interface HeaderProps {
  showBackButton?: boolean;
  onBackClick?: () => void;
  whiteUserBar?: boolean;
  nombreUsuario?: string;
}

export const Header: React.FC<HeaderProps> = ({
  showBackButton = true,
  onBackClick,
  whiteUserBar = false,
  nombreUsuario = "Tung Tung Sahur",
}) => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const usuarioLogeado = false;

  const handleUserClick = () => setNavbarOpen(true);
  const handleCloseNavbar = () => setNavbarOpen(false);

  return (
    <header className="relative flex items-center justify-between mb-5 h-20 px-7 mt-2">
      {/* Izquierda - Contenedor dinámico */}
      <div className="flex-shrink-0 flex items-center z-10">
        {showBackButton ? (
          <div className="flex items-center space-x-2 cursor-pointer" onClick={onBackClick}>
            <div className="bg-orange-400 rounded-full p-1.5">
              <FaArrowLeft color='white'/>
            </div>
            <span className="font-tertiary text-black text-base">VOLVER</span>
          </div>
        ) : (
          // Logo a la izquierda cuando no hay botón de logo
          <img src={logo} alt="Logo El Buen Sabor" className="h-20 w-100%"/>
        )}
      </div>

      {/* Logo centrado solo cuando hay botón de volver */}
      {showBackButton && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center">
          <img src={logo} alt="Logo El Buen Sabor" className="h-20 w-100%"/>
        </div>
      )}

      {/* Derecha - Sección de usuario y carrito */}
      <div className="flex-shrink-0 flex items-center space-x-3 z-10">
        <span
          className={`font-secondary text-base cursor-pointer max-w-[120px] truncate ${
            whiteUserBar ? 'text-white' : 'text-black'
          }`}
          onClick={handleUserClick}
          title={nombreUsuario}
        >
          {nombreUsuario}
        </span>
        <div
          className={`h-5 border-l flex-shrink-0 ${
            whiteUserBar ? 'border-white' : 'border-black'
          }`}
        ></div>
        <FaShoppingCart className='flex-shrink-0' fill={whiteUserBar ? 'white' : ''} color={whiteUserBar ? 'white' : 'black'}/>
      </div>

      {/* Navbar lateral */}
      <Navbar
        open={navbarOpen}
        onClose={handleCloseNavbar}
        usuarioLogeado={usuarioLogeado}
        nombreUsuario={nombreUsuario}
      />
    </header>
  );
};