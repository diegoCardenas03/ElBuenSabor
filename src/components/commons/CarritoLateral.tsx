import {useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Direccion, direccion } from '../../pages/misDirecciones';
import { FaRegClock, FaMapMarkerAlt  } from "react-icons/fa";

interface DetallePedido {
  id: number;
  cantidad: number;
  subTotal: number;
  pedidoId: number;
  productoId: number;
  insumoId: number;
}

type Props = {
  onClose: () => void;
};

const CarritoLateral: React.FC<Props> = ({ onClose }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [detallePedido, setDetallePedido] = useState<DetallePedido[]>([]);
  const [mostrarDireccion, setMostrarDireccion] = useState<boolean>(false);
  const [tipoEntrega, setTipoEntrega] = useState<'enTienda' | 'delivery' >('enTienda');
  const navigate = useNavigate();
  const [direcciones, setDirecciones] = useState<Direccion[]>([]);
  const [direccionSeleccionada, setDireccionSeleccionada] = useState<string>('');


  useEffect(() => {
    const detallePedido: DetallePedido[] = [
      { id: 1, cantidad: 1, subTotal: 200, pedidoId: 1, productoId: 1, insumoId: 1 },
      { id: 2, cantidad: 1, subTotal: 100, pedidoId: 1, productoId: 3, insumoId: 9 },
    ];
    setDetallePedido(detallePedido);
    setLoading(false);

    const direcciones = direccion();
    setDirecciones(direcciones);
  }
    , []);

  const formatearDireccion = (d: Direccion) => `${d.calle} ${d.numero}, ${d.localidad}, ${d.codigoPostal}`;

  /*useEffect(() => {
    const fetchDetallePedido = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/detallepedido');
        setDetallePedido(response.data);
      } catch (error) {
        setError('Error al cargar los detalles del pedido');
      } finally {
        setLoading(false);
      }
    }
    fetchDetallePedido();
  }
  , []);*/

  const precioUnitario = 100; // suponiendo precio fijo 100
  const incrementarCantidad = (id: number) => {
    setDetallePedido(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, cantidad: item.cantidad + 1, subTotal: (item.cantidad + 1) * precioUnitario }
          : item
      )
    );
  };

  const decrementarCantidad = (id: number) => {
    setDetallePedido(prev =>
      prev.map(item =>
        item.id === id && item.cantidad > 1
          ? { ...item, cantidad: item.cantidad - 1, subTotal: (item.cantidad - 1) * precioUnitario }
          : item
      )
    );
  };

  const eliminarItem = (id: number) => {
    setDetallePedido(prev => prev.filter(item => item.id !== id));
  };

  const handleRealizarPedido = () => {
    const direccionActual = direcciones.find(d => d.id === direccionSeleccionada);
    navigate('/DetalleCompra', {
      state: {
        direccion: direccionActual,
        tipoEntrega: tipoEntrega,
        subTotal: subTotal,
        envio: envio,
        total: total,
      }
    });
    onClose();
  };

  const handleCancelarPedido = () => {
    const confirmacion = window.confirm("¿Deseas cancelar el pedido?");
    if (confirmacion) {
      navigate('/');
      onClose();
    }
  }

  const subTotal = detallePedido.reduce((subtotal, item) => subtotal + item.subTotal, 0);
  const envio = mostrarDireccion ? 200 : 0;
  const total = subTotal + envio;

  return (
    <div className="fixed right-0 top-0 h-screen w-96 bg-primary shadow-lg p-6 rounded-xl z-50 overflow-auto transition-transform duration-300">
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-xl cursor-pointer">✕</button>
      <h2 className="text-2xl font-bold text-gray-800 mb-3 pb-2">MI ORDEN</h2>

      <div className="p-2">
        {loading &&
          <p className="text-gray-600 mb-2">Cargando pedido...</p>
        }
        {error &&
          <p className="text-red-500 mb-2">{error}</p>
        }
        {!loading && detallePedido.map((item: DetallePedido) => (
          <div key={item.id} className="flex justify-between items-center mb-3">
            <img src="" alt="" className="left-20 w-14 h-14 rounded-[15px] ring-1 ring-gray-300" />
            <div className="flex flex-col">
              <p className="font-semibold">{item.productoId}</p>
              <p className="text-sm text-gray-500">Subtotal: ${item.subTotal}</p>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <button onClick={() => decrementarCantidad(item.id)} className="px-2 py-1 rounded-full cursor-pointer">–</button>
                <span>{item.cantidad}</span>
                <button onClick={() => incrementarCantidad(item.id)} className="px-2 py-1 rounded-full cursor-pointer">+</button>
              </div>
              <button onClick={() => eliminarItem(item.id)}
                className="cursor-pointer bg-secondary text-white px-3 py-1 rounded-full hover:scale-102 transition-transform duration-200">
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mt-3 mb-4 pb-2">ENTREGA</h2>
      <div className='space-y-8'>
        <div className="flex justify-around items-center space-x-5">
          <button
            onClick={() => { setTipoEntrega("enTienda"); setMostrarDireccion(false); }}
            className={`cursor-pointer border px-4 py-1 rounded-full ${tipoEntrega === 'enTienda' ? 'bg-secondary text-white' : 'text-gray-700 border-gray-300'}`}>
            En tienda
          </button>
          <button
            onClick={() => { setTipoEntrega("delivery"); setMostrarDireccion(true); }}
            className={`cursor-pointer border px-4 py-1 rounded-full ${tipoEntrega === 'delivery' ? 'bg-secondary text-white' : 'text-gray-700 border-gray-300'}`}>
            Delivery
          </button>
        </div>

        <div className="flex items-center space-x-4 mb-4">
          <FaRegClock stroke='2'className='w-7 h-7'/>
          <p className="text-gray-700">12:00</p>
        </div>

        {mostrarDireccion && (
          <div className="flex items-center space-x-4 mb-10">
            <FaMapMarkerAlt  stroke='2' className='w-7 h-7'/>
            <select
              className="cursor-pointer border border-gray-300 rounded-full w-full px-3 py-1 text-gray-700 bg-primary focus:outline-none"
              value={direccionSeleccionada}
              onChange={(e) => setDireccionSeleccionada(e.target.value)}
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

      <div className="space-y-4 border-t pt-4">
        <div className="flex justify-between mb-4">
          <p className="text-gray-700">Subtotal:</p>
          <p className="text-gray-700">${subTotal}</p>
        </div>

        {mostrarDireccion && (
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


    </div >
  );
}

export default CarritoLateral;