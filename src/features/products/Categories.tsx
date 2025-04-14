import React from 'react';
import clsx from 'clsx'; // clsx nos permite condicionar clases fácilmente

interface CategoriesProps {
  categories: { name: string; image: string }[]; // Lista de categorías con nombre e imagen
  selectedCategory?: string; // Categoría actualmente seleccionada
  onSelectCategory: (category: string) => void; // Función para cambiar la categoría
}

// Componente funcional que recibe props y muestra las tarjetas de categoría
export const Categories: React.FC<CategoriesProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex gap-8 overflow-x-auto mb-5 ">
      {/* Mapeamos cada categoría y creamos un botón cuadrado */}
      {categories.map((cat) => (
        <button
          key={cat.name}
          onClick={() => onSelectCategory(cat.name)} // Al hacer clic, se cambia la categoría activa
          className={clsx(
            'flex flex-col items-center w-24 min-w-[96px] py-2 px-2 rounded-sm text-white transition duration-200',
            selectedCategory === cat.name ? 'bg-[#9e1c1c]' : 'bg-[#d32f2f] hover:bg-[#c62828]'
          )}
        >
          {/* Imagen de la categoría */}
          <img src={cat.image} alt={cat.name} className="h-18 object-contain mb-2" />
          {/* Nombre de la categoría */}
          <span className="text-xs font-semibold">{cat.name}</span>
        </button>
      ))}
    </div>
  );
};
