import { FaTimes } from 'react-icons/fa';

interface AgregarCategoriaProps {
  isOpen: boolean;
  onClose: () => void;
  nuevaCategoria: string;
  setNuevaCategoria: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const AgregarCategoria = ({
  isOpen,
  onClose,
  nuevaCategoria,
  setNuevaCategoria,
  onSubmit,
}: AgregarCategoriaProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-primary text-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 relative border border-secondary z-50">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-3xl font-bold mb-4 text-secondary">Agregar nueva categoría</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><FaTimes size={20} /></button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="font-medium block mb-2 text-black">Nombre:</label>
            <input type="text" value={nuevaCategoria} onChange={(e) => setNuevaCategoria(e.target.value)} placeholder="Ingrese el nombre de la categoría" className="border border-gray-300 font-medium w-full px-3 py-2 rounded-xl bg-white text-black placeholder:text-black focus:outline-none focus:ring-2 focus:ring-secondary" required autoFocus />
          </div>
          <div className="flex justify-around gap-4 pt-4">
            <button type="button" onClick={onClose} className="font-bold transition duration-150 ease-in-out hover:scale-110 cursor-pointer underline decoration-solid px-4 py-2 text-black" > Cancelar </button>
            <button type="submit" className="font-medium transition duration-150 ease-in-out hover:scale-110 cursor-pointer px-9 py-2 bg-tertiary text-white rounded-2xl" > Crear </button>
          </div>
        </form>
      </div>
    </div>
  );
};