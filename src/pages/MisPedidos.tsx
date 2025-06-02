import { useEffect, useState } from 'react';
import { Header } from '../components/commons/Header'
import { MisPedidosService } from '../services/MisPedidosService';
import { useAppDispatch } from '../hooks/redux';
import { PedidoResponseDTO } from '../types/Pedido/PedidoResponseDTO';
import { MdRemoveRedEye, MdOutlineFileDownload } from "react-icons/md";
import { IoFilterSharp } from "react-icons/io5";
import { CircularProgress } from '@mui/material';
import { TableGeneric } from '../components/TableGeneric';
import { setDataTable } from '../hooks/redux/slices/TableReducer';
import { Estado } from '../types/enums/Estado';
import { TipoEnvio } from '../types/enums/TipoEnvio';
import { FormaPago } from '../types/enums/FormaPago';
import { FaSearch } from "react-icons/fa";

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

/*const pedidoEjemplo: PedidoResponseDTO[] = [
  {
    id: 1,
    codigo: "001",
    estado: Estado.EN_PREPARACION,
    tipoEnvio: TipoEnvio.DELIVERY,
    fecha: "2025-05-30",
    totalVenta: 4500.75,
    detallePedido: [{
      id: 1,
      cantidad: 2,
      subTotal: 3000,
      subTotalCosto: 1800,
      producto: {
        id: 101,
        denominacion: "Hamburguesa Doble",
        descripcion: "Doble carne, cheddar, lechuga y tomate",
        tiempoEstimadoPreparacion: 15,
        precioVenta: 1500,
        precioCosto: 900,
        urlImagen: "https://example.com/img/hamburguesa.jpg",
        activo: true,
      },
      insumo: {
        id: 202,
        denominacion: "Cheddar en fetas",
        urlImagen: "https://example.com/img/cheddar.jpg",
        precioCosto: 100,
        precioVenta: 150,
        stockActual: 200,
        stockMinimo: 30,
        esParaElaborar: false,
        activo: true,
        unidadMedida: UnidadMedida.GRAMOS,
      },
    }],

    factura: {
      id: 1,
      fechaFacturacion: "2025-05-30",
      horaFacturacion: "14:30",
      numeroComprobante: 123456,
      formaPago: FormaPago.MERCADO_PAGO,
      totalVenta: "4500.75",
      montoDescuento: 0,
      costoEnvio: 500,
    }
  },
  {
    id: 2,
    codigo: "002",
    estado: Estado.EN_CAMINO,
    tipoEnvio: TipoEnvio.RETIRO_LOCAL,
    fecha: "2025-05-30",
    totalVenta: 4500.75,
    detallePedido: [],
    factura: {
      id: 1,
      fechaFacturacion: "2025-05-30",
      horaFacturacion: "14:30",
      numeroComprobante: 123456,
      formaPago: FormaPago.MERCADO_PAGO,
      totalVenta: "4500.75",
      montoDescuento: 0,
      costoEnvio: 500,
    }
  },
  {
    id: 3,
    codigo: "003",
    estado: Estado.ENTREGADO,
    tipoEnvio: TipoEnvio.DELIVERY,
    fecha: "2025-05-30",
    totalVenta: 4500.75,
    detallePedido: [],
    factura: {
      id: 1,
      fechaFacturacion: "2025-05-30",
      horaFacturacion: "14:30",
      numeroComprobante: 123456,
      formaPago: FormaPago.MERCADO_PAGO,
      totalVenta: "4500.75",
      montoDescuento: 0,
      costoEnvio: 500,
    }
  },
  {
    id: 4,
    codigo: "004",
    estado: Estado.ENTREGADO,
    tipoEnvio: TipoEnvio.DELIVERY,
    fecha: "2025-05-30",
    totalVenta: 4500.75,
    detallePedido: [],
    factura: {
      id: 1,
      fechaFacturacion: "2025-05-30",
      horaFacturacion: "14:30",
      numeroComprobante: 123456,
      formaPago: FormaPago.MERCADO_PAGO,
      totalVenta: "4500.75",
      montoDescuento: 0,
      costoEnvio: 500,
    }
  },
  {
    id: 5,
    codigo: "005",
    estado: Estado.ENTREGADO,
    tipoEnvio: TipoEnvio.RETIRO_LOCAL,
    fecha: "2025-05-30",
    totalVenta: 4500,
    detallePedido: [],
    factura: {
      id: 1,
      fechaFacturacion: "2025-05-30",
      horaFacturacion: "14:30",
      numeroComprobante: 123456,
      formaPago: FormaPago.MERCADO_PAGO,
      totalVenta: "4500.75",
      montoDescuento: 0,
      costoEnvio: 500,
    }
  },
  {
    id: 5,
    codigo: "005",
    estado: Estado.ENTREGADO,
    tipoEnvio: TipoEnvio.DELIVERY,
    fecha: "2025-05-30",
    totalVenta: 4500,
    detallePedido: [],
    factura: {
      id: 1,
      fechaFacturacion: "2025-05-30",
      horaFacturacion: "14:30",
      numeroComprobante: 123456,
      formaPago: FormaPago.MERCADO_PAGO,
      totalVenta: "4500.75",
      montoDescuento: 0,
      costoEnvio: 500,
    }
  },
  {
    id: 6,
    codigo: "006",
    estado: Estado.ENTREGADO,
    tipoEnvio: TipoEnvio.RETIRO_LOCAL,
    fecha: "2025-05-30",
    totalVenta: 4500.75,
    detallePedido: [],
    factura: {
      id: 1,
      fechaFacturacion: "2025-05-30",
      horaFacturacion: "14:30",
      numeroComprobante: 123456,
      formaPago: FormaPago.MERCADO_PAGO,
      totalVenta: "4500.75",
      montoDescuento: 0,
      costoEnvio: 500,
    }
  },
  {
    id: 7,
    codigo: "007",
    estado: Estado.ENTREGADO,
    tipoEnvio: TipoEnvio.DELIVERY,
    fecha: "2025-05-30",
    totalVenta: 4500,
    detallePedido: [],
    factura: {
      id: 1,
      fechaFacturacion: "2025-05-30",
      horaFacturacion: "14:30",
      numeroComprobante: 123456,
      formaPago: FormaPago.MERCADO_PAGO,
      totalVenta: "4500.75",
      montoDescuento: 0,
      costoEnvio: 500,
    }
  }
];*/


