import { use, useEffect, useState } from 'react';
import axios from 'axios';
import { DetallePedido } from '../features/products/DetallePedido';
import { useNavigate } from 'react-router-dom';
import { IconMapPin } from '@tabler/icons-react';
import { IconClockHour1 } from '@tabler/icons-react';

const detallePedidos: DetallePedido[] = [
  { id: 1, cantidad: 2, subTotal: 200, pedidoId: 1, productoId: 1, insumoId: 1 },
  { id: 2, cantidad: 3, subTotal: 100, pedidoId: 1, productoId: 3, insumoId: 9 },
];

type Props = {
  onClose: () => void;
};

const CarritoLateral: React.FC<Props> = ({ onClose }) => {
  const [detallePedido, setDetallePedido] = useState<DetallePedido[]>([]);
  const [mostrarDireccion, setMostrarDireccion] = useState(false);
  const navigate = useNavigate();

  /*useEffect(() => {
    const fetchDetallePedido = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/detallepedido');
        setDetallePedido(response.data);
      } catch (error) {
        console.error('Error fetching DetallePedido:', error);
      }
    }
    fetchDetallePedido();
  }
  , []);*/

  const incrementarCantidad = (id: number) => {
    setDetallePedido(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, cantidad: item.cantidad + 1, subTotal: (item.cantidad + 1) * 100 } // suponiendo precio fijo 100
          : item
      )
    );
  };

  const decrementarCantidad = (id: number) => {
    setDetallePedido(prev =>
      prev.map(item =>
        item.id === id && item.cantidad > 1
          ? { ...item, cantidad: item.cantidad - 1, subTotal: (item.cantidad - 1) * 100 }
          : item
      )
    );
  };

  const entregaEnTienda = (enTienda: string, delivery: string) => {
    const enTiendaButton = document.getElementById(enTienda);
    const deliveryButton = document.getElementById(delivery);
    setMostrarDireccion(false);

    if (enTiendaButton && deliveryButton) {
      enTiendaButton.classList.add('bg-secondary', 'text-white');
      deliveryButton.classList.remove('bg-secondary', 'text-white');
    }
  }

  const entregaDelivery = (delivery: string, enTienda: string) => {
    const deliveryButton = document.getElementById(delivery);
    const enTiendaButton = document.getElementById(enTienda);
    setMostrarDireccion(true);

    if (deliveryButton && enTiendaButton) {
      deliveryButton.classList.add('bg-secondary', 'text-white');
      enTiendaButton.classList.remove('bg-secondary', 'text-white');
    }

  }

  const handleRealizarPedido = () => {
    navigate('/DetalleCompra');
    onClose();
  };

  const handleCancelarPedido = () => {
    const confirmacion = window.confirm("¿Deseas cancelar el pedido?");
    if (confirmacion) {
      navigate('/');
      onClose();
    } else {

    }


  }

  return (
    <div className="fixed right-0 top-0 h-screen w-96 bg-primary shadow-lg p-6 rounded-xl z-50 overflow-auto transition-transform duration-300">
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-xl">✕</button>
      <h2 className="text-2xl font-bold text-gray-800 mb-3 pb-2">MI ORDEN</h2>

      <div className="p-2">
        {detallePedidos.map((item: DetallePedido) => (
          <div key={item.id} className="flex justify-between items-center mb-3">
            <img src="" alt="" className="left-20 w-14 h-14 rounded-[15px] ring-1 ring-gray-300" />
            <div className="flex flex-col">
              <p className="font-semibold">{item.productoId}</p>
              <p className="text-sm text-gray-500">Subtotal: ${item.subTotal}</p>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <button onClick={() => decrementarCantidad(item.id)} className="px-2 py-1 rounded-full">–</button>
                <span>{item.cantidad}</span>
                <button onClick={() => incrementarCantidad(item.id)} className="px-2 py-1 rounded-full">+</button>
              </div>
              <button className="bg-secondary text-white px-3 py-1 rounded-full hover:scale-102 transition-transform duration-200">Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mt-3 mb-4 pb-2">ENTREGA</h2>
      <div className='space-y-8'>
        <div className="flex justify-around items-center space-x-5">
          <button onClick={() => entregaEnTienda('enTienda', 'delivery')} id='enTienda' className="border border-gray-300 text-gray-700 px-4 py-1 rounded-full">En tienda</button>
          <button onClick={() => entregaDelivery('delivery', 'enTienda')} id='delivery' className="border border-gray-300 g-secondary text-gray-700 px-4 py-1 rounded-full">Delivery</button>
        </div>

        <div className="flex items-center space-x-4 mb-4">
          <IconClockHour1 stroke={2} width={25} height={25}/>
          <p className="text-gray-700">12:00</p>
        </div>

        {mostrarDireccion && (
          <div className="flex items-center space-x-4 mb-10">
            <IconMapPin stroke={2} width={30} height={30}/>
            <select className="border border-gray-300 rounded-full w-full px-3 py-1 text-gray-700 bg-primary focus:outline-none" defaultValue="Seleccionar dirección">
              <option>Direccion1</option>
              <option>Direccion2</option>
              <option>Direccion3</option>
            </select>
          </div>)}
      </div>

      <div className="space-y-4 border-t pt-4">
        <div className="flex justify-between mb-4">
          <p className="text-gray-700">Subtotal:</p>
          <p className="text-gray-700">${detallePedido.reduce((subtotal, item) => subtotal + item.subTotal, 0)}</p>
        </div>

        {mostrarDireccion && (
          <div className="flex justify-between mb-4">
            <p className="text-gray-700">Delivery:</p>
            <p className="text-gray-700">$0</p>
          </div>)}

        <div className="flex justify-between mb-4">
          <p className="font-bold">Total:</p>
          <p className="font-bold">${detallePedido.reduce((total, item) => total + item.subTotal, 0)}</p>
        </div>
        <button onClick={handleRealizarPedido} className="bg-secondary text-white px-4 py-2 rounded-full w-full hover:scale-102 transition-transform duration-200">Realizar pedido</button>
        <button onClick={handleCancelarPedido} className="bg-tertiary border border-gray-300 px-4 py-2 rounded-full w-full hover:scale-102 transition-transform duration-200">Cancelar pedido</button>
      </div>


    </div >
  );
}

export default CarritoLateral;