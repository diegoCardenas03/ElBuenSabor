import React, { useState } from 'react';
import { Header } from '../components/commons/Header';
import { Footer } from '../components/commons/Footer';
import { ProductFilterModal } from '../features/products/ProductFilterModal';
import { FaSearch } from "react-icons/fa";
import { HiOutlineAdjustments } from "react-icons/hi";

interface MenuLayoutProps {
  children: React.ReactNode;
  onSearch: (searchTerm: string) => void;
  onFiltersChange?: (filters: { order: string; bestseller: boolean }) => void;
}

export const MenuLayout: React.FC<MenuLayoutProps> = ({ children, onSearch, onFiltersChange }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<{ order: string; bestseller: boolean }>({ order: '', bestseller: false });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleApplyFilters = (newFilters: { order: string; bestseller: boolean }) => {
    setFilters(newFilters);
    if (onFiltersChange) onFiltersChange(newFilters);
  };

  const removeFilter = (key: 'order' | 'bestseller') => {
    const updated = {
      ...filters,
      [key]: key === 'order' ? '' : false
    };
    setFilters(updated);
    if (onFiltersChange) onFiltersChange(updated);
  };

  // Etiquetas según filtro seleccionado
  const chips = [
    {
      active: filters.order === 'asc',
      label: 'Menor a mayor precio',
      onRemove: () => removeFilter('order')
    },
    {
      active: filters.order === 'desc',
      label: 'Mayor a menor precio',
      onRemove: () => removeFilter('order')
    },
    {
      active: filters.bestseller,
      label: 'Más vendidos',
      onRemove: () => removeFilter('bestseller')
    }
  ];

  return (
    <div className="bg-[#FFF4E0] min-h-screen relative overflow-hidden">
      {/* Imágenes decorativas de fondo */}
      <img
        src="src/assets/pizza-fondo-com.png"
        alt="Pizza izquierda"
        className="absolute top-[10rem] left-0 w-80 z-0"
      />
      <img
        src="src/assets/pizza-fondo-ext.png"
        alt="Pizza derecha"
        className="absolute top-[30rem] right-0 w-80 z-0"
      />
      <img
        src="src/assets/hambur-fondo.png"
        alt="Hamburguesa central"
        className="absolute bottom-30 left-1/2 transform -translate-x-1/2 w-180 select-none z-0"
      />

      <div className="relative z-10 py-3 px-2 sm:px-5">
        <Header />

        {/* Título */}
        <h2 className="font-tertiary text-center text-3xl sm:text-4xl text-black mb-8 pt-6">MENÚ</h2>

        {/* Buscador y botón de filtros */}
        <div className="flex flex-row sm:flex-row justify-center gap-2 sm:gap-4 w-full max-w-2xl mx-auto">
          <div className="relative w-full sm:w-64">
            <FaSearch className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 mr-2" height="20"/>
            <input
              type="text"
              placeholder="Buscar por nombre"
              value={searchTerm}
              onChange={handleSearchChange}
              className="bg-white border px-4 py-2 rounded-4xl w-full"
            />
          </div>
          <button
            className="bg-secondary hover:bg-[#c62828] rounded-full p-2 flex items-center justify-center w-10 h-10 self-center cursor-pointer"
            onClick={() => setFilterModalOpen(true)}
          >
            <HiOutlineAdjustments className='rotate-90 w-6 h-6' color="white"/>
          </button>
        </div>
        {/* Etiquetas de filtros activos debajo */}
        <div className="flex flex-wrap justify-center mb-4 gap-2 min-h-[2.5rem] w-full max-w-2xl mx-auto">
          {chips.filter(chip => chip.active).map(chip => (
            <span
              key={chip.label}
              className="bg-orange-200 text-orange-800 rounded-full px-3 text-sm flex items-center gap-1 font-semibold mt-2"
            >
              {chip.label}
              <button onClick={chip.onRemove} className="ml-1 font-bold focus:outline-none">×</button>
            </span>
          ))}
        </div>

        {/* Modal de filtros */}
        <ProductFilterModal
          isOpen={filterModalOpen}
          onClose={() => setFilterModalOpen(false)}
          onApply={handleApplyFilters}
          initialFilters={filters}
        />

        <main>{children}</main>
      </div>

      <Footer />
    </div>
  );
};