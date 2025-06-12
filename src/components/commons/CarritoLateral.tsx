import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegClock, FaMapMarkerAlt } from "react-icons/fa";
import { TipoEnvio } from '../../types/enums/TipoEnvio';
import { DomicilioDTO } from '../../types/Domicilio/DomicilioDTO';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { agregarProducto, cambiarCantidad, obtenerId, quitarProducto, setDireccion, setTipoEntrega, vaciarCarrito } from '../../hooks/redux/slices/CarritoReducer';
import { fetchDirecciones } from '../../hooks/redux/slices/DomicilioReducer';

type Props = {
  onClose: () => void;
};

const CarritoLateral: React.FC<Props> = ({ onClose }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const carrito = useAppSelector((state) => state.carrito.items);
  const direcciones = useAppSelector((state) => state.domicilio.direcciones);
  const tipoEntrega = useAppSelector((state) => state.carrito.tipoEntrega);
  const direccionSeleccionada = useAppSelector((state) => state.carrito.direccion);

  useEffect(() => {
    dispatch(fetchDirecciones());
    setLoading(false);
  }, [direcciones])

  const formatearDireccion = (d: DomicilioDTO) => `${d.calle} ${d.numero}, ${d.localidad}, ${d.codigoPostal}`;

  const subTotal = carrito.reduce((acum, item) => acum + item.item.precioVenta * item.cantidad, 0);
  const envio = tipoEntrega == TipoEnvio.DELIVERY ? 200 : 0;
  const total = subTotal + envio;

  const handleRealizarPedido = () => {
    if (tipoEntrega === null) {
      alert("Elige donde quieres recibir el pedido")
    } else {
      dispatch(setTipoEntrega(tipoEntrega || null));
      dispatch(setDireccion(direccionSeleccionada || null))
      navigate('/DetalleCompra', {
        state: {
          subTotal,
          envio,
          total,
        }
      });
      onClose();
    }
  };

  const handleCancelarPedido = () => {
    const confirmacion = window.confirm("¿Deseas cancelar el pedido?");
    if (confirmacion) {
      dispatch(vaciarCarrito());
      navigate('/');
      onClose();
    }
  }

  return (
    <div className="fixed right-0 top-0 h-screen w-96 bg-primary shadow-lg p-6 rounded-xl z-9999 absolute flex flex-col transition-transform duration-300">
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-xl cursor-pointer">✕</button>
      <h2 className="text-2xl font-bold text-gray-800 mb-3 pb-2">MI ORDEN</h2>

      <div className="flex-1 overflow-auto p-2">
        {loading &&
          <p className="text-gray-600 mb-2">Cargando pedido...</p>
        }
        {error &&
          <p className="text-red-500 mb-2">{error}</p>
        }
        {!loading && carrito.length === 0 ? (
          <p className="text-gray-600">Tu carrito está vacío</p>
        ) : (carrito.map(({ item, cantidad }) => {
          const id = obtenerId(item);
          return (
            <div key={item.id} className="flex justify-between items-center mb-3">
              <div className="flex items-center space-x-4">
                <img
                  src={item.urlImagen}
                  alt={item.denominacion}
                  className="left-20 w-14 h-14 rounded-[15px] ring-1 ring-gray-300"
                />
                <div className="flex flex-col">
                  <p className="font-semibold">{item.denominacion}</p>
                  <p className="text-sm text-gray-500">
                    Subtotal: ${(item.precioVenta * cantidad).toFixed(2)}
                  </p>
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => dispatch(cambiarCantidad({ id, cantidad: cantidad - 1 }))} className="px-2 py-1 rounded-full cursor-pointer">–</button>
                  <span>{cantidad}</span>
                  <button onClick={() => dispatch(agregarProducto(item))} className="px-2 py-1 rounded-full cursor-pointer">+</button>
                </div>
                <button onClick={() => dispatch(quitarProducto(id))}
                  className="cursor-pointer bg-secondary text-white px-3 py-1 rounded-full hover:scale-102 transition-transform duration-200">
                  Eliminar
                </button>
              </div>
            </div>);
        })
        )}



        <h2 className="text-2xl font-bold text-gray-800 mt-4 mb-4 pb-2">ENTREGA</h2>
        <div className='space-y-8'>
          <div className="flex justify-around items-center space-x-5">
            <button
              onClick={() => dispatch(setTipoEntrega(TipoEnvio.RETIRO_LOCAL))}
              className={`cursor-pointer border px-4 py-1 rounded-full ${tipoEntrega === TipoEnvio.RETIRO_LOCAL ? 'bg-secondary text-white' : 'text-gray-700 border-gray-300'}`}>
              En tienda
            </button>
            <button
              onClick={() => dispatch(setTipoEntrega(TipoEnvio.DELIVERY))}
              className={`cursor-pointer border px-4 py-1 rounded-full ${tipoEntrega === TipoEnvio.DELIVERY ? 'bg-secondary text-white' : 'text-gray-700 border-gray-300'}`}>
              Delivery
            </button>
          </div>

          <div className="flex items-center space-x-4 mb-4">
            <FaRegClock stroke='2' className='w-7 h-7' />
            <p className="text-gray-700">12:00</p>
          </div>

          {tipoEntrega === TipoEnvio.DELIVERY && (
            <div className="flex items-center space-x-4 mb-10">
              <FaMapMarkerAlt stroke='2' className='w-7 h-7' />
              <select
                className="cursor-pointer border border-gray-300 rounded-full w-full px-3 py-1 text-gray-700 bg-primary focus:outline-none"
                value={direccionSeleccionada?.id || ''}
                onChange={(e) => {
                  const dir = direcciones.find(d => d.id === parseInt(e.target.value));
                  dispatch(setDireccion(dir || null));
                }}
              >
                <option value="" disabled>Seleccionar dirección</option>
                {direcciones.map((dir) => (
                  <option key={dir.id} value={dir.id}>
                    {formatearDireccion(dir)}
                  </option>
                ))}
              </select>

            </div>)}
        </div>
      </div>

      <div className="space-y-4 border-t pt-4">
        <div className="flex justify-between mb-4">
          <p className="text-gray-700">Subtotal:</p>
          <p className="text-gray-700">${subTotal}</p>
        </div>

        {tipoEntrega === "DELIVERY" && (
          <div className="flex justify-between mb-4">
            <p className="text-gray-700">Envio:</p>
            <p className="text-gray-700">${envio}</p>
          </div>)}

        <div className="flex justify-between mb-4">
          <p className="font-bold">Total:</p>
          <p className="font-bold">${total}</p>
        </div>
        <button onClick={handleRealizarPedido} className="bg-secondary text-white px-4 py-2 rounded-full w-full hover:scale-102 transition-transform duration-200 cursor-pointer">Realizar pedido</button>
        <button onClick={handleCancelarPedido} className="bg-tertiary border border-gray-300 px-4 py-2 rounded-full w-full hover:scale-102 transition-transform duration-200 cursor-pointer">Cancelar pedido</button>
      </div>

    </div>
  )


}

export default CarritoLateral;