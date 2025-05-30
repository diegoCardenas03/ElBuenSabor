import { useState } from 'react';
import { Header } from '../components/commons/Header'
import { MisPedidosService } from '../services/MisPedidosService';
import { useAppDispatch } from '../hooks/redux';
import { PedidoResponseDTO } from '../types/Pedido/PedidoResponseDTO';

// export interface PedidoResponseDTO {
//     id?: number;
//     fecha: string;           // LocalDate se convierte a string
//     hora?: string;           // LocalTime se convierte a string
//     codigo: string;
//     estado: Estado;
//     horaEstimadaFin?: string; // LocalTime se convierte a string
//     tipoEnvio: TipoEnvio;
//     totalVenta: number;      // Double se convierte a number
//     totalCosto?: number;      // Double se convierte a number
//     formaPago?: FormaPago;
//     cliente?: ClienteResponseDTO;
//     domicilio?: DomicilioResponseDTO;
//     detallePedido?: DetallePedidoResponseDTO[];
//     factura?: FacturaResponseDTO;
// }

const MisPedidos = () => {
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const misPedidosService = new MisPedidosService(); 
  const dispatch = useAppDispatch();

   const ColumnsTablePedido = [
    {
      label: "Orden",
      key: "codigo",
      // render: (pedido: PedidoResponseDTO) => ,
    },
    {
      label: "Estado",
      key: "estado",
    },
    {
      label: "Envio",
      key: "tipoEnvio",
    },
    {
      label: "Fecha",
      key: "fecha",
    },
    
    {
      label: "Total",
      key: "total",
    },
    {
      label: "Detalles",
      key: "detalles",
      render: (pedido: PedidoResponseDTO) => (
        <button
          className='bg-secondary text-white px-4 py-2 rounded'
          onClick={() => {
            // Aquí puedes abrir un modal o redirigir a una página de detalles
            console.log(`Detalles del pedido ${pedido.codigo}`);
          }}
        >
          Ver Detalles
        </button>
      ),
    },
   ];

  return (
    <div className='w-full h-screen bg-primary'>
        <Header/>
        <h1 className='font-tertiary text-center text-[30px] pt-10'>Mis Pedidos</h1>
    </div>
  )
}

export default MisPedidos