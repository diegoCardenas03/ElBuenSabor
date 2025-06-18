import React, { useState, useEffect } from "react";

interface PermisosModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { nombre: string; permisos: string[]; oculto: boolean }) => void;
  initialPermisos?: string[];
  rolName?: string;
  initialOculto?: boolean;
}

const PermisosModal: React.FC<PermisosModalProps> = ({
  open,
  onClose,
  onSave,
  initialPermisos = [],
  rolName = "",
  initialOculto = false
}) => {
  const [permisos, setPermisos] = useState<string[]>(initialPermisos);
  const [nuevoPermiso, setNuevoPermiso] = useState("");
  const [nombre, setNombre] = useState(rolName ?? "");
  const [oculto, setOculto] = useState(initialOculto);
  const [nombreError, setNombreError] = useState(false);

  useEffect(() => {
    setPermisos(initialPermisos);
    setNombre(rolName ?? "");
    setOculto(initialOculto);
    setNombreError(false);
  }, [initialPermisos, rolName, initialOculto, open]);

  if (!open) return null;

  const handleAddPermiso = () => {
    if (nuevoPermiso.trim() && !permisos.includes(nuevoPermiso.trim())) {
      setPermisos([...permisos, nuevoPermiso.trim()]);
      setNuevoPermiso("");
    }
  };

  const handleRemovePermiso = (permiso: string) => {
    setPermisos(permisos.filter(p => p !== permiso));
  };

  const handleSave = () => {
    if (!nombre.trim()) {
      setNombreError(true);
      return;
    }
    onSave({ nombre, permisos, oculto });
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
          <label className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              checked={oculto}
              onChange={e => setOculto(e.target.checked)}
            />
            Ocultar este rol
          </label>
          <div>
            <label className="block font-semibold mb-1">Permisos</label>
            <ul className="mb-2">
              {permisos.map((permiso, idx) => (
                <li key={idx} className="flex items-center justify-between mb-1">
                  <span>{permiso}</span>
                  <button
                    onClick={() => handleRemovePermiso(permiso)}
                    className="text-secondary hover:text-secondary px-2 py-1"
                  >
                    Quitar
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <input
                type="text"
                className="border rounded px-2 py-1 w-full"
                value={nuevoPermiso}
                placeholder="Agregar permiso"
                onChange={e => setNuevoPermiso(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddPermiso();
                  }
                }}
              />
              <button
                className="bg-secondary text-white rounded px-4 py-1 font-bold"
                onClick={handleAddPermiso}
                type="button"
              >
                +
              </button>
            </div>
          </div>
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