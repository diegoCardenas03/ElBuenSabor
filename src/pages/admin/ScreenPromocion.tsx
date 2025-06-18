import { lazy, useEffect, useState } from "react";
import { PromocionResponseDTO } from "../../types/Promocion/PromocionResponseDTO";     
import { TableGeneric } from "../../components/TableGeneric";
import { CircularProgress } from "@mui/material";
import Swal from "sweetalert2";
import { AdminHeader } from "../../components/admin/AdminHeader";
import { useAppDispatch } from "../../hooks/redux";
import { setDataTable } from "../../hooks/redux/slices/TableReducer";
import { PromocionService } from "../../services/PromocionService";
 import { ModalPromocion } from "../../components/modals/ModalPromocion";

export const ScreenPromocion = () => {
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const promocionService = new PromocionService();
  const dispatch = useAppDispatch();


  // Columnas de la tabla de promociones
  const ColumnsTablePromocion = [
    {
      label: "Imagen",
      key: "urlImagen",
      render: (promo: PromocionResponseDTO) => (
        <img
          src={promo.urlImagen}
          alt={promo.denominacion}
          style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px" }}
        />
      ),
    },
    { label: "Denominación", key: "denominacion" },
    { label: "Fecha Desde", key: "fechaDesde" },
    { label: "Fecha Hasta", key: "fechaHasta" },
    { label: "Descuento (%)", key: "descuento" },
     {
      label: "Precio Venta",
      key: "precioVenta",
      render: (promo: PromocionResponseDTO) => (
        <span>
          ${promo.precioVenta.toLocaleString("es-AR")}
        </span>
      ),

    },
    {
      label: "Precio Costo",
      key: "precioCosto",
      render: (promo: PromocionResponseDTO) => (
        <span>
          ${promo.precioCosto.toLocaleString("es-AR")}
        </span>
      ),
    },
    {
      label: "Acciones",
      key: "acciones",
      // Aquí puedes agregar botones para editar/eliminar si lo deseas
    },
   
  ];

  // Función para manejar el borrado de una promoción
  const handleDelete = async (id: number) => {
    Swal.fire({
      title: "¿Estas seguro?",
      text: `¿Seguro que quieres eliminar esta promoción?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        promocionService.delete(id).then(() => {
          getPromociones();
          
        });
      }
    });
  };

  // Función para obtener las promociones
  const getPromociones = async () => {
    setLoading(true);
    await promocionService.getAll().then((promosData) => {
      dispatch(setDataTable(promosData));
      console.log(promosData);
      setLoading(false);
    });
  };

  useEffect(() => {
    getPromociones();
  }, []);
  return (
    <>
      <AdminHeader text="Promociones" />
      <div className="bg-[#FFF4E0] h-screen">
        <div
          style={{
            padding: ".4rem",
            display: "flex",
            justifyContent: "flex-end",
            width: "90%",
          }}
        >
          <button
            className="rounded-3xl bg-[#BD1E22] text-white px-4 py-2 font-primary font-semibold 
            shadow hover:scale-105 transition text-lg cursor-pointer"
            style={{ borderRadius: "9999px" }}
            onClick={() => setOpenModal(true)}
          >
            + Crear promoción
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
          <TableGeneric<PromocionResponseDTO>
            handleDelete={handleDelete}
            columns={ColumnsTablePromocion}
            setOpenModal={setOpenModal}
          />
        )}
      </div>
       <ModalPromocion
        getPromociones={getPromociones}
        openModal={openModal}
        setOpenModal={setOpenModal}
      /> 
    </>
  );
};