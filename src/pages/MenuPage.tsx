import React, { useState } from 'react';
import { MenuLayout } from '../layouts/MenuLayout';
import { Categories } from '../features/products/Categories';
import { ProductCards } from '../features/products/ProductCards';

export const MenuPage: React.FC = () => {
  // Lista de categorías (nombre + imagen)
  const categories = [
    { name: 'Bebidas', image: 'src\\assets\\bebida.png' },
    { name: 'Hamburguesas', image: 'src\\assets\\hamburguesa.png' },
    { name: 'Papas Fritas', image: 'src\\assets\\papas-fritas.png' },
    { name: 'Pizzas', image: 'src\\assets\\pizza.png' },
    { name: 'Panchos', image: 'src\\assets\\pancho.png' },
    { name: 'Bebidas Alcoholicas', image: 'src\\assets\\fernet.png' }
  ];

  // Estado de categoría seleccionada (empieza en la primera)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Lista de productos de ejemplo con categoría asociada
  const products = [
    {
      id: 1,
      name: 'Mega Crunch Bite',
      price: 1200,
      category: 'Hamburguesas',
      image: 'src\\assets\\hamburguesa.png',
    },
    {
      id: 2,
      name: 'Mega Crunch Bite',
      price: 1200,
      category: 'Hamburguesas',
      image: 'src\\assets\\hamburguesa.png',
    },
    {
      id: 3,
      name: 'Mega Crunch Bite',
      price: 1200,
      category: 'Hamburguesas',
      image: 'src\\assets\\hamburguesa.png',
    },
    {
      id: 4,
      name: 'Mega Crunch Bite',
      price: 1200,
      category: 'Hamburguesas',
      image: 'src\\assets\\hamburguesa.png',
    },
    {
      id: 5,
      name: 'Mega Crunch Bite',
      price: 1200,
      category: 'Hamburguesas',
      image: 'src\\assets\\hamburguesa.png',
    },
    {
      id: 6,
      name: 'Mega Crunch Bite',
      price: 1200,
      category: 'Hamburguesas',
      image: 'src\\assets\\hamburguesa.png',
    },
    {
      id: 7,
      name: 'Mega Crunch Bite',
      price: 1200,
      category: 'Hamburguesas',
      image: 'src\\assets\\hamburguesa.png',
    },
    {
      id: 8,
      name: 'Mega Crunch Bite',
      price: 1200,
      category: 'Hamburguesas',
      image: 'src\\assets\\hamburguesa.png',
    },
  ];

  // Filtramos los productos según la categoría seleccionada
  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products; // Si no hay categoría seleccionada, muestra todos los productos

  return (
    <MenuLayout>

      <div className="flex flex-col items-center">
        {/* Categorías */}
        <h3 className="text-4xl font-bowlby-one-sc text-[#FF9D3A] text-center mb-4 uppercase">
          Explorar categorías
        </h3>
        <Categories
          categories={categories}
          onSelectCategory={setSelectedCategory}
        />

        {/* Productos */}
        {/* Mostrar título solo si no hay categoría seleccionada */}
        {!selectedCategory && (
          <h2 className="text-4xl font-bowlby-one-sc text-[#9e1c1c] mb-4">
            Novedades Populares
          </h2>
        )}
        <ProductCards products={filteredProducts} />
      </div >
    </MenuLayout>
  );
};
