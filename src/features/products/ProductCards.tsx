import React from 'react';

// Definimos el tipo de producto
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  isOffer?: boolean;   // Si es oferta
  isNew?: boolean;     // Si es novedad
  oldPrice?: number;   // Precio anterior (si es oferta)
}

interface ProductCardsProps {
  products: Product[];
  onCardClick?: (product: Product) => void;
  showBadges?: boolean; // <--- NUEVO
}

export const ProductCards: React.FC<ProductCardsProps> = ({ products, onCardClick, showBadges }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-10 justify-center">
      {products.map((product) => (
        <div
          key={product.id}
          className="relative bg-white p-4 flex flex-col justify-between items-center shadow hover:shadow-lg transition border-2 border-[#FF9D3A] h-55 w-42 cursor-pointer"
          onClick={() => onCardClick && onCardClick(product)}
        >
          {/* Cintas solo si showBadges */}
          {showBadges && product.isOffer && (
            <div className="absolute top-0 left-0 w-full bg-[#BD1E22] text-white text-center text-[13px] font-tertiary py-[1px]  z-10">
              OFERTA
            </div>
          )}
          {showBadges && product.isNew && !product.isOffer && (
            <div className="absolute top-0 left-0 w-full bg-[#FF9D3A] text-white text-center text-[12px] font-tertiary py-[1px]  z-10">
              NOVEDAD
            </div>
          )}
          {/* Imagen del producto */}
          <img src={product.image} alt={product.name} className="h-20 mb-3 object-contain" />

          {/* Nombre y precio */}
          <h3 className="font-primary text-center font-bold text-sm text-gray-800 line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
          <p className="font-primary text-gray-600 text-sm mb-2">
            {showBadges && product.isOffer && product.oldPrice ? (
              <>
                <span className="line-through text-gray-400 mr-2">${product.oldPrice}</span>
                <span className="text-black font-bold">${product.price}</span>
              </>
            ) : (
              <>${product.price}</>
            )}
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
