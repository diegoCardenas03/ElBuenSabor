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
import { FaSearch } from "react-icons/fa";
import { getEstadoTexto, getTipoEnvioTexto, mostrarSoloNumero } from '../utils/PedidoUtils';
import PedidoDetalleModal from '../components/modals/PedidoDetalleModal';
import Swal from 'sweetalert2';
import { jsPDF } from "jspdf";
import { FormaPago } from '../types/enums/FormaPago';
type FiltroState = {
  tipoEnvio: "TODOS" | "LOCAL" | "DELIVERY" | "FECHA";
  fechaDesde: string;
  fechaHasta: string;
  searchTerm: string;

};

const generarNotaCreditoPDF = (pedido) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Nota de Crédito", 20, 20);

  doc.setFontSize(12);
  doc.text(`Código de pedido: ${pedido.codigo}`, 20, 40);
  doc.text(`Cliente: ${pedido.cliente?.nombreCompleto ?? "Sin nombre"}`, 20, 50);
  doc.text(`Total devuelto: $${pedido.totalVenta?.toFixed(2) ?? 0}`, 20, 60);
  doc.text(`Fecha de cancelación: ${new Date().toLocaleDateString()}`, 20, 70);
  doc.text(`Motivo: Cancelación de pedido pagado por Mercado Pago`, 20, 80);

  doc.save(`nota-credito-${pedido.codigo}.pdf`);
};

const MisPedidos = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<PedidoResponseDTO | null>(null);
  const [modalFilters, setModalFilters] = useState<boolean>(false);
  const [filtros, setFiltros] = useState<FiltroState>({ tipoEnvio: "TODOS", fechaDesde: "", fechaHasta: "", searchTerm: "", });
  const [filtroSeleccionado, setFiltroSeleccionado] = useState<FiltroState>({ tipoEnvio: "TODOS", fechaDesde: "", fechaHasta: "", searchTerm: "", });
  const resetFiltros = () => { setFiltros({ tipoEnvio: "TODOS", fechaDesde: "", fechaHasta: "", searchTerm: "" }); setFiltroSeleccionado({ tipoEnvio: "TODOS", fechaDesde: "", fechaHasta: "", searchTerm: "" }); };
  const misPedidosService = new PedidosService();
  const dispatch = useAppDispatch();

  const ColumnsTablePedido = [
    {
      label: "Orden",
      key: "codigo",
      render: (pedido: PedidoResponseDTO) => mostrarSoloNumero(pedido.codigo),
    },
    {
      label: "Estado",
      key: "estado",
      render: (pedido: PedidoResponseDTO) => pedido.estado === Estado.CANCELADO ? <p className='text-red-500'>{getEstadoTexto(pedido.estado)}</p> : <p>{getEstadoTexto(pedido.estado)}</p>,
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
      render: (pedido: PedidoResponseDTO) => (<p>${pedido.totalVenta.toFixed(2)}</p>),
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
    },
    {
      label: "Factura",
      key: "factura",
      render: (pedido: PedidoResponseDTO) => (
        <button
          className='rounded cursor-pointer hover:transform hover:scale-111 transition-all duration-300 ease-in-out'
          onClick={() => {
            if (pedido.estado === Estado.TERMINADO || pedido.estado === Estado.ENTREGADO) {
              window.open(`http://localhost:8080/api/facturas/pdf/${pedido.id}`, '_blank');
            } else {
              Swal.fire({
                icon: 'info',
                title: 'Factura no disponible',
                text: 'La factura estará disponible cuando el pedido esté TERMINADO.',
                confirmButtonColor: '#FF9D3A'
              });
            }
          }}
        >
          <MdOutlineFileDownload size={23} />
        </button>
      ),
    },
    {
      label: "Nota de Crédito",
      key: "notaCredito",
      render: (pedido: PedidoResponseDTO) => (
        pedido.estado === Estado.CANCELADO && pedido.formaPago === FormaPago.MERCADO_PAGO ? (
          <button
            className='rounded cursor-pointer hover:transform hover:scale-111 transition-all duration-300 ease-in-out'
            onClick={() => generarNotaCreditoPDF(pedido)}
            title="Descargar Nota de Crédito"
            style={{ marginLeft: 10, backgroundColor: '#f44336', color: 'white', padding: '5px 12px', border: 'none', borderRadius: '6px' }}
          >
            <MdOutlineFileDownload size={23} />
          </button>
        ) : null
      ),
    }
  ];

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
      const pedidoData = await misPedidosService.getPedidosByUsuario(Number(sessionStorage.getItem("user_id_db") || 0));
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
      pedidosDTO.sort((a, b) => b.codigo.localeCompare(a.codigo));
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
      <div className='w-full h-screen bg-primary pb-10 pt-20'>
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
            <span className="inline-block w-4 h-4 bg-[#49D56E]/30 rounded mr-2"></span>
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
              return estadosEnCurso.includes(pedido.estado) ? 'bg-[#49D56E]/30' : '';
            }}
          />
        )}
      </div>

      {openModal && pedidoSeleccionado &&
        <PedidoDetalleModal
          pedido={pedidoSeleccionado}
          open={openModal}
          onClose={() => { setOpenModal(false); getPedidos(); }}
        />
      }

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