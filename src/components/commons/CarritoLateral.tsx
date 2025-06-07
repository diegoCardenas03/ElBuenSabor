import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegClock, FaMapMarkerAlt } from "react-icons/fa";
import { ProductoDTO } from '../../types/Producto/ProductoDTO';
import { DetallePedidoDTO } from '../../types/DetallePedido/DetallePedidoDTO';
import { TipoEnvio } from '../../types/enums/TipoEnvio';
import { DomicilioDTO } from '../../types/Domicilio/DomicilioDTO';
import { domicilio } from '../../pages/misDirecciones';

type Props = {
  onClose: () => void;
};

const productos: ProductoDTO[] = [];

// const productos: ProductoDTO[] = [{
//   id: 1, denominacion: "Pizza Muzza", descripcion: "Pizza con muzzarella y salsa", tiempoEstimadoPreparacion: 20, precioVenta: 200, urlImagen: "ruta/a/imagen.jpg", activo: true,
//   rubro: [{ id: 1, denominacion: "queso", activo: true }],
//   detalleProductos: [{
//     id: 1,
//     cantidad: 2,
//     insumoId: 1
// }]
// },
// {
//   id: 2, denominacion: "Pizza 2", descripcion: "Pizza con muzzarella y salsa", tiempoEstimadoPreparacion: 20, precioVenta: 200, urlImagen: "ruta/a/imagen.jpg", activo: true,
//   rubro: [{ id: 1, denominacion: "queso", activo: true }],
//   detalleProductos: [{
//     id: 1,
//     cantidad: 2,
//     insumoId: 2
//   }]
// }];


const CarritoLateral: React.FC<Props> = ({ onClose }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [detallePedido, setDetallePedido] = useState<DetallePedidoDTO[]>([]);
  const [tipoEntrega, setTipoEntrega] = useState<TipoEnvio>();
  const navigate = useNavigate();
  const [direcciones, setDirecciones] = useState<DomicilioDTO[]>([]);
  const [direccionSeleccionada, setDireccionSeleccionada] = useState<string>('');


  useEffect(() => {
    {/* setProducto([
      {
        id: 1, denominacion: "Pizza Muzza", descripcion: "Pizza con muzzarella y salsa", tiempoEstimadoPreparacion: 20, precioVenta: 200, urlImagen: "ruta/a/imagen.jpg", activo: true,
        rubro: [{ id: 1, denominacion: "queso", activo: true }],
        detalleProductos: [{
          id: 1,
          cantidad: 2,
          insumo: [{
            denominacion: "queso", urlImagen: "string", precioCosto: 100, precioVenta: 200, stockActual: 5, stockMinimo: 3, esParaElaborar: true, activo: true, unidadMedida: UnidadMedida.GRAMOS,
            rubro: [{ denominacion: "lacteos", activo: true }]
          }]
        }]
      },
      {
        id: 2, denominacion: "Pizza 2", descripcion: "Pizza con muzzarella y salsa", tiempoEstimadoPreparacion: 20, precioVenta: 200, urlImagen: "ruta/a/imagen.jpg", activo: true,
        rubro: [{ id: 1, denominacion: "queso", activo: true }],
        detalleProductos: [{
          id: 1,
          cantidad: 2,
          insumo: [{
            denominacion: "queso", urlImagen: "string", precioCosto: 100, precioVenta: 200, stockActual: 5, stockMinimo: 3, esParaElaborar: true, activo: true, unidadMedida: UnidadMedida.GRAMOS,
            rubro: [{ denominacion: "lacteos", activo: true }]
          }]
        }]
      }
    ]);*/}

    // setDetallePedido([{ id: 1, productoId: 1, cantidad: 2 },
    // { id: 2, productoId: 2, cantidad: 1 }
    // ]);

    const direcciones = domicilio();
    setDirecciones(direcciones);

    setLoading(false);

  }
    , []);

  const formatearDireccion = (d: DomicilioDTO) => `${d.calle} ${d.numero}, ${d.localidad}, ${d.codigoPostal}`;

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

  const incrementarCantidad = (id: number) => {
    setDetallePedido(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      )
    );
  };

  const decrementarCantidad = (id: number) => {
    setDetallePedido(prev =>
      prev.map(item =>
        item.id === id && item.cantidad > 1
          ? { ...item, cantidad: item.cantidad - 1 }
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

  const subTotal = detallePedido.reduce((acum, item) => {
    const producto = productos.find(p => p.id === item.productoId);
    return acum + (producto ? producto.precioVenta * item.cantidad : 0);
  }, 0);
  const envio = tipoEntrega === TipoEnvio.DELIVERY ? 200 : 0;
  const total = subTotal + envio;

  return (
    <div className="fixed right-0 top-0 h-screen w-96 bg-primary shadow-lg p-6 rounded-xl z-9999 absolute overflow-auto transition-transform duration-300">
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-xl cursor-pointer">✕</button>
      <h2 className="text-2xl font-bold text-gray-800 mb-3 pb-2">MI ORDEN</h2>

      <div className="p-2">
        {loading &&
          <p className="text-gray-600 mb-2">Cargando pedido...</p>
        }
        {error &&
          <p className="text-red-500 mb-2">{error}</p>
        }
        {!loading && detallePedido.map((item) => {
          const producto = productos.find(p => p.id === item.productoId);
          return (
            <div key={item.id} className="flex justify-between items-center mb-3">
              <div className="flex items-center space-x-4">
                <img
                  src={producto?.urlImagen}
                  alt={producto?.denominacion}
                  className="left-20 w-14 h-14 rounded-[15px] ring-1 ring-gray-300"
                />
                <div className="flex flex-col">
                  <p className="font-semibold">{producto?.denominacion}</p>
                  <p className="text-sm text-gray-500">
                    Subtotal: ${(producto ? (producto.precioVenta * item.cantidad) : 0)}
                  </p>
                </div>
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
          );
        })}
      </div>


      <h2 className="text-2xl font-bold text-gray-800 mt-3 mb-4 pb-2">ENTREGA</h2>
      <div className='space-y-8'>
        <div className="flex justify-around items-center space-x-5">
          <button
            onClick={() => setTipoEntrega(TipoEnvio.RETIRO_LOCAL)}
            className={`cursor-pointer border px-4 py-1 rounded-full ${tipoEntrega === TipoEnvio.RETIRO_LOCAL ? 'bg-secondary text-white' : 'text-gray-700 border-gray-300'}`}>
            En tienda
          </button>
          <button
            onClick={() => setTipoEntrega(TipoEnvio.DELIVERY)}
            className={`cursor-pointer border px-4 py-1 rounded-full ${tipoEntrega === TipoEnvio.DELIVERY ? 'bg-secondary text-white' : 'text-gray-700 border-gray-300'}`}>
            Delivery
          </button>
        </div>

        <div className="flex items-center space-x-4 mb-4">
          <FaRegClock stroke='2' className='w-7 h-7' />
          <p className="text-gray-700">12:00</p>
        </div>

        {tipoEntrega === "DELIVERY" && (
          <div className="flex items-center space-x-4 mb-10">
            <FaMapMarkerAlt stroke='2' className='w-7 h-7' />
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