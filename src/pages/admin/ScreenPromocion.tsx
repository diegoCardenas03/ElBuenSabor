import { useEffect, useState } from "react";
import { PromocionResponseDTO } from "../../types/Promocion/PromocionResponseDTO";     
import { TableGeneric } from "../../components/TableGeneric";
import { CircularProgress } from "@mui/material";
import Swal from "sweetalert2";
import { AdminHeader } from "../../components/admin/AdminHeader";
import { useAppDispatch } from "../../hooks/redux";
import { setDataTable } from "../../hooks/redux/slices/TableReducer";
import { PromocionService } from "../../services/PromocionService";
import { ModalPromocion } from "../../components/modals/ModalPromocion";
import { IoFilterSharp } from "react-icons/io5";


export const ScreenPromocion = () => {
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalFilters, setModalFilters] = useState(false);
  const [filtros, setFiltros] = useState({ searchTerm: "", soloActivos: false });
  const [filtroSeleccionado, setFiltroSeleccionado] = useState({ searchTerm: "", soloActivos: false });

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
      label: "Precio Venta S/Desc.",
      key: "precioVentaSinDescuento",
      render: (promo: PromocionResponseDTO) => {
       
        const sinDescuento = promo.descuento < 100
          ? promo.precioVenta / (1 - promo.descuento / 100)
          : 0;
        return (
          <span>
            ${sinDescuento.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        );
      }
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
    { label: "Estado", key: "activo", render: (promo: PromocionResponseDTO) => (promo.activo ? "Activo" : "Inactivo") },
    {
      label: "Acciones",
      key: "acciones",
      
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
      let promosFiltradas = promosData;

      // Filtro por búsqueda
      if (filtros.searchTerm.trim() !== "") {
        promosFiltradas = promosFiltradas.filter((p) =>
          p.denominacion.toLowerCase().includes(filtros.searchTerm.toLowerCase())
        );
      }
      // Filtro por solo activos
      if (filtros.soloActivos) {
        promosFiltradas = promosFiltradas.filter((p) => p.activo);
      }

      dispatch(setDataTable(promosFiltradas));
      setLoading(false);
    });
  };

  useEffect(() => {
    getPromociones();
    // eslint-disable-next-line
  }, [filtros]);
  return (
    <>
      <AdminHeader text="Promociones" />
      <div className="bg-[#FFF4E0] h-screen">
        <div className="flex flex-col items-center w-full gap-4 p-4">
          <div className="flex gap-4 items-center justify-center w-full">
            <input
              type="text"
              placeholder="Buscar promoción..."
              className="border border-gray-300 rounded-full px-3 py-1 bg-white"
              value={filtros.searchTerm}
              onChange={(e) => setFiltros(prev => ({ ...prev, searchTerm: e.target.value }))}
            />
            <button
              onClick={() => setModalFilters(true)}
              className="rounded-full bg-[#BD1E22] text-white px-4 py-2 font-primary font-semibold shadow hover:scale-105 transition text-lg"
            >
              <IoFilterSharp className="inline-block mr-2" />
              
            </button>
            <button
              className="rounded-full bg-[#BD1E22] text-white px-4 py-2 font-primary font-semibold shadow hover:scale-105 transition text-lg"
              onClick={() => setOpenModal(true)}
            >
              + Crear promoción
            </button>
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
      {modalFilters && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
    <div className="relative bg-white p-5 rounded-[20px] shadow-lg w-[90%] sm:w-[65%] lg:w-[30%] flex flex-col">
      <button
        className="absolute top-2 right-3 cursor-pointer font-bold text-gray-500 hover:text-gray-800"
        onClick={() => setModalFilters(false)}
      >
        ✕
      </button>
      <h2 className="text-secondary text-base font-bold text-center mb-4">Filtros de Promociones</h2>
      <label className="flex items-center mb-2 gap-2">
        <input
          type="checkbox"
          checked={filtroSeleccionado.soloActivos}
          onChange={() => setFiltroSeleccionado((prev) => ({ ...prev, soloActivos: !prev.soloActivos }))}
        />
        Solo activos
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
          setFiltros({ searchTerm: "", soloActivos: false });
          setFiltroSeleccionado({ searchTerm: "", soloActivos: false });
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