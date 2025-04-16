import React from 'react';
import { IconArrowLeft, IconShoppingCart } from '@tabler/icons-react';

interface HeaderProps {
  showBackButton?: boolean;
  onBackClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ showBackButton = true, onBackClick }) => (
  <header className="flex items-center justify-between mb-5">
    {/* Botón Volver */}
    {showBackButton ? (
      <div className="flex items-center space-x-2 cursor-pointer" onClick={onBackClick}>
        <div className="bg-orange-400 rounded-full p-0.5">
          <IconArrowLeft color="white" />
        </div>
        <span className="font-bowlby-one-sc text-black text-base">VOLVER</span>
      </div>
    ) : (
      <div /> // Espacio vacío para mantener el layout
    )}

    {/* Logo */}
    <div className="flex-grow flex justify-center">
      <img
        src="src\\assets\\el_buen_sabor_logo.png"
        alt="Logo El Buen Sabor"
        className="h-20 w-auto"
      />
    </div>

    {/* Usuario + Carrito */}
    <div className="flex items-center space-x-3">
      <span className="font-bebas-neue text-black text-base">GERONIMO</span>
      <div className="h-5 border-l border-black"></div>
      <IconShoppingCart color="black" fill="" />
    </div>
  </header>
);