const MisPedidos = () => {
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<PedidoResponseDTO | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<{ order: string; bestseller: boolean }>({ order: '', bestseller: false });

  const misPedidosService = new MisPedidosService();
  const dispatch = useAppDispatch();

  const ColumnsTablePedido = [
    {
      label: "Orden",
      key: "codigo",
      className: "",
    },
    {
      label: "Estado",
      key: "estado",
      render: (pedido: PedidoResponseDTO) => getEstadoTexto(pedido.estado), 
      className: "hidden sm:table-cell", 
    },
    {
      label: "Envio",
      key: "tipoEnvio",
      render: (pedido: PedidoResponseDTO) => getTipoEnvioTexto(pedido.tipoEnvio),
      className: "hidden sm:table-cell", 
    },
    {
      label: "Fecha",
      key: "fecha",
      className: "hidden sm:table-cell", 
    },

    {
      label: "Total",
      key: "totalVenta",
      className: "hidden sm:table-cell", 
    },
    {
      label: "Detalles",
      key: "detallePedido",
      render: (pedido: PedidoResponseDTO) => (
        <button
          className='rounded cursor-pointer hover:transform hover:scale-111 transition-all duration-300 ease-in-out'
          onClick={() => {
            setPedidoSeleccionado(pedido);
            setOpenModal(true);
          }}
        >
          <MdRemoveRedEye size={23} />
        </button>
      ),
      className: "",
    },
    {
      label: "Factura",
      key: "factura",
      render: (pedido: PedidoResponseDTO) => (
        <button
          className='rounded cursor-pointer hover:transform hover:scale-111 transition-all duration-300 ease-in-out'
          onClick={() => {
            console.log(`Factura del pedido ${pedido.codigo}`);
          }}
        >
          <MdOutlineFileDownload size={23} />
        </button>
      ),
      className: "",
    },
  ];

  const getEstadoTexto = (estado: Estado) => {
    switch (estado) {
      case Estado.SOLICITADO:
        return "Solicitado";
      case Estado.PENDIENTE:
        return "Pendiente";
      case Estado.EN_PREPARACION:
        return "En preparación";
      case Estado.EN_CAMINO:
        return "En camino";
      case Estado.ENTREGADO:
        return "Entregado";
      default:
        return "Desconocido";
    }
  };

  const getTipoEnvioTexto = (tipoEnvio: TipoEnvio) => {
    switch (tipoEnvio) {
      case TipoEnvio.DELIVERY:
        return "Delivery";
      case TipoEnvio.RETIRO_LOCAL:
        return "Retiro en local";
      default:
        return "Desconocido";
    }
  };

  const getFormaPagoTexto = (formaPago: FormaPago) => {
    switch (formaPago) {
      case FormaPago.MERCADO_PAGO:
        return "Mercado Pago";
      case FormaPago.EFECTIVO:
        return "Efectivo";
      default:
        return "Desconocido";
    }
  };

  const getPedidos = async () => {
    await misPedidosService.getAll().then((pedidoData) => {
      //const pedidosDTO = pedidoEjemplo;
      // Mapeo PedidoResponseDTO a PedidoDTO
      const pedidosDTO = pedidoData.map((p) => ({
        id: p.id,
        fecha: p.fecha,
        hora: p.hora,
        codigo: p.codigo,
        estado: p.estado,
        horaEstimadaFin: p.horaEstimadaFin,
        tipoEnvio: p.tipoEnvio,
        totalVenta: p.totalVenta,
        totalCosto: p.totalCosto,
        formaPago: p.formaPago,
        cliente: p.cliente, 
        domicilio: p.domicilio, 
        detallePedido: p.detallePedido, 
        factura: p.factura, 
      }));
      dispatch(setDataTable(pedidosDTO));
      setLoading(false);
    });
  };

  useEffect(() => {
    setLoading(true);
    getPedidos();
  }, []);

  return (
    <>
      <div className='w-full h-full bg-primary pb-10'>
        <Header />
        <h1 className='font-tertiary text-center text-[30px] pt-10'>Mis Pedidos</h1>
        <div className='flex flex-col md:flex-row justify-center items-center mt-5 mb-5'>
          <div className='flex justify-arround items-center mt-4 mb-2 sm:w-[60%] lg:w-[70%] gap-10'>
            <div className='sm:w-[50%] lg:w-[30%] pr-10px relative'>
              <input
                type="search"
                name="search"
                placeholder="Buscar pedido..."
                className="w-full p-2 border border-gray-500 rounded-full bg-white"
                onChange={(e) => {
                  console.log(`Buscar: ${e.target.value}`);
                }}
              />
              <FaSearch className="absolute right-4 top-1/3 text-gray-600" />
            </div>
            <div className='flex gap-2'>
              <button className='bg-secondary p-1 rounded-full text-white cursor-pointer hover:bg-secondary hover:transform hover:scale-111 transition-all duration-300 ease-in-out'>
                <IoFilterSharp size={25} color='white' />
              </button>
              <button className='hidden md:inline text-secondary hover:underline'>
                Borrar Filtros
              </button>
            </div>
          </div>
          <div className='flex items-center'>
            <span className="inline-block w-4 h-4 bg-green-300/70 rounded mr-2"></span>
            <p>Pedidos en curso</p>
          </div>
        </div>
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              width: "100%",
              gap: "2vh",
              height: "100%",
            }}
          >
            <CircularProgress color="secondary" />
            <h2>Cargando...</h2>
          </div>
        ) : (
          <TableGeneric<PedidoResponseDTO>
            columns={ColumnsTablePedido}
            setOpenModal={setOpenModal}
            handleDelete={()=> {}}
            getRowClassName={(pedido: PedidoResponseDTO) => {
              const estadosEnCurso = [
                Estado.SOLICITADO,
                Estado.PENDIENTE,
                Estado.EN_PREPARACION,
                Estado.EN_CAMINO,
              ];
              return estadosEnCurso.includes(pedido.estado) ? 'bg-green-300/70' : '';
            }}
          />
        )}
      </div>
      {openModal && pedidoSeleccionado && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50'>
          <div className='bg-white p-5 rounded-[20px] shadow-lg w-[90%] sm:w-[65%] lg:w-[40%]'>
            <div className='flex justify-between items-center mb-4 ml-3'>
              <div>
                <h2 className='text-secondary text-xl font-bold'><strong>Orden: #{pedidoSeleccionado.codigo}</strong></h2>
                <p>{pedidoSeleccionado.fecha}</p>
              </div>
              <button
                className="cursor-pointer font-bold text-gray-500 hover:text-gray-800 pb-10 pr-2"
                onClick={() => {
                  setOpenModal(false);
                }}
              >
                ✕
              </button>
            </div>
            <ul className='flex flex-col gap-2 pl-3'>
              <li className=''>
                <p><strong> Estado:</strong> {getEstadoTexto(pedidoSeleccionado.estado)}</p>
                <div className="border-b border-gray-300 mt-2 mb-2"></div>
                <p><strong>Cliente:</strong>{pedidoSeleccionado.cliente?.nombreCompleto}</p> 
                <div className="border-b border-gray-300 mt-2 mb-2"></div>
                <strong>Productos:</strong>
                {pedidoSeleccionado.detallePedido && pedidoSeleccionado.detallePedido.length > 0 && (
                  <ul className='pl-5'>
                    {pedidoSeleccionado.detallePedido.map((detalle, index) => (
                      <li key={index}>
                        <p>{detalle.cantidad}x - {detalle.producto?.denominacion ?? 'N/A'}</p>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="border-b border-gray-300 mt-2 mb-2"></div>
                 <p><strong>Forma de pago:</strong> {getFormaPagoTexto(pedidoSeleccionado.formaPago)}</p> 
                <div className="border-b border-gray-300 mt-2 mb-2"></div>
                <p><strong> Envío:</strong> {getTipoEnvioTexto(pedidoSeleccionado.tipoEnvio)}</p>
                <div className="border-b border-gray-300 mt-2 mb-2"></div>
                <strong className='flex justify-between items-center'>
                  Total <p className='text-secondary pr-3'>${pedidoSeleccionado.totalVenta.toFixed(2)}</p>
                </strong>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  )
}

export default MisPedidos