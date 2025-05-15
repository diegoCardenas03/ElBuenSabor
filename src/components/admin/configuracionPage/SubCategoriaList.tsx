import { FaPen, FaTimes, FaCheck } from 'react-icons/fa';

interface SubCategoriaListProps {
  subcategorias: string[];
  categoriaId: number;
  editandoSubcategoria: {
    categoriaId: number;
    index: number;
  } | null;
  subcategoriaEditada: string;
  setEditandoSubcategoria: (value: {
    categoriaId: number;
    index: number;
  } | null) => void;
  setSubcategoriaEditada: (value: string) => void;
  editarSubcategoria: (categoriaId: number, index: number) => void;
  eliminarSubcategoria: (categoriaId: number, index: number) => void;
}

export const SubCategoriaList = ({
  subcategorias,
  categoriaId,
  editandoSubcategoria,
  subcategoriaEditada,
  setEditandoSubcategoria,
  setSubcategoriaEditada,
  editarSubcategoria,
  eliminarSubcategoria,
}: SubCategoriaListProps) => {
  if (subcategorias.length === 0) {
    return <p className="text-gray-500 italic">No hay subcategorías aún</p>;
  }

  return (
    <ul className="space-y-2">
      {subcategorias.map((subcategoria, index) => (
        <li key={`${categoriaId}-${index}`} className="flex justify-between items-center py-1 border-b border-gray-100">
          {editandoSubcategoria?.categoriaId === categoriaId &&
          editandoSubcategoria?.index === index ? (
            <div className="flex items-center gap-2 w-full">
              <input type="text" value={subcategoriaEditada} onChange={(e) => setSubcategoriaEditada(e.target.value)} className="border border-gray-300 px-2 py-1 rounded-md bg-white text-black text-sm flex-grow" autoFocus/>
              <button onClick={() => editarSubcategoria(categoriaId, index)} className="text-green-500 hover:text-green-700 transition-colors"title="Confirmar"><FaCheck size={12} /></button>
              <button
                onClick={() => {
                  setEditandoSubcategoria(null);
                  setSubcategoriaEditada('');
                }}
                className="text-red-500 hover:text-red-700 transition-colors" title="Cancelar"><FaTimes size={12} />
              </button>
            </div>
          ) : (
            <>
              <span className="flex-grow">- {subcategoria}</span>
              <div className="flex gap-2">
                <FaPen size={14} onClick={() => {
                    setEditandoSubcategoria({
                      categoriaId,
                      index,
                    });
                    setSubcategoriaEditada(subcategoria); }} className="cursor-pointer hover:text-secondary transition-colors" title="Editar subcategoría" />
                <FaTimes size={14} onClick={() => eliminarSubcategoria(categoriaId, index)} className="cursor-pointer hover:text-red-500 transition-colors" title="Eliminar subcategoría" />
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
};