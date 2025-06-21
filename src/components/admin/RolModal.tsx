import { useState, useEffect } from "react";

interface PermisosModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    nombre: string;
    descripcion: string;
  }) => void;
  rolName?: string;
  initialDescripcion?: string;
}

const PermisosModal: React.FC<PermisosModalProps> = ({
  open,
  onClose,
  onSave,
  rolName = "",
  initialDescripcion = ""
}) => {
  const [nombre, setNombre] = useState(rolName ?? "");
  const [descripcion, setDescripcion] = useState(initialDescripcion ?? "");
  const [nombreError, setNombreError] = useState(false);

  useEffect(() => {
    setNombre(rolName ?? "");
    setDescripcion(initialDescripcion ?? "");
    setNombreError(false);
  }, [rolName, initialDescripcion, open]);

  if (!open) return null;

  const handleSave = () => {
    if (!nombre.trim()) {
      setNombreError(true);
      return;
    }
    onSave({ nombre, descripcion });
    onClose();
  };

  return (
    <div className="fixed z-50 inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-secondary text-2xl"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4">
          {rolName ? `Editar rol` : "Nuevo rol"}
        </h2>
        <div className="mb-4">
          <label className="block text-base font-semibold mb-2" htmlFor="nombreRol">
            Nombre del rol
          </label>
          <input
            id="nombreRol"
            type="text"
            value={nombre}
            onChange={e => {
              setNombre(e.target.value);
              if (e.target.value.trim()) setNombreError(false);
            }}
            className={`border rounded px-2 py-1 w-full mb-2 ${nombreError ? 'border-red-500' : ''}`}
            placeholder="Nombre del rol"
          />
          {nombreError && (
            <span className="text-red-600 text-sm mb-2 block">
              El nombre no puede estar vacío.
            </span>
          )}

          <label className="block text-base font-semibold mb-2" htmlFor="descripcionRol">
            Descripción
          </label>
          <input
            id="descripcionRol"
            type="text"
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            className="border rounded px-2 py-1 w-full mb-2"
            placeholder="Descripción del rol"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 rounded bg-secondary text-white hover:bg-[#bd1e23ce]"
            onClick={handleSave}
            disabled={!nombre.trim()}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermisosModal;