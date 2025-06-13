import { useEffect, useState } from 'react';
import { Header } from '../components/commons/Header'
import { PedidosService } from '../services/PedidosService';
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

type FiltroState = {
  tipoEnvio: "" | "TODOS" | "LOCAL" | "DELIVERY" | "FECHA";
  fechaDesde: string;
  fechaHasta: string;
  searchTerm: string;
};


const MisPedidos = () => {
  const [loading, setLoading] = useState<Boolean>(false);
  const [openModal, setOpenModal] = useState<Boolean>(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<PedidoResponseDTO | null>(null);
  const [modalFilters, setModalFilters] = useState<Boolean>(false);
  const [filtros, setFiltros] = useState<FiltroState>({ tipoEnvio: "", fechaDesde: "", fechaHasta: "", searchTerm: "", });
  const [filtroSeleccionado, setFiltroSeleccionado] = useState<FiltroState>({ tipoEnvio: "", fechaDesde: "", fechaHasta: "", searchTerm: "", });
  const resetFiltros = () => { setFiltros({ tipoEnvio: "", fechaDesde: "", fechaHasta: "", searchTerm: "" }); setFiltroSeleccionado({ tipoEnvio: "", fechaDesde: "", fechaHasta: "", searchTerm: "" }); };
  const misPedidosService = new PedidosService();
  const dispatch = useAppDispatch();

  const ColumnsTablePedido = [
    {
      label: "Orden",
      key: "codigo",
      render: (pedido: PedidoResponseDTO) => mostrarSoloNumero(pedido.codigo),
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

  const mostrarSoloNumero = (codigo: string) => {
    const partes = codigo.split("-");
    return partes[partes.length - 1];
  };

  const getEstadoTexto = (estado: Estado) => {
    switch (estado) {
      case Estado.SOLICITADO:
        return "Solicitado";
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

  const filtrarPedidos = (pedidos: PedidoResponseDTO[]): PedidoResponseDTO[] => {
    let pedidosFiltrados = pedidos;

    if (filtros.tipoEnvio === "LOCAL") {
      pedidosFiltrados = pedidosFiltrados.filter(p => p.tipoEnvio === TipoEnvio.RETIRO_LOCAL);
    } else if (filtros.tipoEnvio === "DELIVERY") {
      pedidosFiltrados = pedidosFiltrados.filter(p => p.tipoEnvio === TipoEnvio.DELIVERY);
    }

    if (filtros.fechaDesde && filtros.fechaHasta) {
      pedidosFiltrados = pedidosFiltrados.filter(p =>
        p.fecha >= filtros.fechaDesde && p.fecha <= filtros.fechaHasta
      );
    }

    if (filtros.searchTerm.trim() !== "") {
      pedidosFiltrados = pedidosFiltrados.filter(p =>
        mostrarSoloNumero(p.codigo).toLowerCase().includes(filtros.searchTerm.trim().toLowerCase())
      );
    }

    return pedidosFiltrados;
  };

  const getPedidos = async () => {
    try {
      const pedidoData = await misPedidosService.getAll();
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
        detallePedidos: p.detallePedidos,
        factura: p.factura,
      }));
      const pedidosFiltrados = filtrarPedidos(pedidosDTO);
      dispatch(setDataTable(pedidosFiltrados));
    } catch (error) {
      console.error("Error al obtener pedidos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    getPedidos();
  }, [filtros]);

  return (
    <>
      <Header />
      <div className='w-full h-full bg-primary pb-10 pt-20'>
        <h1 className='font-tertiary text-center text-[30px] pt-10'>Mis Pedidos</h1>
        <div className='flex flex-col md:flex-row justify-center items-center mt-5 mb-5'>
          <div className='flex items-center mt-4 mb-2 lg:pl-5 sm:w-[60%] lg:w-[70%] gap-10'>
            <div className='sm:w-[50%] lg:w-[30%] pr-10px relative'>
              <input
                type="search"
                name="search"
                placeholder="Buscar pedido..."
                className="w-full p-2 border border-gray-500 rounded-full bg-white"
                value={filtros.searchTerm}
                onChange={(e) => setFiltros(prev => ({ ...prev, searchTerm: e.target.value }))}
              />
              <FaSearch className="absolute right-4 top-1/3 text-gray-600" />
            </div>
            <div className='flex gap-2'>
              <button
                className='bg-secondary p-1 rounded-full text-white cursor-pointer hover:bg-secondary hover:transform hover:scale-111 transition-all duration-300 ease-in-out'
                onClick={() => {
                  setModalFilters(true)
                }}>
                <IoFilterSharp size={23} color='white' />
              </button>
              <button
                className='hidden md:inline text-secondary hover:underline cursor-pointer '
                onClick={() => {
                  resetFiltros();
                  setModalFilters(false);
                }}>
                Borrar Filtros
              </button>
            </div>
          </div>
          <div className='flex justify-left items-left md:justify-center w-[60%] md:w-[20%] mt-3'>
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
            handleDelete={() => { }}
            getRowClassName={(pedido: PedidoResponseDTO) => {
              const estadosEnCurso = [
                Estado.SOLICITADO,
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
          <div className='relative bg-white p-5 rounded-[20px] shadow-lg w-[90%] sm:w-[65%] lg:w-[40%]'>
            <button
              className="absolute top-3 right-4 cursor-pointer font-bold text-gray-500 hover:text-gray-800 text-2xl"
              onClick={() => {
                setOpenModal(false);
              }}
            >
              ✕
            </button>

            <div className='pl-3 pb-3'>
              <h2 className='text-secondary text-xl font-bold'><strong>Orden: #{mostrarSoloNumero(pedidoSeleccionado.codigo)}</strong></h2>
              <p>{pedidoSeleccionado.fecha}</p>
            </div>

            <ul className='flex flex-col gap-2 pl-3'>
              <li className=''>
                <p><strong> Estado:</strong> {getEstadoTexto(pedidoSeleccionado.estado)}</p>
                <div className="border-b border-gray-300 mt-2 mb-2"></div>
                <p><strong>Cliente:</strong> {pedidoSeleccionado.cliente?.nombreCompleto}</p>
                <div className="border-b border-gray-300 mt-2 mb-2"></div>
                <strong>Productos:</strong>
                {pedidoSeleccionado.detallePedidos && pedidoSeleccionado.detallePedidos.length > 0 && (
                  <ul className='pl-10'>
                    {pedidoSeleccionado.detallePedidos.map((detalle, index) => (
                      <li key={index}>
                        <p>{detalle.cantidad}x - {detalle.producto?.denominacion || detalle.insumo?.denominacion}</p>
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

      {modalFilters && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50'>
          <div className='relative bg-white p-5 rounded-[20px] shadow-lg w-[90%] sm:w-[65%] lg:w-[30%] flex flex-col'>
            <button
              className="absolute top-2 right-3 cursor-pointer font-bold text-gray-500 hover:text-gray-800"
              onClick={() => {
                resetFiltros()
                setModalFilters(false);
              }}
            >
              ✕
            </button>


            <h2 className='text-secondary text-base font-bold text-center mb-1'>Filtros</h2>
            <button
              onClick={() => setFiltroSeleccionado(prev => ({ ...prev, tipoEnvio: "TODOS" }))}
              className={`px-4 py-1 rounded-full transition-all duration-200 w-[50%] mx-auto
              ${filtroSeleccionado.tipoEnvio === "TODOS" ? "bg-secondary text-white" : ""}`}
            >
              Todos los pedidos
            </button>


            <div className="border-b border-gray-300 mt-2 mb-2"></div>

            <h2 className='text-secondary text-base font-bold text-center mb-1'>Envío</h2>
            <div className='flex justify-around gap-2 mb-2'>
              <button
                onClick={() => setFiltroSeleccionado(prev => ({ ...prev, tipoEnvio: "LOCAL" }))}
                className={`px-4 py-1 rounded-full transition-all duration-200 w-[30%] mx-auto
                ${filtroSeleccionado.tipoEnvio === "LOCAL" ? "bg-secondary text-white" : ""}`}
              >
                Local
              </button>
              <button
                onClick={() => setFiltroSeleccionado(prev => ({ ...prev, tipoEnvio: "DELIVERY" }))}
                className={`px-4 py-1 rounded-full transition-all duration-200 w-[30%] mx-auto
                ${filtroSeleccionado.tipoEnvio === "DELIVERY" ? "bg-secondary text-white" : ""}`}
              >
                Delivery
              </button>
            </div>

            <div className="border-b border-gray-300 mt-2 mb-2"></div>

            <h2 className='text-secondary text-base font-bold text-center mb-1'>Fecha</h2>
            <div className='flex gap-2 mb-2' onClick={() => setFiltroSeleccionado(prev => ({ ...prev, tipoEnvio: "FECHA" }))}>
              <input
                type="date"
                value={filtroSeleccionado.fechaDesde}
                onChange={e => setFiltroSeleccionado(prev => ({ ...prev, fechaDesde: e.target.value }))}
                className="border border-gray-300 rounded-full px-2 py-1 w-[50%]"
              />
              <input
                type="date"
                value={filtroSeleccionado.fechaHasta}
                onChange={e => setFiltroSeleccionado(prev => ({ ...prev, fechaHasta: e.target.value }))}
                className="border border-gray-300 rounded-full px-2 py-1 w-[50%]"
              />

            </div>

            <div className="border-b border-gray-300 mt-2 mb-2"></div>
            <button
              className='bg-tertiary text-white mt-2 px-2 py-1 rounded-full w-[30%] mx-auto hover:bg-tertiary/80 transition-all duration-300 ease-in-out'
              onClick={() => {
                setFiltros(filtroSeleccionado);
                setModalFilters(false);
              }}
            >
              Aplicar
            </button>

            <button
              className='inline text-secondary mt-2 px-2 py-1 rounded-full w-[30%] mx-auto cursor-pointer hover:underline transition-all duration-300 ease-in-out'
              onClick={() => resetFiltros()}
            >
              Borrar filtros
            </button>

          </div>
        </div>
      )}
    </>
  )
}

export default MisPedidos