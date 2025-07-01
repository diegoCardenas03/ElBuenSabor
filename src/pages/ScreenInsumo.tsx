import { useEffect, useState } from "react";
import { InsumoService } from "../services/InsumoService";
import { InsumoResponseDTO } from "../types/Insumo/InsumoResponseDTO";
import { TableGeneric } from "../components/TableGeneric";
import { CircularProgress, Switch } from "@mui/material";
import { ModalInsumo } from "../components/modals/ModalInsumo";
import { ModalCompra } from "../components/modals/ModalCompra";
import { useAppDispatch } from "../hooks/redux";
import { setDataTable } from "../hooks/redux/slices/TableReducer";
import Swal from "sweetalert2";
import { AdminHeader } from "../components/admin/AdminHeader";
import { IoFilterSharp } from "react-icons/io5";
export const ScreenInsumo = () => {
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openModalCompra, setOpenModalCompra] = useState(false);
  const [insumos, setInsumos] = useState<InsumoResponseDTO[]>([]);
  const [modalFilters, setModalFilters] = useState(false);
  const [filtros, setFiltros] = useState({ searchTerm: "", soloActivos: false, stockBajo: false });
  const [filtroSeleccionado, setFiltroSeleccionado] = useState({ searchTerm: "", soloActivos: false, stockBajo: false });

  const insumoService = new InsumoService();
  const dispatch = useAppDispatch();
  const token = sessionStorage.getItem('auth_token');


  const cargarInsumos = async () => {
    const api = new InsumoService();
    const data = await api.getAll();
    setInsumos(data);
  };


  const getInsumos = async () => {
    setLoading(true);
    const insumoData = await insumoService.getAll(token!);
    let filtrados = [...insumoData];

    if (filtros.searchTerm.trim() !== "") {
      filtrados = filtrados.filter((i) =>
        i.denominacion.toLowerCase().includes(filtros.searchTerm.toLowerCase())
      );
    }

    if (filtros.soloActivos) {
      filtrados = filtrados.filter((i) => i.activo);
    }

    if (filtros.stockBajo) {
      filtrados = filtrados.filter((i) => i.stockActual < i.stockMinimo);
    }

    dispatch(setDataTable(filtrados));
    setLoading(false);
  };

  useEffect(() => {
    getInsumos();
  }, [filtros]);

  useEffect(() => {
    if (openModalCompra) {
      cargarInsumos();
    }
  }, [openModalCompra]);

  const ColumnsTableInsumo = [
    { label: "Denominación", key: "denominacion" },
    {
      label: "Precio Costo", key: "precioCosto",
      render: (insumo: InsumoResponseDTO) => '$' + insumo.precioCosto,
    },
    {
      label: "Precio Venta",
      key: "precioVenta",
      render: (insumo: InsumoResponseDTO) =>
        insumo.precioVenta ? '$' + insumo.precioVenta : "Sin precio venta",
    },
    { label: "Stock Actual", key: "stockActual" },
    { label: "Stock Mínimo", key: "stockMinimo" },
    {
      label: "Unidad de Medida",
      key: "unidadMedida",
      render: (insumo: InsumoResponseDTO) => insumo.unidadMedida.toString(),
    },
    {
      label: "Para Elaborar",
      key: "esParaElaborar",
      render: (insumo: InsumoResponseDTO) => (insumo.esParaElaborar ? "Sí" : "No"),
    },
    {
      label: "Activo",
      key: "activo",
      render: (insumo: InsumoResponseDTO) => (
        <Switch
          checked={insumo.activo}
          onChange={async () => {
            try {
              await insumoService.updateEstado(insumo.id);
              getInsumos();
            } catch (error) {
              Swal.fire(
                error instanceof Error ? error.message : String(error),
                "No se pudo actualizar el estado",
                "error"
              );
            }
          }}
          color="primary"
        />
      ),
    },
    {
      label: "Rubro",
      key: "rubro",
      render: (insumo: InsumoResponseDTO) => insumo.rubro?.denominacion ?? "Sin rubro",
    },
    { label: "Acciones", key: "acciones" },
  ];

  const handleDelete = async (id: number) => {
    Swal.fire({
      title: "¿Estas seguro?",
      text: `¿Seguro que quieres eliminar?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        insumoService.delete(id).then(() => {
          getInsumos();
        });
      }
    });
  };

  return (
    <>
      <AdminHeader text="Insumos" />
      <div className="bg-[#FFF4E0] h-screen">
        <div className="flex flex-wrap justify-center items-center w-full gap-4 p-4">

          <div className="flex gap-4 items-center">
            <input
              type="text"
              placeholder="Buscar insumo..."
              className="border border-gray-300 rounded-full px-3 py-1 bg-white"
              onChange={(e) => setFiltros(prev => ({ ...prev, searchTerm: e.target.value }))}
            />
            <button
              onClick={() => setModalFilters(true)}
              className="rounded-full bg-[#BD1E22] text-white px-4 py-2 font-primary font-semibold shadow hover:scale-105 transition text-lg"
            >
              <IoFilterSharp className="text-2xl" />

            </button>

          </div>

          <div className="flex gap-4">
            <button
              className="rounded-full bg-[#BD1E22] text-white px-4 py-2 font-primary font-semibold shadow hover:scale-105 transition text-lg"
              onClick={() => setOpenModal(true)}
            >
              + Crear insumo
            </button>
            <button
              onClick={() => setOpenModalCompra(true)}
              className="rounded-full bg-[#BD1E22] text-white px-4 py-2 font-primary font-semibold shadow hover:scale-105 transition text-lg"
            >
              Registrar Compra
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center flex-col gap-4 h-full">
            <CircularProgress color="secondary" />
            <h2>Cargando...</h2>
          </div>
        ) : (
          <TableGeneric<InsumoResponseDTO>
            handleDelete={handleDelete}
            columns={ColumnsTableInsumo}
            setOpenModal={setOpenModal}
            getRowClassName={(insumo) =>
              insumo.stockActual < insumo.stockMinimo ? "bg-red-100 text-red-900 font-semibold" : ""
            }
          />
        )}
      </div>

      <ModalInsumo getInsumos={getInsumos} openModal={openModal} setOpenModal={setOpenModal} />
      <ModalCompra
        open={openModalCompra}
        setOpen={setOpenModalCompra}
        insumos={insumos}
        onCompraExitosa={cargarInsumos}
      />

      {modalFilters && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="relative bg-white p-5 rounded-[20px] shadow-lg w-[90%] sm:w-[65%] lg:w-[30%] flex flex-col">
            <button
              className="absolute top-2 right-3 cursor-pointer font-bold text-gray-500 hover:text-gray-800"
              onClick={() => setModalFilters(false)}
            >
              ✕
            </button>

            <h2 className="text-secondary text-base font-bold text-center mb-4">Filtros de Insumos</h2>

            <label className="flex items-center mb-2 gap-2">
              <input
                type="checkbox"
                checked={filtroSeleccionado.soloActivos}
                onChange={() => setFiltroSeleccionado((prev) => ({ ...prev, soloActivos: !prev.soloActivos }))}
              />
              Solo activos
            </label>

            <label className="flex items-center mb-4 gap-2">
              <input
                type="checkbox"
                checked={filtroSeleccionado.stockBajo}
                onChange={() => setFiltroSeleccionado((prev) => ({ ...prev, stockBajo: !prev.stockBajo }))}
              />
              Stock bajo
            </label>

            <button
              className="bg-tertiary text-white mt-2 px-2 py-1 rounded-full w-[40%] mx-auto hover:bg-tertiary/80 transition-all duration-300 ease-in-out"
              onClick={() => {
                setFiltros(prev => ({ ...prev, ...filtroSeleccionado }));
                setModalFilters(false);
              }}
            >
              Aplicar
            </button>

            <button
              className="text-secondary mt-2 px-2 py-1 rounded-full w-[40%] mx-auto cursor-pointer hover:underline"
              onClick={() => {
                setFiltros({ searchTerm: "", soloActivos: false, stockBajo: false });
                setFiltroSeleccionado({ searchTerm: "", soloActivos: false, stockBajo: false });
                setModalFilters(false);
              }}
            >
              Borrar filtros
            </button>
          </div>
        </div>
      )}
    </>
  );
};
