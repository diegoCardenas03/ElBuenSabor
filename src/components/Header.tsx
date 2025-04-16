import React, { useState } from 'react';
import { IconArrowLeft, IconShoppingCart } from '@tabler/icons-react';
import { Navbar } from './Navbar';

interface HeaderProps {
  showBackButton?: boolean;
  onBackClick?: () => void;
  whiteUserBar?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  showBackButton = true,
  onBackClick,
  whiteUserBar = false,
}) => {
  const [navbarOpen, setNavbarOpen] = useState(false);

  const usuarioLogeado = true;
  const nombreUsuario = "Tung Tung Sahur";

  const handleUserClick = () => setNavbarOpen(true);
  const handleCloseNavbar = () => setNavbarOpen(false);

  return (
    <header className="relative flex items-center justify-between mb-5 h-20">
      {/* Izquierda */}
      <div className="flex-shrink-0 flex items-center z-10">
        {!whiteUserBar && showBackButton ? (
          <div className="flex items-center space-x-2 cursor-pointer" onClick={onBackClick}>
            <div className="bg-orange-400 rounded-full p-0.5">
              <IconArrowLeft color="white" />
            </div>
            <span className="font-tertiary text-black text-base">VOLVER</span>
          </div>
        ) : (
          <div className="w-[90px]" /> // Espacio reservado para alinear
        )}
      </div>

      {/* Logo centrado absolutamente */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center">
        <img
          src="src\\assets\\el_buen_sabor_logo.png"
          alt="Logo El Buen Sabor"
          className="h-20 w-auto"
        />
      </div>

      {/* Derecha */}
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
        <IconShoppingCart
          color={whiteUserBar ? 'white' : 'black'}
          fill={whiteUserBar ? 'white' : ''}
          className="flex-shrink-0"
        />
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