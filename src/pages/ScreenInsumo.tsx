import { useEffect, useState } from "react";
import { InsumoService } from "../services/InsumoService";
import { InsumoResponseDTO } from "../types/Insumo/InsumoResponseDTO";
import { TableGeneric } from "../components/TableGeneric";
import { CircularProgress } from "@mui/material";
import { ModalInsumo } from "../components/modals/ModalInsumo";
import { useAppDispatch } from "../hooks/redux";
import { setDataTable } from "../hooks/redux/slices/TableReducer";
import Swal from "sweetalert2";
import { AdminHeader } from "../components/admin/AdminHeader";
import { Switch } from "@mui/material";
import { ModalCompra } from "../components/modals/ModalCompra";
// Definición de la URL base de la API
// const API_URL = import.meta.env.VITE_API_URL;
export const ScreenInsumo = () => {
  // Estado para controlar la carga de datos
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openModalCompra, setOpenModalCompra] = useState(false);
  const [insumos, setInsumos] = useState<InsumoResponseDTO[]>([]);

  const insumoService = new InsumoService();
  const dispatch = useAppDispatch();
  const cargarInsumos = async () => {
    const api = new InsumoService();
    const data = await api.getAll();
    setInsumos(data);
  };
  useEffect(() => {
    cargarInsumos();
  }, []);

  // Columnas de la tabla de insumos
  const ColumnsTableInsumo = [
    // {
    //   label: "ID",
    //   key: "id",
    //   render: (insumo: RubroInsumoResponseDTO) => insumo.id?.toString() ?? "0",
    // },
    {
      label: "Denominación",
      key: "denominacion",
    },
    {
      label: "Precio Costo",
      key: "precioCosto",
    },
    {
      label: "Precio Venta",
      key: "precioVenta",
      render: (insumo: InsumoResponseDTO) =>
        insumo.precioVenta ? insumo.precioVenta : "Sin precio venta",
    },
    {
      label: "Stock Actual",
      key: "stockActual",
    },
    {
      label: "Stock Mínimo",
      key: "stockMinimo",
    },
    {
      label: "Unidad de Medida",
      key: "unidadMedida",
      render: (insumo: InsumoResponseDTO) => insumo.unidadMedida.toString(),
    },
    {
      label: "Para Elaborar",
      key: "esParaElaborar",
      render: (insumo: InsumoResponseDTO) =>
        insumo.esParaElaborar ? "Sí" : "No",
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
              getInsumos(); // Actualizás la tabla
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
      render: (insumo: InsumoResponseDTO) =>
        insumo.rubro?.denominacion ?? "Sin rubro",
    },

    {
      label: "Acciones",
      key: "acciones",
    },
  ];

  // Función para manejar el borrado de un insumo
  const handleDelete = async (id: number) => {
    // Mostrar confirmación antes de eliminar
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
        // Eliminar la persona si se confirma
        insumoService.delete(id).then(() => {
          getInsumos();
        });
      }
    });
  };
  // Función para obtener los insumos
  const getInsumos = async () => {
    await insumoService.getAll().then((insumoData) => {
      dispatch(setDataTable(insumoData));
      setLoading(false);
    });
  };

  // Efecto para cargar los datos al inicio
  useEffect(() => {
    setLoading(true);
    getInsumos();
  }, []);

  return (
    <>
      <AdminHeader text="Insumos" />
      <div className=" bg-[#FFF4E0] h-screen mt">
<div
  className="flex justify-end w-[90%] gap-4 p-[.4rem]"
>
  
  <button
    className="rounded-3xl bg-[#BD1E22] text-white px-4 py-2 my-3 font-primary font-semibold shadow hover:scale-105 transition text-lg cursor-pointer"
    style={{ borderRadius: "9999px" }}
    onClick={() => setOpenModal(true)}
  >
    + Crear insumo
  </button>
  <button
    onClick={() => setOpenModalCompra(true)}
    className="rounded-3xl bg-[#BD1E22] text-white px-4 py-2 my-3 font-primary font-semibold shadow hover:scale-105 transition text-lg cursor-pointer"
  >
    Registrar Compra
  </button>
</div>
        {/* Mostrar indicador de carga mientras se cargan los datos */}
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
          // Mostrar la tabla de insumos una vez que los datos se han cargado
          <TableGeneric<InsumoResponseDTO>
            handleDelete={handleDelete}
            columns={ColumnsTableInsumo}
            setOpenModal={setOpenModal}
            getRowClassName={(insumo) =>
              insumo.stockActual < insumo.stockMinimo
                ? "bg-red-100 text-red-900 font-semibold"
                : ""
            }
          />
        )}
      </div>

      {/* Modal para agregar o editar una persona */}
      <ModalInsumo
        getInsumos={getInsumos}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
      <ModalCompra
        open={openModalCompra}
        setOpen={setOpenModalCompra}
        insumos={insumos}
        onCompraExitosa={cargarInsumos}
      />
    </>
  );
};
