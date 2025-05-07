import React, { useState } from 'react';
import { MenuLayout } from '../layouts/MenuLayout';
import { Categories } from '../features/products/Categories';
import { ProductCards } from '../features/products/ProductCards';
import { ProductModal } from '../features/products/ProductModal';
import { products } from '../utils/products/productsData';

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
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filters, setFilters] = useState<{ order: string; bestseller: boolean }>({ order: '', bestseller: false });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);


  // Filtrado de productos
  let filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBestseller = filters.bestseller ? product.isTopSeller : true;
    return matchesCategory && matchesSearch && matchesBestseller;
  });

  // Ordenar productos
  if (filters.order === 'asc') {
    filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
  } else if (filters.order === 'desc') {
    filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
  }

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
    <MenuLayout
      onSearch={setSearchTerm}
      onFiltersChange={setFilters}
    >
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
        {!selectedCategory && !searchTerm && (
          <h2 className="text-4xl font-tertiary text-center text-[#9e1c1c] mb-4">
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

export default MenuPage;