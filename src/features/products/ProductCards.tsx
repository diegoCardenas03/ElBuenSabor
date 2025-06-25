import { ProductoUnificado, isInsumo } from '../../types/ProductoUnificado/ProductoUnificado';
import { useDispatch } from "react-redux";
import { agregarProducto } from "../../hooks/redux/slices/CarritoReducer";
import { PromocionResponseDTO } from '../../types/Promocion/PromocionResponseDTO';
import Swal from 'sweetalert2';

 
interface ProductCardsProps {
  products: ProductoUnificado[];
  onCardClick?: (product: ProductoUnificado) => void;
  showBadges?: boolean;
}

export const ProductCards: React.FC<ProductCardsProps> = ({ products, onCardClick}) => {
  const dispatch = useDispatch();

 const handleAgregar = (product: ProductoUnificado) => {
  const result = dispatch(agregarProducto(product)); 

  const isPromo = 'fechaDesde' in product && 'fechaHasta' in product;

  if (result && isPromo) {
    Swal.fire({
      icon: "success",
      title: "Promoción agregada al carrito",
      text: product.denominacion,
      timer: 1000,
      showConfirmButton: false,
      width: "20em"
    });
    return;
  }

  if (result) {
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


  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-10 justify-center">
      {products.map((product) => {
        // Detectar si es promoción
        const isPromo = 'fechaDesde' in product && 'fechaHasta' in product;
        const price = isPromo
          ? (product as PromocionResponseDTO).precioVenta
          : isInsumo(product)
            ? product.precioVenta
            : (product.precioVenta || 0);
        const imageUrl = product.urlImagen || 'src\\assets\\bebida.png';
        const uniqueKey = isPromo
          ? `promo-${product.id}`
          : isInsumo(product)
            ? `insumo-${product.id}`
            : `producto-${product.id}`;

        return (
          <div
            key={uniqueKey}
            className="relative bg-white p-4 flex flex-col justify-between items-center shadow hover:shadow-lg transition border-2 border-[#FF9D3A] h-57 w-42 cursor-pointer"
          >
            {isPromo && (
              <span className="absolute mt-1 top-0 bg-[#BD1E22] text-white px-2 py-1 rounded-full text-xs font-bold z-10">
                ¡Promoción!
              </span>
            )}

            <div className='mt-4 flex flex-col items-center w-full' onClick={() => onCardClick && onCardClick(product)}>
              <div className="relative w-full flex justify-center items-center mb-3">
                <img
                  src={imageUrl}
                  alt={product.denominacion}
                  className="h-20 object-contain"
                />
              </div>
              <h3 className="font-primary text-center font-bold text-sm text-gray-800 line-clamp-2 min-h-[2.5rem]">
                {product.denominacion}
              </h3>
              <p className="font-primary text-gray-600 text-sm mb-2">
                ${price.toFixed(2)}
              </p>
            </div>
            <button
              className="mt-auto bg-orange-400 hover:bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold cursor-pointer"
              onClick={() => handleAgregar(product)}
            >
              Añadir
            </button>
          </div>
        );
      })}
    </div>
  );
};