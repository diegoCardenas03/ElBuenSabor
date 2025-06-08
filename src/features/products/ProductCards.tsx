import React from 'react';
import { ProductoDTO } from '../../types/Producto/ProductoDTO';

interface ProductCardsProps {
  products: ProductoDTO[];
  onCardClick?: (product: ProductoDTO) => void;
  showBadges?: boolean;
}

export const ProductCards: React.FC<ProductCardsProps> = ({ products, onCardClick, showBadges }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-10 justify-center">
      {products.map((product) => (
        <div
          key={product.id}
          className="relative bg-white p-4 flex flex-col justify-between items-center shadow hover:shadow-lg transition border-2 border-[#FF9D3A] h-55 w-42 cursor-pointer"
          onClick={() => onCardClick && onCardClick(product)}
        >
          {/* Imagen del producto */}
          <img 
            src={product.urlImagen || 'src\\assets\\bebida.png'} 
            alt={product.denominacion} 
            className="h-20 mb-3 object-contain" 
          />

          {/* Nombre y precio */}
          <h3 className="font-primary text-center font-bold text-sm text-gray-800 line-clamp-2 min-h-[2.5rem]">
            {product.denominacion}
          </h3>
          <p className="font-primary text-gray-600 text-sm mb-2">
            ${product.precioVenta?.toFixed(2) || '0.00'}
          </p>
          {/* Botón para agregar al carrito */}
          <button className="mt-auto bg-orange-400 hover:bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold cursor-pointer">
            Añadir
          </button>
        </div>
      ))}
    </div>
  );
};