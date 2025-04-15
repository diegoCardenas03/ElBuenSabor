import React, { useState } from 'react';
import { IconArrowLeft, IconShoppingCart, IconAdjustmentsHorizontal, IconSearch } from '@tabler/icons-react';

interface MenuLayoutProps {
  children: React.ReactNode;
  onSearch: (searchTerm: string) => void; // Función para manejar el término de búsqueda
}

export const MenuLayout: React.FC<MenuLayoutProps> = ({ children, onSearch }) => {

  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value); // Pasar el término de búsqueda al componente padre
  };

  return (
    <div className="bg-[#FFF4E0] min-h-screen px-5 py-3">
      <header className="flex items-center justify-between mb-5">
        {/* Botón Volver */}
        <div className="flex items-center space-x-2 cursor-pointer">
          <div className="bg-orange-400 rounded-full p-0.5">
            <IconArrowLeft color="white" />
          </div>
          <span className="font-bowlby-one-sc text-black text-base">VOLVER</span>
        </div>

        {/* Logo */}
        <div className="flex-grow flex justify-center">
          <img
            src="src\assets\el_buen_sabor_logo.png" // Reemplazá con la ruta de tu logo
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

      {/* Título */}
      <h2 className="font-bowlby-one-sc text-center text-4xl text-black mb-10 pt-8">MENÚ</h2>

       {/* Buscador por nombre */}
       <div className="flex justify-center mb-10 gap-4">
        <div className="relative w-64">
          <IconSearch className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500" height="20" />
          <input
            type="text"
            placeholder="Buscar por nombre"
            value={searchTerm}
            onChange={handleSearchChange}
            className="bg-white border px-4 py-1 rounded-4xl w-66"
          />
        </div>
        <button className='bg-[#BD1E22] rounded-full p-1.5 cursor-pointer'>
          <IconAdjustmentsHorizontal color='white' height='20' />
        </button>
      </div>
      <main>{children}</main>
    </div>
  );
};
