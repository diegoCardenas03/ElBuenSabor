import { useEffect, useState } from "react";
import { ProductoService } from "../services/ProductoService";
import { TableGeneric } from "../components/TableGeneric";
import { CircularProgress, Switch } from "@mui/material";
import { ModalProducto } from "../components/modals/ModalProducto";
import { useAppDispatch } from "../hooks/redux";
import { setDataTable } from "../hooks/redux/slices/TableReducer";
import Swal from "sweetalert2";
import { AdminHeader } from "../components/admin/AdminHeader";
import { IoFilterSharp } from "react-icons/io5";
import { truncar } from "../utils/Utils";
import { ProductoResponseDTO } from "../types/Producto/ProductoResponseDTO";
import { RubroProductoService } from "../services/RubroProductoService";
import { RubroProductoResponseDTO } from "../types/RubroProducto/RubroProductoResponseDTO";

export const ScreenProducto = () => {
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalFilters, setModalFilters] = useState(false);
  const [filtros, setFiltros] = useState({ searchTerm: "", soloActivos: false });
  const [filtroSeleccionado, setFiltroSeleccionado] = useState({ searchTerm: "", soloActivos: false });
  const rubroProductoService = new RubroProductoService();
  const productoService = new ProductoService();
  const dispatch = useAppDispatch();
  const token = sessionStorage.getItem('auth_token');

  // Estado para los rubros productos
  const [rubrosProductos, setRubrosProductos] = useState<{ id: number; denominacion: string }[]>([]);

  // Columnas de la tabla de productos
  const ColumnsTableProducto = [
    {
      label: "Imagen",
      key: "urlImagen",
      render: (producto: ProductoResponseDTO) => (
        <img
          src={producto.urlImagen}
          alt={producto.denominacion}
          style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px" }}
        />
      )
    },
    {
      label: "Denominación",
      key: "denominacion",
    },
    {
      label: "Descripción",
      key: "descripcion",
      render: (producto: ProductoResponseDTO) => truncar(producto.descripcion, 30),
    },
    {
      label: "Precio costo",
      key: "precioCosto",
      render: (producto: ProductoResponseDTO) => {
        const precio = producto.precioCosto.toFixed(2);
        return `$${precio}`;
      },
    },
    {
      label: "Precio Venta",
      key: "precioVenta",
      render: (producto: ProductoResponseDTO) => {
        const precio = producto.precioVenta.toFixed(2);
        return `$${precio}`;
      },
    },
    {
      label: "Tiempo Estimado (min)",
      key: "tiempoEstimadoPreparacion",
    },
    {
      label: "Rubro",
      key: "rubroId",
      render: (producto: ProductoResponseDTO) => {
        const rubro = rubrosProductos.find(r => r.id === producto.rubro.id);
        return rubro ? rubro.denominacion : "-";
      },
    },
    {
      label: "Activo",
      key: "activo",
      render: (producto: ProductoResponseDTO) => (
        <Switch
          checked={producto.activo}
          onChange={async () => {
            try {
              await productoService.updateEstado(producto.id, token!);
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
        productoService.delete(id, token!).then(() => {
          getProductos();
        });
      }
    });
  };

  // Función para obtener los productos
  const getProductos = async () => {
    setLoading(true);
    await productoService.getAll(token!).then((productoData) => {
      let productosDTO = productoData.map((p) => ({
        id: p.id,
        denominacion: p.denominacion,
        descripcion: p.descripcion,
        tiempoEstimadoPreparacion: p.tiempoEstimadoPreparacion,
        precioCosto: p.precioCosto,
        precioVenta: p.precioVenta,
        urlImagen: p.urlImagen,
        activo: p.activo,
        rubroId: p.rubro?.id ?? 0,
        rubro: p.rubro,
        margenGanancia: p.margenGanancia ?? 0,
        detalleProductos: p.detalleProductos.map((d) => ({
          id: d.id,
          cantidad: d.cantidad,
          insumoId: d.insumo?.id ?? 0,
          insumo: d.insumo,
        })),
      }));

      // Filtros
      if (filtros.searchTerm.trim() !== "") {
        productosDTO = productosDTO.filter((p) =>
          p.denominacion.toLowerCase().includes(filtros.searchTerm.toLowerCase())
        );
      }
      if (filtros.soloActivos) {
        productosDTO = productosDTO.filter((p) => p.activo);
      }

      dispatch(setDataTable(productosDTO));
      setLoading(false);
    });
  };

  // Traer rubros productos al montar el componente
  useEffect(() => {
    const fetchRubros = async () => {
      try {
        const data = await rubroProductoService.getAll(token!);
        setRubrosProductos(
          data.map((r: RubroProductoResponseDTO) => ({
            id: r.id ?? 0,
            denominacion: r.denominacion ?? ""
          }))
        );
      } catch {
        setRubrosProductos([]);
      }
    };
    fetchRubros();
  }, []);

  useEffect(() => {
    setLoading(true);
    getProductos();
  }, []);

  useEffect(() => {
    getProductos();
    // eslint-disable-next-line
  }, [filtros]);

  return (
    <>
      <AdminHeader text="Productos" />
      <div className="bg-[#FFF4E0] h-screen" >
        <div className="flex flex-col items-center w-full gap-4 p-4">
          <div className="flex gap-4 items-center justify-center w-full">
            <input
              type="text"
              placeholder="Buscar producto..."
              className="border border-gray-300 rounded-full px-3 py-1 bg-white"
              value={filtros.searchTerm}
              onChange={(e) => setFiltros(prev => ({ ...prev, searchTerm: e.target.value }))}
            />
            <button
              onClick={() => setModalFilters(true)}
              className="rounded-full bg-[#BD1E22] text-white px-4 py-2 font-primary font-semibold shadow hover:scale-105 transition text-lg"
            >
              <IoFilterSharp className="text-2xl" />
            </button>
            <button
              className="rounded-full bg-[#BD1E22] text-white px-4 py-2 font-primary font-semibold shadow hover:scale-105 transition text-lg"
              onClick={() => setOpenModal(true)}
            >
              + Crear producto
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
          <TableGeneric<ProductoResponseDTO>
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
      {modalFilters && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="relative bg-white p-5 rounded-[20px] shadow-lg w-[90%] sm:w-[65%] lg:w-[30%] flex flex-col">
            <button
              className="absolute top-2 right-3 cursor-pointer font-bold text-gray-500 hover:text-gray-800"
              onClick={() => setModalFilters(false)}
            >
              ✕
            </button>
            <h2 className="text-secondary text-base font-bold text-center mb-4">Filtros de Productos</h2>
            <label className="flex items-center mb-2 gap-2">
              <input
                type="checkbox"
                checked={filtroSeleccionado.soloActivos}
                onChange={() => setFiltroSeleccionado((prev) => ({ ...prev, soloActivos: !prev.soloActivos }))
                }
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