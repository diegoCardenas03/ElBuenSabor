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

// Componente para mostrar productos en tarjetas cuadradas
export const ProductCards: React.FC<ProductCardsProps> = ({ products, onCardClick }) => {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 gap-10 justify-center cursor-pointer">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white border border-gray-300 rounded-lg p-4 flex flex-col items-center shadow hover:shadow-lg transition w-40 h-50"
          onClick={() => onCardClick && onCardClick(product)}
        >
          {/* Imagen del producto */}
          <img src={product.image} alt={product.name} className="h-20 mb-3 object-contain" />
          
          {/* Nombre y precio */}
          <h3 className="text-center font-bold text-sm text-gray-800">{product.name}</h3>
          <p className="text-gray-600 text-sm">${product.price}</p>
          
          {/* Botón para agregar al carrito (a futuro se puede conectar con el contexto) */}
          <button className="mt-2 bg-orange-400 hover:bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold cursor-pointer">
            Añadir
          </button>
        </div>
      ))}
    </div>
  );
};
