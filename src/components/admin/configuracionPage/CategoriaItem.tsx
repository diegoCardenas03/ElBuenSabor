import { FaPen, FaTrash, FaChevronUp, FaCheck, FaTimes, FaPlus } from 'react-icons/fa';

interface CategoriaItemProps {
  categoria: {
    id: number;
    nombre: string;
    subcategorias: string[];
    mostrarSubcategorias?: boolean;
  };
  editandoCategoria: number | null;
  nombreEditado: string;
  subcategoriasVisibles: Record<number, boolean>;
  setEditandoCategoria: (id: number | null) => void;
  setNombreEditado: (nombre: string) => void;
  setMostrarConfirmacionEliminar: (id: number | null) => void;
  setCategoriaSeleccionada: (id: number) => void;
  setMostrarModalSubcategoria: (show: boolean) => void;
  editarCategoria: (id: number) => void;
  toggleSubcategorias: (id: number) => void;
  children: React.ReactNode;
}

export const CategoriaItem = ({
  categoria,
  editandoCategoria,
  nombreEditado,
  subcategoriasVisibles,
  setEditandoCategoria,
  setNombreEditado,
  setMostrarConfirmacionEliminar,
  setCategoriaSeleccionada,
  setMostrarModalSubcategoria,
  editarCategoria,
  toggleSubcategorias,
  children
}: CategoriaItemProps) => {
  return (
    <div className="mb-6 bg-white rounded-lg p-4 shadow-sm">
      {/* Encabezado de categoría */}
      <article className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          {editandoCategoria === categoria.id ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={nombreEditado}
                onChange={(e) => setNombreEditado(e.target.value)}
                className="border border-gray-300 px-3 py-1 rounded-md bg-white text-black"
                autoFocus
              />
              <button
                onClick={() => editarCategoria(categoria.id)}
                className="text-green-500 hover:text-green-700 transition-colors"
                title="Confirmar"
              >
                <FaCheck />
              </button>
              <button
                onClick={() => {
                  setEditandoCategoria(null);
                  setNombreEditado('');
                }}
                className="text-red-500 hover:text-red-700 transition-colors"
                title="Cancelar"
              >
                <FaTimes />
              </button>
            </div>
          ) : (
            <h4 className="font-bold underline decoration-solid">
              {categoria.nombre}
            </h4>
          )}
        </div>
        <div className="flex gap-4">
          <FaPen
            size={17}
            onClick={() => {
              setEditandoCategoria(categoria.id);
              setNombreEditado(categoria.nombre);
            }}
            className="cursor-pointer hover:text-secondary transition-colors"
            title="Editar categoría"
          />
          <FaTrash
            size={17}
            onClick={() => setMostrarConfirmacionEliminar(categoria.id)}
            className="cursor-pointer hover:text-red-500 transition-colors"
            title="Eliminar categoría"
          />
          <FaChevronUp
            size={17}
            className={`cursor-pointer transition-transform ${
              subcategoriasVisibles[categoria.id] ? 'rotate-180' : ''
            }`}
            onClick={() => toggleSubcategorias(categoria.id)}
            title={
              subcategoriasVisibles[categoria.id]
                ? "Ocultar subcategorías"
                : "Mostrar subcategorías"
            }
          />
        </div>
      </article>

      {/* Contenido de subcategorías */}
      {(subcategoriasVisibles[categoria.id] || categoria.mostrarSubcategorias) && (
        <div className="mt-4 pl-6">
          {children}

          {/* Botón agregar subcategoría */}
          <button
            onClick={() => {
              setCategoriaSeleccionada(categoria.id);
              setMostrarModalSubcategoria(true);
            }}
            className="mt-3 text-secondary font-semibold hover:underline flex items-center gap-1"
          >
            <FaPlus size={12} />
            Agregar subcategoria
          </button>
        </div>
      )}
    </div>
  );
};