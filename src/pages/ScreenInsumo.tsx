import { useEffect, useState } from "react";
import { InsumoService } from "../services/InsumoService";
import { InsumoResponseDTO } from "../types/Insumo/InsumoResponseDTO";
import { TableGeneric } from "../components/TableGeneric";
import { Button, CircularProgress } from "@mui/material";
import { ModalInsumo } from "../components/modals/ModalInsumo";
import { useAppDispatch } from "../hooks/redux";

import { setDataTable } from "../hooks/redux/slices/TableReducer";
import Swal from "sweetalert2";
import { RubroInsumoResponseDTO } from "../types/RubroInsumo/RubroInsumoResponseDTO";

// Definición de la URL base de la API
const API_URL = import.meta.env.VITE_API_URL;

export const ScreenInsumo = () => {
  // Estado para controlar la carga de datos
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const insumoService = new InsumoService(API_URL + "/insumos");
  const dispatch = useAppDispatch();

  // Columnas de la tabla de insumos
const ColumnsTableInsumo = [
  {
    label: "ID",
    key: "id",
    render: (insumo: RubroInsumoResponseDTO) => insumo.id?.toString() ?? "0",
  },
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
    render: (insumo: InsumoResponseDTO) => (insumo.esParaElaborar ? "Sí" : "No"),
  },
  {
    label: "Activo",
    key: "activo",
    render: (insumo: InsumoResponseDTO) => (insumo.activo ? "Sí" : "No"),
  },
{
  label: "Rubro",
  render: (insumo: InsumoResponseDTO) => insumo.rubro?.denominacion ?? "Sin rubro"
},

  {
    label: "Acciones",
    key: "acciones",
  },
];

  // Función para manejar el borrado de una persona
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
  // Función para obtener las personas
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
      <div>
        <div
          style={{
            padding: ".4rem",
            display: "flex",
            justifyContent: "flex-end",
            width: "90%",
          }}
        >
          {/* Botón para abrir el modal de agregar persona */}
          <Button
            onClick={() => {
              setOpenModal(true);
            }}
            variant="contained"
          >
            Agregar
          </Button>
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
          />
        )}
      </div>

      {/* Modal para agregar o editar una persona */}
      <ModalInsumo
        getInsumos={getInsumos}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </>
  );
};
