import { useEffect, useState } from 'react';
import { MenuLayout } from '../layouts/MenuLayout';
import { Categories } from '../features/products/Categories';
import { ProductCards } from '../features/products/ProductCards';
import { ProductModal } from '../features/products/ProductModal';
import { Loader } from '../components/commons/Loader';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { useCategories } from '../hooks/useCategories';
import { fetchProducts, fetchInsumosVendibles, setSearchTerm, setFilters } from '../hooks/redux/slices/ProductReducer';
import { fetchRubrosProductos, fetchRubrosInsumos } from '../hooks/redux/slices/RubroReducer';
import { ProductoUnificado } from '../types/ProductoUnificado/ProductoUnificado';
import CarritoLateral from '../components/commons/CarritoLateral';
import { cerrarCarrito } from '../hooks/redux/slices/AbrirCarritoReducer';
import { agregarProducto } from '../hooks/redux/slices/CarritoReducer';
import Swal from 'sweetalert2';
import { PromocionResponseDTO } from '../types/Promocion/PromocionResponseDTO';
import {PromocionService} from '../services/PromocionService';

export const MenuPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    filteredProducts,
    loading: productsLoading,
    searchTerm,
    selectedCategories: rawSelectedCategories
  } = useAppSelector((state) => state.products);

  const { loading: rubrosLoading } = useAppSelector((state) => state.rubros);
  const carritoAbierto = useAppSelector((state) => state.carritoUI.abierto);

  // Usar el hook personalizado para categorías
  const {
    categories,
    selectedCategories,
    handleSelectCategory,
  } = useCategories();

  // Estados locales
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductoUnificado | null>(null);
  const [promociones, setPromociones] = useState<PromocionResponseDTO[]>([]);

  // Cargar datos al montar
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchInsumosVendibles());
    dispatch(fetchRubrosProductos());
    dispatch(fetchRubrosInsumos());

    // Cargar promociones
    const promocionService = new PromocionService();
    promocionService.getAll().then((data) => {
      console.log("Promociones recibidas:", data);
      setPromociones(data);
    });
  }, [dispatch]);

  // Función para abrir modal
  const handleCardClick = (product: ProductoUnificado) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  // Función para añadir al carrito
  const handleAddToCart = (product: ProductoUnificado) => {
    setModalOpen(false);
    if (dispatch(agregarProducto(product))) {
      Swal.fire({
        position: "bottom-end",
        icon: "success",
        title: "Producto agregado correctamente",
        showConfirmButton: false,
        timer: 1000,
        width: "20em"
      });
    } else {
      Swal.fire({
        position: "bottom-end",
        icon: "error",
        title: "El producto no se pudo agregar al carrito",
        showConfirmButton: false,
        timer: 1000,
        width: "20em"
      });
    }
  };

  const loading = productsLoading || rubrosLoading;

  if (loading) {
    return (
      <MenuLayout onSearch={(term) => dispatch(setSearchTerm(term))} onFiltersChange={(f) => dispatch(setFilters(f))}>
        <Loader message="Cargando productos..." />
      </MenuLayout>
    );
  }

  return (
    <>
      {carritoAbierto && (
        <CarritoLateral onClose={() => dispatch(cerrarCarrito())} />
      )}
      <MenuLayout
        onSearch={(term) => dispatch(setSearchTerm(term))}
        onFiltersChange={(f) => dispatch(setFilters(f))}
      >
        <div className="flex flex-col items-center">
          <h3 className='text-4xl font-tertiary text-[#FF9D3A] text-center mb-4 uppercase'>Promociones Vigentes</h3>
          <ProductCards
            products={promociones}
            onCardClick={handleCardClick}
            showBadges={true}
          />
        </div>
        <div className="flex flex-col items-center mt-8">
          {/* Categorías */}
          <h3 className="text-4xl font-tertiary text-[#FF9D3A] text-center mb-4 uppercase">
            Explorar categorías
          </h3>
          <Categories
            categories={categories}
            selectedCategories={selectedCategories}
            onSelectCategory={handleSelectCategory}
          />

          {/* Productos */}
          {rawSelectedCategories.length === 0 && !searchTerm && (
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
              onAddToCart={() => handleAddToCart(selectedProduct)}
            />
          )}
        </div>
      </MenuLayout>
    </>
  );
};

export default MenuPage; 