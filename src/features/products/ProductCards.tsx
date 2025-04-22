import React from 'react';

// Definimos el tipo de producto
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface ProductCardsProps {
  products: Product[]; // Recibe lista de productos a mostrar
  onCardClick?: (product: Product) => void;
}

export const ProductCards: React.FC<ProductCardsProps> = ({ products, onCardClick }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-10 justify-center">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-lg p-4 flex flex-col justify-between items-center shadow hover:shadow-lg transition border-2 border-[#FF9D3A] h-55 w-42 cursor-pointer" // altura fija
          onClick={() => onCardClick && onCardClick(product)}
        >
          {/* Imagen del producto */}
          <img src={product.image} alt={product.name} className="h-20 mb-3 object-contain" />

          {/* Nombre y precio */}
          <h3 className="font-primary text-center font-bold text-sm text-gray-800 line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
          <p className="font-primary text-gray-600 text-sm mb-2">${product.price}</p>

          {/* Botón para agregar al carrito */}
          <button className="mt-auto bg-orange-400 hover:bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold cursor-pointer">
            Añadir
          </button>
        </div>
      ))}
    </div>
  );
};
