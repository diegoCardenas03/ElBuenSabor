import { FaTimes } from 'react-icons/fa';

interface EliminarCategoriaProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const EliminarCategoria = ({
  isOpen,
  onClose,
  onConfirm,
}: EliminarCategoriaProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-primary text-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 relative border border-secondary z-50">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-3xl font-bold mb-4 text-secondary"> Confirmar eliminación</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700"> <FaTimes size={20} /></button>
        </div>
        <p className="mb-6 text-black">¿Estás seguro que deseas eliminar esta categoría y todas sus subcategorías?</p>
        <div className="flex justify-around gap-4 pt-4">
          <button onClick={onClose} className="font-bold transition duration-150 ease-in-out hover:scale-110 cursor-pointer underline decoration-solid px-4 py-2 text-black">Cancelar</button>
          <button onClick={onConfirm} className="font-medium transition duration-150 ease-in-out hover:scale-110 cursor-pointer px-9 py-2 bg-red-500 text-white rounded-2xl">Eliminar</button>
        </div>
      </div>
    </div>
  );
};