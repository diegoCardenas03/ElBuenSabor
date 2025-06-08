import React, { useEffect, useState } from 'react';
import { MenuLayout } from '../layouts/MenuLayout';
import { Categories } from '../features/products/Categories';
import { ProductCards } from '../features/products/ProductCards';
import { ProductModal } from '../features/products/ProductModal';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchProducts, setSearchTerm, toggleCategory, setFilters } from '../hooks/redux/slices/ProductReducer';
import { fetchRubrosProductos } from '../hooks/redux/slices/RubroReducer';
import { ProductoDTO } from '../types/Producto/ProductoDTO';

export const MenuPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { 
    filteredProducts, 
    loading: productsLoading, 
    error: productsError, 
    selectedCategories,
    searchTerm,
    filters 
  } = useAppSelector((state) => state.products);

  const { 
    rubros, 
    loading: rubrosLoading 
  } = useAppSelector((state) => state.rubros);

  // Estados locales
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductoDTO | null>(null);

  // Cargar datos al montar
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchRubrosProductos());
  }, [dispatch]);

  // Convertir rubros a formato categories
  const categories = rubros.map(rubro => ({
    name: rubro.denominacion
  }));

  // Manejar selección de categoría (usar toggleCategory para selección múltiple)
  const handleSelectCategory = (categoryName: string) => {
    const rubro = rubros.find(r => r.denominacion === categoryName);
    console.log('Rubro encontrado:', rubro); // Debug
    // Cambiar para usar product.rubro.id en lugar de product.rubroId
    console.log('Productos:', filteredProducts.map(p => ({ 
      nombre: p.denominacion, 
      rubroId: p.rubro?.id 
    }))); // Debug
    if (rubro && rubro.id) {
      dispatch(toggleCategory(rubro.id));
    }
  };

  // Función para abrir modal
  const handleCardClick = (product: ProductoDTO) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  // Función para añadir al carrito
  const handleAddToCart = () => {
    setModalOpen(false);
  };

  // Convertir IDs seleccionados a nombres para el componente Categories
  const selectedCategoryNames = selectedCategories.map(id => {
    const rubro = rubros.find(r => r.id === id);
    return rubro ? rubro.denominacion : '';
  }).filter(Boolean);

  const loading = productsLoading || rubrosLoading;

  if (loading) {
    return (
      <MenuLayout onSearch={(term) => dispatch(setSearchTerm(term))} onFiltersChange={(f) => dispatch(setFilters(f))}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", width: "100%", gap: "2vh", height: "50vh" }}>
          <p>Cargando...</p>
        </div>
      </MenuLayout>
    );
  }

  return (
    <MenuLayout
      onSearch={(term) => dispatch(setSearchTerm(term))}
      onFiltersChange={(f) => dispatch(setFilters(f))}
    >
      <div className="flex flex-col items-center">
        {/* Categorías */}
        <h3 className="text-4xl font-tertiary text-[#FF9D3A] text-center mb-4 uppercase">
          Explorar categorías
        </h3>
        <Categories
          categories={categories}
          selectedCategories={selectedCategoryNames}
          onSelectCategory={handleSelectCategory}
        />

        {/* Productos */}
        {selectedCategories.length === 0 && !searchTerm && (
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