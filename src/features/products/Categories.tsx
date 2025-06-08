import React from 'react';
import clsx from 'clsx';

interface CategoriesProps {
  categories: { name: string }[];
  selectedCategories: string[]; // Cambiar a array para múltiples selecciones
  onSelectCategory: (category: string) => void;
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
          key={cat.name}
          onClick={() => onSelectCategory(cat.name)}
          className={clsx(
            'px-4 py-2 rounded-full border-2 transition-colors font-medium cursor-pointer',
            selectedCategories.includes(cat.name)
              ? 'bg-red-600 text-white border-red-600 shadow-lg'
              : 'bg-white text-gray-700 border-gray-300 hover:border-red-600 hover:text-red-600'
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};