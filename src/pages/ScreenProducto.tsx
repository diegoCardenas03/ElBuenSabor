import { useEffect, useState } from "react";
import { ProductoDTO } from "../types/Producto/ProductoDTO";
import { ProductoService } from "../services/ProductoService";
import { TableGeneric } from "../components/TableGeneric";
import { CircularProgress, Switch } from "@mui/material";
import { ModalProducto } from "../components/modals/ModalProducto";
import { useAppDispatch } from "../hooks/redux";
import { setDataTable } from "../hooks/redux/slices/TableReducer";
import Swal from "sweetalert2";
import { AdminHeader } from "../components/admin/AdminHeader";

export const ScreenProducto = () => {
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const productoService = new ProductoService();
  const dispatch = useAppDispatch();

  // Columnas de la tabla de productos
  const ColumnsTableProducto = [
    {
      label: "Denominación",
      key: "denominacion",
    },
    {
      label: "Descripción",
      key: "descripcion",
    },
    {
      label: "Precio Venta",
      key: "precioVenta",
    },
    {
      label: "Tiempo Estimado (min)",
      key: "tiempoEstimadoPreparacion",
    },
    {
      label: "Activo",
      key: "activo",
      render: (producto: ProductoDTO) => (
        <Switch
          checked={producto.activo}
          onChange={async () => {
            try {
              await productoService.updateEstado(producto.id);
              getProductos();
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
      label: "Acciones",
      key: "acciones",
    },
  ];

  // Función para manejar el borrado de un producto
  const handleDelete = async (id: number) => {
    Swal.fire({
      title: "¿Estas seguro?",
      text: `¿Seguro que quieres eliminar este producto?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        productoService.delete(id).then(() => {
          getProductos();
        });
      }
    });
  };

  // Función para obtener los productos
  const getProductos = async () => {
    await productoService.getAll().then((productoData) => {
      dispatch(setDataTable(productoData));
      setLoading(false);
    });
  };

  useEffect(() => {
    setLoading(true);
    getProductos();
  }, []);

  return (
    <>
      <AdminHeader />
      <div className="bg-[#FFF4E0]">
        <div
          style={{
            padding: ".4rem",
            display: "flex",
            justifyContent: "flex-end",
            width: "90%",
          }}
        >
          <button
            className="rounded-3xl bg-[#BD1E22] text-white px-4 py-2 font-primary font-semibold shadow hover:scale-105 transition text-lg"
            style={{ borderRadius: "9999px" }}
            onClick={() => setOpenModal(true)}
          >
            + Crear producto
          </button>
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
          <TableGeneric<ProductoDTO>
            handleDelete={handleDelete}
            columns={ColumnsTableProducto}
            setOpenModal={setOpenModal}
          />
        )}
      </div>
      <ModalProducto
        getProductos={getProductos}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </>
  );
};