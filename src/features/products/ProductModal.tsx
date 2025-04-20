import React from 'react';

interface ProductModalProps {
  product: {
    name: string;
    price: number;
    image: string;
    description: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose, onAddToCart }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm  flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-sm relative flex flex-col items-center">
        <button className="absolute top-2 right-2 text-gray-500 cursor-pointer"  onClick={onClose}>✕</button>
        <h2 className="text-2xl font-bold mb-2 text-center">{product.name}</h2>
        <p className="text-lg text-orange-500 mb-2">${product.price}</p>
        <img src={product.image} alt={product.name} className="h-32 w-32 object-contain mb-3" />
        <p className="text-gray-700 mb-4 text-center">{product.description}</p>
        <button
          className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-full font-semibold cursor-pointer"
          onClick={onAddToCart}
        >
          Añadir al carrito
        </button>
      </div>
    </div>
  );
};