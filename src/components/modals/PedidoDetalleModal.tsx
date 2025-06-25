import { useAppDispatch } from '../../hooks/redux';
import { updateEstadoPedidoThunk } from '../../hooks/redux/slices/PedidoReducer';
import { Estado } from '../../types/enums/Estado';
import { PedidoResponseDTO } from '../../types/Pedido/PedidoResponseDTO';
import { getEstadoTexto, getTipoEnvioTexto, getFormaPagoTexto, mostrarSoloNumero } from '../../utils/PedidoUtils';

interface PedidoDetalleModalProps {
  pedido: PedidoResponseDTO | null;
  open: boolean;
  onClose: () => void;
}

const PedidoDetalleModal = ({ pedido, open, onClose }: PedidoDetalleModalProps) => {
  if (!open || !pedido) return null;
  const dispatch = useAppDispatch();

  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50'>
      <div className='relative bg-white p-5 rounded-[20px] shadow-lg w-[90%] sm:w-[65%] lg:w-[40%]'>
        <button
          className="absolute top-3 right-4 cursor-pointer font-bold text-gray-500 hover:text-gray-800 text-2xl"
          onClick={onClose}
        >
          ✕
        </button>

        <div className='pl-3 pb-3'>
          <h2 className='text-secondary text-xl font-bold'><strong>Orden: #{mostrarSoloNumero(pedido.codigo)}</strong></h2>
          <p>{pedido.fecha}</p>
        </div>

        <ul className='flex flex-col gap-2 pl-3'>
          <li>
            <p><strong> Estado:</strong> {getEstadoTexto(pedido.estado)}</p>
            <div className="border-b border-gray-300 mt-2 mb-2"></div>
            <p><strong>Cliente:</strong> {pedido.cliente?.nombreCompleto}</p>
            <div className="border-b border-gray-300 mt-2 mb-2"></div>
            <strong>Productos:</strong>
            {pedido.detallePedidos && pedido.detallePedidos.length > 0 && (
              <ul className='pl-10'>
                {pedido.detallePedidos.map((detalle, index) => (
                  <li key={index}>
                    <p>{detalle.cantidad}x - {detalle.producto?.denominacion || detalle.insumo?.denominacion}</p>
                  </li>
                ))}
              </ul>
            )}
            <div className="border-b border-gray-300 mt-2 mb-2"></div>
            <p><strong>Forma de pago:</strong> {getFormaPagoTexto(pedido.formaPago)}</p>
            <div className="border-b border-gray-300 mt-2 mb-2"></div>
            <p><strong> Envío:</strong> {getTipoEnvioTexto(pedido.tipoEnvio)}</p>
            <div className="border-b border-gray-300 mt-2 mb-2"></div>
            <strong className='flex justify-between items-center'>
              Total <p className='text-secondary pr-3'>${pedido.totalVenta.toFixed(2)}</p>
            </strong>
          </li>
        </ul>
        <div className='flex justify-end items-center'>
          <button
            className={`${pedido.estado == Estado.SOLICITADO ? "bg-secondary text-white rounded-full px-1 py-1 w-[30%] mt-3 mr-3 cursor-pointer hover:scale-105 transition-transform" : "hidden"}`}
            onClick={async () => {
              await dispatch(updateEstadoPedidoThunk({ pedidoId: pedido.id, nuevoEstado: Estado.CANCELADO }));
              await localStorage.removeItem("pedidoEnCurso");
              onClose();
            }}
          >
            Cancelar pedido
          </button>
        </div>
      </div>
    </div>
  );
};

export default PedidoDetalleModal;