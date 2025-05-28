import { FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import { RubroInsumoDTO } from '../../types/RubroInsumo/RubroInsumoDTO';
import { RubroProductoDTO } from '../../types/RubroProducto/RubroProductoDTO';

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

type CategoriaModalProps = {
  editando: boolean;
  rubroEditando: Rubro | null;
  nombreRubro: string;
  setNombreRubro: (nombre: string) => void;
  tipoRubro: "Insumo" | "Producto";
  setTipoRubro: (tipo: "Insumo" | "Producto") => void;
  rubroPadreSeleccionado: string;
  setRubroPadreSeleccionado: (id: string) => void;
  rubrosInsumos: RubroInsumo[];
  obtenerTodosRubrosUnicosAnidados: (rubros: RubroInsumo[], depth?: number, visitados?: Set<number>) => { rubro: RubroInsumo, depth: number }[];
  handleCerrarModal: () => void;
  cargarRubros: () => Promise<void>;
};

const CategoriaModal = ({
  editando,
  rubroEditando,
  nombreRubro,
  setNombreRubro,
  tipoRubro,
  setTipoRubro,
  rubroPadreSeleccionado,
  setRubroPadreSeleccionado,
  rubrosInsumos,
  obtenerTodosRubrosUnicosAnidados,
  handleCerrarModal,
  cargarRubros
}: CategoriaModalProps) => {

  // ACTUALIZADO: ahora usa los endpoints nuevos para editar y crear
  const crearRubro = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreRubro || !tipoRubro) return;

    try {
      if (editando && rubroEditando) {
        if (tipoRubro === "Insumo") {
          const rubroEditado: RubroInsumoDTO = {
            denominacion: nombreRubro,
            activo: true,
            rubroPadreId: rubroPadreSeleccionado ? Number(rubroPadreSeleccionado) : undefined,
            tipo: "Insumo"
          };
          const res = await fetch(`http://localhost:8080/api/rubroinsumos/update/${rubroEditando.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(rubroEditado)
          });
          if (!res.ok) throw new Error('Error en PUT rubro insumo');
          
          // Recargar datos después de editar
          await cargarRubros();
          
          Swal.fire({
            position: "bottom-end",
            icon: "success",
            title: "Categoría actualizada correctamente",
            showConfirmButton: false,
            timer: 1000,
            width: "20em"
          });
        } else {
          const rubroEditado: RubroProductoDTO = {
            denominacion: nombreRubro,
            activo: true,
          };
          const res = await fetch(`http://localhost:8080/api/rubroproductos/update/${rubroEditando.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(rubroEditado)
          });
          if (!res.ok) throw new Error('Error en PUT rubro producto');
          
          // Recargar datos después de editar
          await cargarRubros();
          
          Swal.fire({
            position: "bottom-end",
            icon: "success",
            title: "Categoría actualizada correctamente",
            showConfirmButton: false,
            timer: 1000,
            width: "20em"
          });
        }
      } else {
        if (tipoRubro === "Insumo") {
          const nuevoRubro: RubroInsumoDTO = {
            denominacion: nombreRubro,
            activo: true,
            rubroPadreId: rubroPadreSeleccionado ? Number(rubroPadreSeleccionado) : undefined,
            tipo: "Insumo"
          };
          const res = await fetch("http://localhost:8080/api/rubroinsumos/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevoRubro)
          });
          if (!res.ok) throw new Error('Error en POST rubro insumo');
          
          // Recargar datos después de crear
          await cargarRubros();
          
          Swal.fire({
            position: "bottom-end",
            icon: "success",
            title: "Categoría creada correctamente",
            showConfirmButton: false,
            timer: 1000,
            width: "20em"
          });
        } else {
          const nuevoProducto: RubroProductoDTO = {
            denominacion: nombreRubro,
            activo: true,
          };
          const res = await fetch("http://localhost:8080/api/rubroproductos/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevoProducto)
          });
          if (!res.ok) throw new Error('Error en POST rubro producto');
          
          // Recargar datos después de crear
          await cargarRubros();
          
          Swal.fire({
            position: "bottom-end",
            icon: "success",
            title: "Categoría creada correctamente",
            showConfirmButton: false,
            timer: 1000,
            width: "20em"
          });
        }
      }

      handleCerrarModal();

    } catch (error) {
      Swal.fire({
        position: "bottom-end",
        icon: "error",
        title: "Error al procesar la categoría",
        showConfirmButton: false,
        timer: 1000,
        width: "20em"
      });
      console.error("Error general crear/editar rubro", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-40">
      <div className="rounded-3xl p-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary w-1/2">
        <button onClick={handleCerrarModal} className="absolute top-4 right-4 text-gray-500 hover:text-red-600" >
          <FaTimes className="text-secondary h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-secondary">
          {editando ? "Editar Categoría" : "Nueva Categoría"}
        </h2>
        <form onSubmit={crearRubro}>
          <div className="mb-4">
            <label className="block mb-2">Nombre</label>
            <input type="text" placeholder='Nombre de la categoria' className="w-full p-2 border rounded bg-white" value={nombreRubro} onChange={(e) => setNombreRubro(e.target.value)} required />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Tipo</label>
            <div className="flex gap-4">
              <label>
                <input type="radio" name="tipo" value="Insumo" checked={tipoRubro === "Insumo"} onChange={() => setTipoRubro("Insumo")} disabled={editando} />
                <span className="ml-2">Insumo</span>
              </label>
              <label>
                <input type="radio" name="tipo" value="Producto" checked={tipoRubro === "Producto"} onChange={() => setTipoRubro("Producto")} disabled={editando} />
                <span className="ml-2">Producto</span>
              </label>
            </div>
          </div>

          {tipoRubro === "Insumo" && (
            <div className="mb-4">
              <label className="block mb-2">Rubro Padre (Opcional)</label>
              <select className="w-full p-2 border rounded bg-white" onChange={(e) => setRubroPadreSeleccionado(e.target.value)} value={rubroPadreSeleccionado} disabled={editando && rubroEditando?.tipo === "Insumo" && (rubroEditando as RubroInsumo).subRubros.length > 0} >
                <option value="">Ninguno</option>
                {obtenerTodosRubrosUnicosAnidados(rubrosInsumos)
                  .filter(({rubro}) => rubro.activo) // <-- Solo activos
                  .filter(({rubro}) => !editando || rubro.id !== rubroEditando?.id)
                  .map(({rubro, depth}) => (
                    <option key={rubro.id} value={rubro.id}>
                      {"— ".repeat(depth)} {rubro.denominacion}
                    </option>
                  ))}
              </select>
              {editando && rubroEditando?.tipo === "Insumo" && (rubroEditando as RubroInsumo).subRubros.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">No puedes cambiar el padre si el rubro tiene subrubros.</p>
              )}
            </div>
          )}

          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={handleCerrarModal} className="px-4 py-2 text-gray-600 hover:text-gray-800"> Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-tertiary text-white rounded hover:bg-secondary transition-colors"> {editando ? "Guardar Cambios" : "Crear"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoriaModal;