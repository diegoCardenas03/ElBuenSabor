import { useEffect, useState, useCallback } from 'react';
import { FaSearch } from "react-icons/fa";
import { RubroInsumoDTO } from '../../types/RubroInsumo/RubroInsumoDTO';
import { RubroProductoDTO } from '../../types/RubroProducto/RubroProductoDTO';
import Swal from "sweetalert2";
import CategoriasLista from "./CategoriasLista";
import CategoriaModal from "./CategoriaModal";
import { RubroInsumoClient } from "../../services/RubroInsumoClient";
import { RubroProductoClient } from "../../services/RubroProductoClient";

// Tipos internos para el manejo en frontend
type RubroInsumo = RubroInsumoDTO & {
  id: number;
  subRubros: RubroInsumo[];
  tipo: "Insumo";
};
type RubroProducto = RubroProductoDTO & {
  id: number;
  tipo: "Producto";
};
type Rubro = RubroInsumo | RubroProducto;

// Función para detectar si un rubro es hijo de otro (para mostrar sólo raíz en la lista)
function rubroPadreIdEnData(rubros: RubroInsumo[], id: number): boolean {
  function search(rubros: RubroInsumo[]): boolean {
    for (const rubro of rubros) {
      if (rubro.subRubros.some(sub => sub.id === id)) return true;
      if (search(rubro.subRubros)) return true;
    }
    return false;
  }
  return search(rubros);
}

// Para el select: recorre todo el árbol y cada rubro aparece SOLO UNA VEZ (aunque el backend lo mande duplicado)
const obtenerTodosRubrosUnicosAnidados = (rubros: RubroInsumo[], depth = 0, visitados = new Set<number>()): { rubro: RubroInsumo, depth: number }[] => {
  let result: { rubro: RubroInsumo, depth: number }[] = [];
  for (const rubro of rubros) {
    if (!visitados.has(rubro.id)) {
      visitados.add(rubro.id);
      result.push({ rubro, depth });
      result = result.concat(obtenerTodosRubrosUnicosAnidados(rubro.subRubros, depth + 1, visitados));
    }
  }
  return result;
};

const rubroInsumoClient = new RubroInsumoClient();
const rubroProductoClient = new RubroProductoClient();

