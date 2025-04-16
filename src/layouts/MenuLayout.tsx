import React, { useState } from 'react';
import { IconAdjustmentsHorizontal, IconSearch } from '@tabler/icons-react';
import { Header } from '../components/Header';

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
      <Header />

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
