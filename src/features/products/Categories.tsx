import React from 'react';
import clsx from 'clsx';

interface CategoriesProps {
  categories: { id: string; name: string }[]; // Cambiar a string para uniqueIds
  selectedCategories: string[]; // Cambiar a array de strings
  onSelectCategory: (categoryId: string) => void; // Cambiar para recibir string
}

export const Categories: React.FC<CategoriesProps> = ({
  categories,
  selectedCategories,
  onSelectCategory,
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      {categories.map((cat) => (
        <button
          key={cat.id} // Usar uniqueId como key
          onClick={() => onSelectCategory(cat.id)} // Pasar uniqueId
          className={clsx(
            'px-4 py-2 rounded-full border-2 transition-colors font-medium cursor-pointer',
            selectedCategories.includes(cat.id) // Verificar por uniqueId
              ? 'bg-secondary text-white border-secondary shadow-lg'
              : 'bg-white text-gray-700 border-gray-300 hover:border-red-600 hover:text-red-600'
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};