const Categorias = () => {
  const [modalAbierto, setModalAbierto] = useState<boolean>(false);
  const [nombreRubro, setNombreRubro] = useState<string>("");
  const [tipoRubro, setTipoRubro] = useState<"Insumo" | "Producto">("Insumo");
  const [rubroPadreSeleccionado, setRubroPadreSeleccionado] = useState<string>("");
  const [rubrosInsumos, setRubrosInsumos] = useState<RubroInsumo[]>([]);
  const [rubrosProductos, setRubrosProductos] = useState<RubroProducto[]>([]);
  const [busqueda, setBusqueda] = useState<string>("");
  const [opcionFiltrar, setOpcionFiltrar] = useState<"Insumo" | "Producto" | "">("Insumo");
  const [abiertos, setAbiertos] = useState<{ [id: number]: boolean }>({});
  const [errorRubrosInsumo, setErrorRubrosInsumo] = useState(false);

  const [editando, setEditando] = useState<boolean>(false);
  const [rubroEditando, setRubroEditando] = useState<Rubro | null>(null);

  // Función para cargar rubros desde el backend usando los servicios
  const cargarRubros = useCallback(async () => {
    // Traer todos los Rubros Insumo
    try {
      const data = await rubroInsumoClient.getAll();
      function mapRubroInsumo(dto: any): RubroInsumo {
        return {
          id: dto.id,
          denominacion: dto.denominacion,
          activo: dto.activo,
          tipo: "Insumo",
          subRubros: (dto.subRubros || []).map(mapRubroInsumo)
        }
      }
      setRubrosInsumos(data.map(mapRubroInsumo));
      setErrorRubrosInsumo(false); // Reset error si carga bien
    } catch (error) {
      if (!errorRubrosInsumo) {
        setErrorRubrosInsumo(true);
        Swal.fire({
          position: "bottom-end",
          icon: "error",
          title: "Error al cargar rubros insumo",
          showConfirmButton: false,
          timer: 1000,
          width: "20em"
        });
        console.error("Error fetch rubros insumo", error);
      }
    }

    // Traer todos los Rubros Producto
    try {
      const data = await rubroProductoClient.getAll();
      setRubrosProductos(
        data.map(dto => ({
          id: dto.id,
          denominacion: dto.denominacion,
          activo: dto.activo,
          tipo: "Producto"
        }))
      );
    } catch (error) {
      Swal.fire({
        position: "bottom-end",
        icon: "error",
        title: "Error al cargar rubros producto",
        showConfirmButton: false,
        timer: 1000,
        width: "20em"
      });
      console.error("Error fetch rubros producto", error);
    }
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    cargarRubros();
    return () => setErrorRubrosInsumo(false);
  }, [cargarRubros]);

  const toggleAbierto = (id: number) => {
    setAbiertos(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleEliminar = async (rubro: Rubro) => {
    try {
      if (rubro.tipo === "Insumo") {
        await rubroInsumoClient.delete(rubro.id);
      } else {
        await rubroProductoClient.delete(rubro.id);
      }
      await cargarRubros();

      Swal.fire({
        position: "bottom-end",
        icon: "success",
        title: "Categoría eliminada correctamente",
        showConfirmButton: false,
        timer: 1000,
        width: "20em"
      });
    } catch (error) {
      Swal.fire({
        position: "bottom-end",
        icon: "error",
        title: "Error al eliminar categoría",
        showConfirmButton: false,
        timer: 1000,
        width: "20em"
      });
      console.error("Error al eliminar rubro", error);
    }
  };

  // ACTIVAR/DESACTIVAR rubro usando updateEstado del service
  const handleActivarDesactivar = async (rubro: Rubro) => {
    try {
      if (rubro.tipo === "Insumo") {
        await rubroInsumoClient.updateEstado(rubro.id);
      } else {
        await rubroProductoClient.updateEstado(rubro.id);
      }
      await cargarRubros();
      Swal.fire({
        position: "bottom-end",
        icon: "success",
        title: "Estado actualizado correctamente",
        showConfirmButton: false,
        timer: 1000,
        width: "20em"
      });
    } catch (error) {
      Swal.fire({
        position: "bottom-end",
        icon: "error",
        title: "Error al actualizar estado",
        showConfirmButton: false,
        timer: 1000,
        width: "20em"
      });
      console.error("Error al actualizar estado del rubro", error);
    }
  };

  // Recursivo: filtra búsqueda en denominación y subRubros (no filtra por activo)
  const filtrarRubrosInsumos = (rubros: RubroInsumo[], termino: string): RubroInsumo[] => {
    const term = termino.toLowerCase();
    return rubros.filter(rubro => {
      const nombreMatch = rubro.denominacion.toLowerCase().includes(term);
      const subRubrosFiltrados = filtrarRubrosInsumos(rubro.subRubros, termino);
      return nombreMatch || subRubrosFiltrados.length > 0;
    }).map(rubro => ({
      ...rubro,
      subRubros: filtrarRubrosInsumos(rubro.subRubros, termino)
    }));
  };

  // Mostrar TODOS los rubros raíz (activos e inactivos)
  const filteredInsumos = filtrarRubrosInsumos(rubrosInsumos, busqueda)
    .filter(rubro => !rubroPadreIdEnData(rubrosInsumos, rubro.id));

  // Filtrar productos (activos e inactivos)
  const filteredProductos = rubrosProductos
    .filter(rubro => rubro.denominacion.toLowerCase().includes(busqueda.toLowerCase()));

  // Handler para editar rubro y abrir modal
  const handleEditar = (rubro: Rubro) => {
    setEditando(true);
    setRubroEditando(rubro);
    setNombreRubro(rubro.denominacion);
    setTipoRubro(rubro.tipo);
    setModalAbierto(true);

    if (rubro.tipo === "Insumo") {
      const buscarPadre = (rubros: RubroInsumo[], id: number, padreId?: number): number | "" => {
        for (const rubroItem of rubros) {
          if (rubroItem.subRubros.some(sub => sub.id === id)) return rubroItem.id;
          const resultado = buscarPadre(rubroItem.subRubros, id, rubroItem.id);
          if (resultado) return resultado;
        }
        return "";
      };
      const padreId = buscarPadre(rubrosInsumos, rubro.id);
      setRubroPadreSeleccionado(padreId ? String(padreId) : "");
    } else {
      setRubroPadreSeleccionado("");
    }
  };

  // Handler para abrir modal para crear nuevo rubro
  const handleAbrirModalNuevo = () => {
    setModalAbierto(true);
    setEditando(false);
    setRubroEditando(null);
    setNombreRubro("");
    setTipoRubro("Insumo");
    setRubroPadreSeleccionado("");
  };

  // Handler para cerrar modal
  const handleCerrarModal = () => {
    setModalAbierto(false);
    setEditando(false);
    setRubroEditando(null);
    setNombreRubro("");
    setTipoRubro("Insumo");
    setRubroPadreSeleccionado("");
  };

  return (
    <>
      <div className='w-5/6 mt-10 flex justify-around items-center'>
        <form className='flex items-center'>
          <input type="search" placeholder='Buscar' onChange={(e) => setBusqueda(e.target.value)} className='bg-white py-2 pl-3 pr-8 border rounded-2xl focus:outline-[#BD1E22]' />
          <FaSearch className={`relative right-7 ${busqueda ? "hidden" : "block"}`} />
        </form>
        <div className='flex gap-2'>
          <button className={`font-bold py-2 rounded-lg px-3 cursor-pointer ${opcionFiltrar === "Insumo" ? "bg-gray-200" : "bg-white"}`} onClick={() => setOpcionFiltrar("Insumo")} type="button" > Insumos </button>
          <button className={`font-bold py-2 rounded-lg px-3 cursor-pointer ${opcionFiltrar === "Producto" ? "bg-gray-200" : "bg-white"}`} onClick={() => setOpcionFiltrar("Producto")} type="button"> Productos </button>
        </div>
        <button className='bg-secondary text-white px-2 py-2 rounded-2xl cursor-pointer' onClick={handleAbrirModalNuevo} > +Agregar Categoría </button>
      </div>

      <div className="mt-10 bg-white h-10 w-8/10 pl-10 flex items-center rounded-t-lg font-semibold">Nombre</div>

      <CategoriasLista
        opcionFiltrar={opcionFiltrar}
        filteredInsumos={filteredInsumos}
        filteredProductos={filteredProductos}
        abiertos={abiertos}
        toggleAbierto={toggleAbierto}
        handleEditar={handleEditar}
        handleActivarDesactivar={handleActivarDesactivar}
      />

      {modalAbierto && (
        <CategoriaModal
          editando={editando}
          rubroEditando={rubroEditando}
          nombreRubro={nombreRubro}
          setNombreRubro={setNombreRubro}
          tipoRubro={tipoRubro}
          setTipoRubro={setTipoRubro}
          rubroPadreSeleccionado={rubroPadreSeleccionado}
          setRubroPadreSeleccionado={setRubroPadreSeleccionado}
          rubrosInsumos={rubrosInsumos}
          obtenerTodosRubrosUnicosAnidados={obtenerTodosRubrosUnicosAnidados}
          handleCerrarModal={handleCerrarModal}
          cargarRubros={cargarRubros}
        />
      )}
    </>
  );
};

export default Categorias;