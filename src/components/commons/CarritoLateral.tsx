import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt } from "react-icons/fa";
import { TipoEnvio } from '../../types/enums/TipoEnvio';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { agregarProducto, cambiarCantidad, obtenerId, quitarProducto, setDireccion, setTipoEntrega, vaciarCarrito } from '../../hooks/redux/slices/CarritoReducer';
import { fetchDirecciones } from '../../hooks/redux/slices/DomicilioReducer';
import Swal from 'sweetalert2';
import { formatearDireccion, truncar } from '../../utils/Utils';

type Props = {
  onClose: () => void;
};

const CarritoLateral: React.FC<Props> = ({ onClose }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const error = null;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const carrito = useAppSelector((state) => state.carrito.items);
  const direcciones = useAppSelector((state) => state.domicilio.direcciones);
  const tipoEntrega = useAppSelector((state) => state.carrito.tipoEntrega);
  const direccionSeleccionada = useAppSelector((state) => state.carrito.direccion);
  const pedidoEnCurso = useAppSelector(state => state.pedido.pedidoEnCurso);

  useEffect(() => {
    dispatch(fetchDirecciones());
    setLoading(false);
  }, [dispatch]);

  const subTotal = carrito.reduce((acum, item) => acum + item.item.precioVenta * item.cant, 0);
  const envio = tipoEntrega == TipoEnvio.DELIVERY ? 1500 : 0;
  const total = subTotal + envio;

  const handleRealizarPedido = async () => {
    // Validar horario local del usuario para cualquier tipo de compra
    // const hora = new Date().getHours();
    // if (hora < 10 || hora >= 23) {
    //   Swal.fire({
    //     position: "center",
    //     icon: "warning",
    //     text: "El local está cerrado. Solo puedes pedir entre las 10:00 y las 23:00.",
    //     showConfirmButton: false,
    //     timer: 2000,
    //     width: "22em"
    //   });
    //   return;
    // }

    if (pedidoEnCurso) {
      Swal.fire({
        position: "center",
        icon: "error",
        text: "Ya hay un pedido en curso",
        showConfirmButton: false,
        timer: 1500,
        width: "20em"
      });
      return;
    }

    if (tipoEntrega === null) {
      Swal.fire({
        position: "center",
        icon: "error",
        text: "Elige donde quieres recibir el pedido",
        showConfirmButton: false,
        timer: 1500,
        width: "20em"
      });
      return;
    }

    if (tipoEntrega === TipoEnvio.DELIVERY && direcciones.length === 0) {
      Swal.fire({
        position: "center",
        icon: "error",
        text: "No tienes direcciones guardadas, por favor agrega una dirección antes de realizar el pedido.",
        showConfirmButton: true,
        confirmButtonColor: "#FF9D3A",
        width: "30em"
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/MisDirecciones');
          onClose();
        }
      });
      return;
    } else if (tipoEntrega === TipoEnvio.DELIVERY && !direccionSeleccionada) {
      Swal.fire({
        position: "center",
        icon: "error",
        text: "Selecciona una dirección",
        showConfirmButton: false,
        timer: 1500,
        width: "20em"
      });
      return;
    }

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

  const handleCancelarPedido = () => {
    Swal.fire({
      title: "¿Deseas cancelar el pedido?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FF9D3A",
      cancelButtonColor: "#BD1E22",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(vaciarCarrito());
        navigate('/');
        onClose();
      }
    });
  }

  return (
    <div className="fixed right-0 top-0 h-screen w-96 bg-primary shadow-lg p-6 rounded-xl z-9999 absolute flex flex-col transition-transform duration-300">
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-xl cursor-pointer">✕</button>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">MI ORDEN</h2>

      <div className="flex-1 overflow-auto p-2">
        {loading &&
          <p className="text-gray-600 mb-2">Cargando pedido...</p>
        }
        {error &&
          <p className="text-red-500 mb-2">{error}</p>
        }
        {!loading && carrito.length === 0 ? (
          <p className="text-gray-600">Tu carrito está vacío</p>
        ) : (carrito.map(({ item, cant }) => {
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
                    Subtotal: ${(item.precioVenta * cant).toFixed(2)}
                  </p>
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => dispatch(cambiarCantidad({ id, cantidad: cant - 1 }))} className="px-2 py-1 rounded-full cursor-pointer">–</button>
                  <span>{cant}</span>
                  <button onClick={() => dispatch(agregarProducto(item))} className="px-2 py-1 rounded-full cursor-pointer">+</button>
                </div>
                <button onClick={() => {
                  dispatch(quitarProducto(id));
                  Swal.fire({
                    position: "center",
                    icon: "success",
                    text: "Producto eliminado correctamente",
                    showConfirmButton: false,
                    timer: 1500,
                    width: "20em"
                  });
                }}
                  className="cursor-pointer bg-secondary text-white px-3 py-1 rounded-full hover:scale-102 transition-transform duration-200">
                  Eliminar
                </button>
              </div>
            </div>);
        })
        )}



        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-3">ENTREGA</h2>
        <div className=''>
          <div className="flex justify-around items-center space-x-5 mb-5">
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

          {tipoEntrega === TipoEnvio.DELIVERY && (
            <div className="flex items-center space-x-4 mb-5">
              <FaMapMarkerAlt stroke='2' className='w-7 h-7' />
              <select
                className="cursor-pointer border border-gray-300 rounded-full w-full px-3 py-1 text-gray-700 bg-primary focus:outline-none"
                value={direccionSeleccionada ? direccionSeleccionada.id : ""}
                onChange={(e) => {
                  const dir = direcciones.find(d => d.id === parseInt(e.target.value));
                  dispatch(setDireccion(dir || null));
                }}
              >
                <option value='' disabled>Seleccionar dirección</option>
                {direcciones.map((dir) => (
                  <option key={dir.id} value={dir.id}>
                    {truncar(formatearDireccion(dir))}
                  </option>
                ))}
              </select>

            </div>)}
        </div>
      </div>

      <div className="space-y-4 border-t pt-4">
        <div className="flex justify-between mb-2">
          <p className="text-gray-700">Subtotal:</p>
          <p className="text-gray-700">${subTotal.toFixed(2)}</p>
        </div>

        {tipoEntrega === "DELIVERY" && (
          <div className="flex justify-between mb-2">
            <p className="text-gray-700">Envio:</p>
            <p className="text-gray-700">${envio}</p>
          </div>)}

        <div className="flex justify-between mb-2">
          <p className="font-bold">Total:</p>
          <p className="font-bold">${total.toFixed(2)}</p>
        </div>
        <div className='flex flex-col gap-2'>
          <button onClick={handleRealizarPedido} className="bg-secondary text-white px-3 py-[5px] rounded-full w-full hover:scale-102 transition-transform duration-200 cursor-pointer">Realizar pedido</button>
          <button onClick={handleCancelarPedido} className="bg-tertiary border border-gray-300 px-3 py-[5px] rounded-full w-full hover:scale-102 transition-transform duration-200 cursor-pointer">Cancelar pedido</button>
        </div>
      </div>

    </div>
  )
}

export default CarritoLateral;