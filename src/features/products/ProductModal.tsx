import { ProductoUnificado, isInsumo } from '../../types/ProductoUnificado/ProductoUnificado';

interface ProductModalProps {
  product: ProductoUnificado;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: ProductoUnificado) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose, onAddToCart }) => {
  if (!isOpen) return null;

  const price = isInsumo(product) ? product.precioVenta : (product.precioVenta || 0);
  const description = isInsumo(product) ? `${product.denominacion} - Insumo vendible` : product.descripcion;
  const imageUrl = product.urlImagen || 'src\\assets\\bebida.png';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-sm relative flex flex-col items-center">
        <button className="absolute top-2 right-2 text-gray-500 cursor-pointer"  onClick={onClose}>✕</button>
        <h2 className="text-2xl font-bold mb-2 text-center">{product.denominacion}</h2>
        <p className="text-lg text-orange-500 mb-2">${price.toFixed(2)}</p>
        <img 
          src={imageUrl} 
          alt={product.denominacion} 
          className="h-32 w-32 object-contain mb-3" 
        />
        <p className="text-gray-700 mb-4 text-center">{description}</p>
        <button
          className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-full font-semibold cursor-pointer"
          onClick={() => onAddToCart(product)}
        >
          Añadir al carrito
        </button>
      </div>
    </div>
  );
};