import React, { useState } from 'react';
import { MenuLayout } from '../layouts/MenuLayout';
import { Categories } from '../features/products/Categories';
import { ProductCards } from '../features/products/ProductCards';
import { ProductModal } from '../features/products/ProductModal';

export const MenuPage: React.FC = () => {
  // Lista de categorías (nombre + imagen)
  const categories = [
    { name: 'Bebidas', image: 'src\\assets\\bebida.png' },
    { name: 'Hamburguesas', image: 'src\\assets\\hamburguesa.png' },
    { name: 'Papas', image: 'src\\assets\\papas-fritas.png' },
    { name: 'Pizzas', image: 'src\\assets\\pizza.png' },
    { name: 'Panchos', image: 'src\\assets\\pancho.png' },
    { name: 'Bebidas Alcoholicas', image: 'src\\assets\\fernet.png' }
  ];

  // Estado de categoría seleccionada
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(''); // Estado para el término de búsqueda
  // Estado para el modal y producto seleccionado
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  

  // Lista de productos de ejemplo con categoría asociada
  const products = [
    {
      id: 1,
      name: 'Mega Crunch Bite',
      price: 1200,
      category: 'Hamburguesas',
      image: 'src\\assets\\hamburguesa.png',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce aliquam massa id sodales venenatis. Phasellus tellus ipsum, maximus aclacus nec, fringilla dignissim ligula. In congue nibh et lectus rhoncus, at posuere massa gravida. Aliquam sagittis, augue at aliquet malesuada.'
    },
    {
      id: 2,
      name: 'Mega Crunch Bite',
      price: 1200,
      category: 'Hamburguesas',
      image: 'src\\assets\\hamburguesa.png',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce aliquam massa id sodales venenatis. Phasellus tellus ipsum, maximus aclacus nec, fringilla dignissim ligula. In congue nibh et lectus rhoncus, at posuere massa gravida. Aliquam sagittis, augue at aliquet malesuada.'
    },
    {
      id: 3,
      name: 'Mega Crunch Bite',
      price: 1200,
      category: 'Hamburguesas',
      image: 'src\\assets\\hamburguesa.png',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce aliquam massa id sodales venenatis. Phasellus tellus ipsum, maximus aclacus nec, fringilla dignissim ligula. In congue nibh et lectus rhoncus, at posuere massa gravida. Aliquam sagittis, augue at aliquet malesuada.'
    },
    {
      id: 4,
      name: 'Mega Crunch Bite',
      price: 1200,
      category: 'Hamburguesas',
      image: 'src\\assets\\hamburguesa.png',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce aliquam massa id sodales venenatis. Phasellus tellus ipsum, maximus aclacus nec, fringilla dignissim ligula. In congue nibh et lectus rhoncus, at posuere massa gravida. Aliquam sagittis, augue at aliquet malesuada.'
    },
    {
      id: 5,
      name: 'Mega Crunch Bite',
      price: 1200,
      category: 'Hamburguesas',
      image: 'src\\assets\\hamburguesa.png',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce aliquam massa id sodales venenatis. Phasellus tellus ipsum, maximus aclacus nec, fringilla dignissim ligula. In congue nibh et lectus rhoncus, at posuere massa gravida. Aliquam sagittis, augue at aliquet malesuada.'
    },
    {
      id: 6,
      name: 'Mega Crunch Bite',
      price: 1200,
      category: 'Hamburguesas',
      image: 'src\\assets\\hamburguesa.png',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce aliquam massa id sodales venenatis. Phasellus tellus ipsum, maximus aclacus nec, fringilla dignissim ligula. In congue nibh et lectus rhoncus, at posuere massa gravida. Aliquam sagittis, augue at aliquet malesuada.'
    },
    {
      id: 7,
      name: 'Mega Crunch Bite',
      price: 1200,
      category: 'Hamburguesas',
      image: 'src\\assets\\hamburguesa.png',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce aliquam massa id sodales venenatis. Phasellus tellus ipsum, maximus aclacus nec, fringilla dignissim ligula. In congue nibh et lectus rhoncus, at posuere massa gravida. Aliquam sagittis, augue at aliquet malesuada.'
    },
    {
      id: 8,
      name: 'Mega Crunch Bite',
      price: 1200,
      category: 'Hamburguesas',
      image: 'src\\assets\\hamburguesa.png',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce aliquam massa id sodales venenatis. Phasellus tellus ipsum, maximus aclacus nec, fringilla dignissim ligula. In congue nibh et lectus rhoncus, at posuere massa gravida. Aliquam sagittis, augue at aliquet malesuada.'
    },
    {
      id: 9,
      name: 'Bebida Generica',
      price: 1200,
      category: 'Bebidas',
      image: 'src\\assets\\bebida.png',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce aliquam massa id sodales venenatis. Phasellus tellus ipsum, maximus aclacus nec, fringilla dignissim ligula. In congue nibh et lectus rhoncus, at posuere massa gravida. Aliquam sagittis, augue at aliquet malesuada.'
    },
    {
      id: 10,
      name: 'Bebida Generica',
      price: 1200,
      category: 'Bebidas',
      image: 'src\\assets\\bebida.png',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce aliquam massa id sodales venenatis. Phasellus tellus ipsum, maximus aclacus nec, fringilla dignissim ligula. In congue nibh et lectus rhoncus, at posuere massa gravida. Aliquam sagittis, augue at aliquet malesuada.'
    },
    {
      id: 11,
      name: 'Bebida Generica',
      price: 1200,
      category: 'Bebidas',
      image: 'src\\assets\\bebida.png',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce aliquam massa id sodales venenatis. Phasellus tellus ipsum, maximus aclacus nec, fringilla dignissim ligula. In congue nibh et lectus rhoncus, at posuere massa gravida. Aliquam sagittis, augue at aliquet malesuada.'
    },
    {
      id: 12,
      name: 'Bebida Generica',
      price: 1200,
      category: 'Bebidas',
      image: 'src\\assets\\bebida.png',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce aliquam massa id sodales venenatis. Phasellus tellus ipsum, maximus aclacus nec, fringilla dignissim ligula. In congue nibh et lectus rhoncus, at posuere massa gravida. Aliquam sagittis, augue at aliquet malesuada.'
    },
    {
      id: 13,
      name: 'Papas genericas',
      price: 1200,
      category: 'Papas',
      image: 'src\\assets\\papas-fritas.png',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce aliquam massa id sodales venenatis. Phasellus tellus ipsum, maximus aclacus nec, fringilla dignissim ligula. In congue nibh et lectus rhoncus, at posuere massa gravida. Aliquam sagittis, augue at aliquet malesuada.'
    },
    {
      id: 14,
      name: 'Papas genericas',
      price: 1200,
      category: 'Papas',
      image: 'src\\assets\\papas-fritas.png',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce aliquam massa id sodales venenatis. Phasellus tellus ipsum, maximus aclacus nec, fringilla dignissim ligula. In congue nibh et lectus rhoncus, at posuere massa gravida. Aliquam sagittis, augue at aliquet malesuada.'
    },
    {
      id: 15,
      name: 'Papas genericas',
      price: 1200,
      category: 'Papas',
      image: 'src\\assets\\papas-fritas.png',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce aliquam massa id sodales venenatis. Phasellus tellus ipsum, maximus aclacus nec, fringilla dignissim ligula. In congue nibh et lectus rhoncus, at posuere massa gravida. Aliquam sagittis, augue at aliquet malesuada.'
    },
    {
      id: 16,
      name: 'Papas genericas',
      price: 1200,
      category: 'Papas',
      image: 'src\\assets\\papas-fritas.png',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce aliquam massa id sodales venenatis. Phasellus tellus ipsum, maximus aclacus nec, fringilla dignissim ligula. In congue nibh et lectus rhoncus, at posuere massa gravida. Aliquam sagittis, augue at aliquet malesuada.'
    },
    {
      id: 17,
      name: 'Pizza generica',
      price: 1200,
      category: 'Pizzas',
      image: 'src\\assets\\pizza.png',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce aliquam massa id sodales venenatis. Phasellus tellus ipsum, maximus aclacus nec, fringilla dignissim ligula. In congue nibh et lectus rhoncus, at posuere massa gravida. Aliquam sagittis, augue at aliquet malesuada.'
    },
    {
      id: 18,
      name: 'Pizza generica',
      price: 1200,
      category: 'Pizzas',
      image: 'src\\assets\\pizza.png',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce aliquam massa id sodales venenatis. Phasellus tellus ipsum, maximus aclacus nec, fringilla dignissim ligula. In congue nibh et lectus rhoncus, at posuere massa gravida. Aliquam sagittis, augue at aliquet malesuada.'
    },
    {
      id: 19,
      name: 'Pizza generica',
      price: 1200,
      category: 'Pizzas',
      image: 'src\\assets\\pizza.png',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce aliquam massa id sodales venenatis. Phasellus tellus ipsum, maximus aclacus nec, fringilla dignissim ligula. In congue nibh et lectus rhoncus, at posuere massa gravida. Aliquam sagittis, augue at aliquet malesuada.'
    },
    {
      id: 20,
      name: 'Pizza generica',
      price: 1200,
      category: 'Pizzas',
      image: 'src\\assets\\pizza.png',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce aliquam massa id sodales venenatis. Phasellus tellus ipsum, maximus aclacus nec, fringilla dignissim ligula. In congue nibh et lectus rhoncus, at posuere massa gravida. Aliquam sagittis, augue at aliquet malesuada.'
    },
    {
      id: 21,
      name: 'Pancho generico',
      price: 1200,
      category: 'Panchos',
      image: 'src\\assets\\pancho.png',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce aliquam massa id sodales venenatis. Phasellus tellus ipsum, maximus aclacus nec, fringilla dignissim ligula. In congue nibh et lectus rhoncus, at posuere massa gravida. Aliquam sagittis, augue at aliquet malesuada.'
    },
    {
      id: 22,
      name: 'Pancho generico',
      price: 1200,
      category: 'Panchos',
      image: 'src\\assets\\pancho.png',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce aliquam massa id sodales venenatis. Phasellus tellus ipsum, maximus aclacus nec, fringilla dignissim ligula. In congue nibh et lectus rhoncus, at posuere massa gravida. Aliquam sagittis, augue at aliquet malesuada.'
    },
    {
      id: 23,
      name: 'Pancho generico',
      price: 1200,
      category: 'Panchos',
      image: 'src\\assets\\pancho.png',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce aliquam massa id sodales venenatis. Phasellus tellus ipsum, maximus aclacus nec, fringilla dignissim ligula. In congue nibh et lectus rhoncus, at posuere massa gravida. Aliquam sagittis, augue at aliquet malesuada.'
    },
    {
      id: 24,
      name: 'Pancho generico',
      price: 1200,
      category: 'Panchos',
      image: 'src\\assets\\pancho.png',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce aliquam massa id sodales venenatis. Phasellus tellus ipsum, maximus aclacus nec, fringilla dignissim ligula. In congue nibh et lectus rhoncus, at posuere massa gravida. Aliquam sagittis, augue at aliquet malesuada.'
    },
    {
      id: 25,
      name: 'Bebida Alcoholica',
      price: 1200,
      category: 'Bebidas Alcoholicas',
      image: 'src\\assets\\fernet.png',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce aliquam massa id sodales venenatis. Phasellus tellus ipsum, maximus aclacus nec, fringilla dignissim ligula. In congue nibh et lectus rhoncus, at posuere massa gravida. Aliquam sagittis, augue at aliquet malesuada.'
    },
    {
      id: 26,
      name: 'Bebida Alcoholica',
      price: 1200,
      category: 'Bebidas Alcoholicas',
      image: 'src\\assets\\fernet.png',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce aliquam massa id sodales venenatis. Phasellus tellus ipsum, maximus aclacus nec, fringilla dignissim ligula. In congue nibh et lectus rhoncus, at posuere massa gravida. Aliquam sagittis, augue at aliquet malesuada.'
    },
    {
      id: 27,
      name: 'Bebida Alcoholica',
      price: 1200,
      category: 'Bebidas Alcoholicas',
      image: 'src\\assets\\fernet.png',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce aliquam massa id sodales venenatis. Phasellus tellus ipsum, maximus aclacus nec, fringilla dignissim ligula. In congue nibh et lectus rhoncus, at posuere massa gravida. Aliquam sagittis, augue at aliquet malesuada.'
    },
    {
      id: 28,
      name: 'Bebida Alcoholica',
      price: 1200,
      category: 'Bebidas Alcoholicas',
      image: 'src\\assets\\fernet.png',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce aliquam massa id sodales venenatis. Phasellus tellus ipsum, maximus aclacus nec, fringilla dignissim ligula. In congue nibh et lectus rhoncus, at posuere massa gravida. Aliquam sagittis, augue at aliquet malesuada.'
    },

  ];

  // Filtramos los productos según la categoría seleccionada
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Manejar la selección de categorías
  const handleSelectCategory = (category: string) => {
    setSelectedCategory((prevCategory) => (prevCategory === category ? null : category));
  };

   // Función para abrir el modal con el producto seleccionado
   const handleCardClick = (product: any) => {
    setSelectedProduct({
      ...product
    });
    setModalOpen(true);
  };

  // Función para añadir al carrito (puedes personalizarla)
  const handleAddToCart = () => {
    // Lógica para añadir al carrito
    setModalOpen(false);
  };

  return (
    <MenuLayout onSearch={setSearchTerm}>

      <div className="flex flex-col items-center">
        {/* Categorías */}
        <h3 className="text-4xl font-tertiary text-[#FF9D3A] text-center mb-4 uppercase">
          Explorar categorías
        </h3>
        <Categories
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />

        {/* Productos */}
        {/* Mostrar título solo si no hay categoría seleccionada */}
        {!selectedCategory && !searchTerm && (
          <h2 className="text-4xl font-tertiary text-[#9e1c1c] mb-4">
            Novedades Populares
          </h2>
        )}
        {filteredProducts.length === 0 ? (
          <p className="font-bowlby-one-sc text-center text-red-500 text-lg mt-4">
            No se encontraron productos que coincidan con la búsqueda.
          </p>
        ) : (
          <ProductCards products={filteredProducts} onCardClick={handleCardClick} />
        )}
         {/* Modal de producto */}
         {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onAddToCart={handleAddToCart}
          />
        )}
      </div>
    </MenuLayout>
  );
};
