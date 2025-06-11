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
    { label: "Tiempo Estimado", key: "horaEstimadaFin", render: () => "30 min" },
    {
      label: "Agregar tiempo",
      key: "agregarTiempo",
      render: () => (
        <AiOutlinePlus className="text-red-600 text-xl cursor-pointer hover:scale-110 transition" />
      ),
    },
    {
      label: "Detalle",
      key: "detalle",
      render: () => (
        <AiOutlineEye className="text-black text-xl cursor-pointer hover:scale-110 transition" />
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
      console.log("Pedidos recibidos:", pedidoData); 
    });
  };

  useEffect(() => {
    getPedidos();
  }, []);

  useEffect(() => {
    // FILTRO TOLERANTE a espacios y mayúsculas/minúsculas
    const pedidosFiltrados = allPedidos.filter(
      (pedido) => pedido.estado?.trim().toUpperCase() === estadoActual
    );
    console.log("Filtrando por:", estadoActual);
    console.log("Pedidos filtrados:", pedidosFiltrados);
    dispatch(setDataTable(pedidosFiltrados));
  }, [allPedidos, estadoActual, dispatch]);

  return (
    <div className=" bg-[#FFF4E0] h-screen">
      <AdminHeader />
      <TabsPedidos
        estadoActual={estadoActual}
        setEstadoActual={setEstadoActual}
        estadosTabs={estadosTabs}
      />
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
        
        />
      )}
    </div>
  );
};