import React from 'react';
import { ProductoUnificado, isInsumo } from '../../types/ProductoUnificado/ProductoUnificado';
import { useAppDispatch } from '../../hooks/redux';
import { agregarProducto } from '../../hooks/redux/slices/CarritoReducer';
import { abrirCarrito } from '../../hooks/redux/slices/AbrirCarritoReducer';

interface ProductCardsProps {
  products: ProductoUnificado[];
  onCardClick?: (product: ProductoUnificado) => void;
  showBadges?: boolean;
}

export const ProductCards: React.FC<ProductCardsProps> = ({ products, onCardClick, showBadges }) => {
  const dispatch = useAppDispatch();
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-10 justify-center">
      {products.map((product) => {
        const price = isInsumo(product) ? product.precioVenta : (product.precioVenta || 0);
        const imageUrl = product.urlImagen || 'src\\assets\\bebida.png';
        
        // Crear una key única combinando tipo e ID
        const uniqueKey = isInsumo(product) ? `insumo-${product.id}` : `producto-${product.id}`;
        
        return (
          <div
            key={uniqueKey}
            className="relative bg-white p-4 flex flex-col justify-between items-center shadow hover:shadow-lg transition border-2 border-[#FF9D3A] h-55 w-42 cursor-pointer"
            onClick={() => onCardClick && onCardClick(product)}
          >
            {/* Imagen del producto */}
            <img 
              src={imageUrl} 
              alt={product.denominacion} 
              className="h-20 mb-3 object-contain" 
            />

            {/* Nombre y precio */}
            <h3 className="font-primary text-center font-bold text-sm text-gray-800 line-clamp-2 min-h-[2.5rem]">
              {product.denominacion}
            </h3>
            <p className="font-primary text-gray-600 text-sm mb-2">
              ${price.toFixed(2)}
            </p>
            {/* Botón para agregar al carrito */}
            <button 
              className="mt-auto bg-orange-400 hover:bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold cursor-pointer"
              onClick={() => {dispatch(agregarProducto(product)); dispatch(abrirCarrito());}}>
              Añadir
            </button>
          </div>
        );
      })}
    </div>
  );
};