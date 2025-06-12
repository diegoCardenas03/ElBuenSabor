import { useEffect, useState } from "react";
import { AdminHeader } from "../../components/admin/AdminHeader";
import { TableGeneric } from "../../components/TableGeneric";
import { CircularProgress } from "@mui/material";
import { PedidoResponseDTO } from "../../types/Pedido/PedidoResponseDTO";
import { useAppDispatch } from "../../hooks/redux";
import { setDataTable } from "../../hooks/redux/slices/TableReducer";
import Swal from "sweetalert2";
import { PedidoService } from "../../services/PedidoService";
import { TabsPedidos } from "../../components/TabsPedidos"; 
import { AiOutlinePlus, AiOutlineEye } from "react-icons/ai";
import { Estado } from "../../types/enums/Estado";
import  PedidoDetalleModal  from "../../components/modals/PedidoDetalleModal"

const estadosTabs = [
  { label: "Solicitado", value: Estado.SOLICITADO },
  { label: "Pendiente", value: Estado.PENDIENTE },
  { label: "En preparación", value: Estado.EN_PREPARACION },
  { label: "Terminado", value: Estado.TERMINADO },
  { label: "En camino", value: Estado.EN_CAMINO },
  { label: "Entregado", value: Estado.ENTREGADO },
  { label: "Cancelado", value: Estado.CANCELADO },
];

export const PantallaCajero = () => {
  const [estadoActual, setEstadoActual] = useState<Estado>(Estado.EN_PREPARACION);
  const [allPedidos, setAllPedidos] = useState<PedidoResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<PedidoResponseDTO | null>(null);
  const [search, setSearch] = useState("");

  const pedidoService = new PedidoService();
  const dispatch = useAppDispatch();

  const ColumnsTablePedido = [
    { label: "Orden", key: "codigo" },
    {
      label: "Envío",
      key: "tipoEnvio",
      render: (pedido: PedidoResponseDTO) => (
        <span className={`${pedido.tipoEnvio === "DELIVERY" ? "text-red-600" : "font-semibold"}`}>
          {pedido.tipoEnvio}
        </span>
      ),
    },
    {
      label: "Tiempo Estimado",
      key: "horaEstimadaFin",
      render: (pedido: PedidoResponseDTO) => pedido.horaEstimadaFin || "Sin dato",
    },
{
  label: "Agregar tiempo",
  key: "agregarTiempo",
  render: (pedido: PedidoResponseDTO) =>
    pedido.estado === Estado.ENTREGADO || pedido.estado === Estado.CANCELADO ? (
      null
    ) : (
      <div className="flex justify-center items-center">
        <AiOutlinePlus
          className="text-red-600 text-xl cursor-pointer hover:scale-110 transition"
          onClick={() => agregarTiempo(pedido)}
        />
      </div>
    ),
},
    {
      label: "Detalle",
      key: "detalle",
      render: (pedido: PedidoResponseDTO) => (
        <div className="flex justify-center items-center">
          <AiOutlineEye
            className="text-black text-xl cursor-pointer hover:scale-110 transition"
            onClick={() => {
              setPedidoSeleccionado(pedido);
              setOpenModal(true);
            }}
          />
        </div>
      ),
    },
  ];

  const handleDelete = async (id: number) => {
    Swal.fire({
      title: "¿Estas seguro?",
      text: `¿Seguro que quieres eliminar este pedido?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        pedidoService.delete(id).then(() => {
          getPedidos();
        });
      }
    });
  };

  const getPedidos = async () => {
    setLoading(true);
    await pedidoService.getAll().then((pedidoData) => {
      setAllPedidos(pedidoData);
      setLoading(false);
      // console.log("Pedidos recibidos:", pedidoData);
    });
  };

  const agregarTiempo = async (pedido: PedidoResponseDTO) => {
    Swal.fire({
      title: "¿Agregar 5 minutos?",
      text: "¿Seguro que quieres agregar 5 minutos al tiempo estimado?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, agregar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          
          await fetch(`http://localhost:8080/api/pedidos/agregar-min/${pedido.id}?minutos=5`, {
            method: "PUT",
          });
          getPedidos();
          Swal.fire("¡Listo!", "Se agregaron 5 minutos.", "success");
        } catch (error) {
          Swal.fire(
            "Error",
            error instanceof Error ? error.message : "No se pudo agregar el tiempo.",
            "error"
          );
        }
      }
    });
  };

  useEffect(() => {
    getPedidos();
  }, []);

  useEffect(() => {
  const pedidosFiltrados = allPedidos
    .filter(pedido => pedido.estado?.trim().toUpperCase() === estadoActual)
    .filter(pedido =>
      pedido.codigo.toLowerCase().includes(search.toLowerCase())
    );
  dispatch(setDataTable(pedidosFiltrados));
}, [allPedidos, estadoActual, search, dispatch]);

return (
  <div className="bg-[#FFF4E0] h-screen overflow-y-auto">
    <AdminHeader />
    <div className="p-4 bg-white shadow-md rounded-lg mb-4 flex justify-center items-center">
      <TabsPedidos
        estadoActual={estadoActual}
        setEstadoActual={setEstadoActual}
        estadosTabs={estadosTabs}
      />
    </div>
    <div className="flex justify-center mb-4">
      <input
        type="text"
        placeholder="Buscar por código..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="border rounded-lg px-4 py-2 w-full max-w-xs"
      />
    </div>
    {loading ? (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <CircularProgress color="secondary" />
        <h2>Cargando...</h2>
      </div>
    ) : (
      <TableGeneric<PedidoResponseDTO>
        handleDelete={handleDelete}
        columns={ColumnsTablePedido}
        setOpenModal={setOpenModal}
        getRowClassName={(row) => row.estado === Estado.PENDIENTE ? "pending-row" : ""}
      />
    )}
    {pedidoSeleccionado && (
      <PedidoDetalleModal
        pedido={pedidoSeleccionado}
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
    )}
  </div>
);
};