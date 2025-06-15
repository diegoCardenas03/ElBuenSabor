import { useState } from "react";
import { FaSearch, FaPen, FaChevronDown, FaChevronUp, FaEyeSlash } from "react-icons/fa";
import PermisosModal from "./RolModal";

// Datos mock con permisos y oculto
const mockRoles = [
  {
    id: 1,
    name: "Cocinero",
    permisos: ["Insumos", "Productos", "Pedidos"],
    oculto: false,
  },
  {
    id: 2,
    name: "Cajero",
    permisos: [],
    oculto: false,
  },
  {
    id: 3,
    name: "Delivery",
    permisos: [],
    oculto: false,
  },
  {
    id: 4,
    name: "Cliente",
    permisos: [],
    oculto: false,
  },
  {
    id: 5,
    name: "Administrador",
    permisos: [],
    oculto: false,
  }
];

const Roles = () => {
  const [busqueda, setBusqueda] = useState<string>("");
  const [roles, setRoles] = useState(mockRoles);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);
  const [expandedRole, setExpandedRole] = useState<number | null>(null);

  // Modal state
  const [modalAbierto, setModalAbierto] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [rolSeleccionado, setRolSeleccionado] = useState<any>(null);

  // Filtrado por búsqueda
  const filteredRoles = roles.filter(rol =>
    rol.name.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Ordenar: visibles primero, ocultos después
  const orderedRoles = [
    ...filteredRoles.filter(rol => !rol.oculto),
    ...filteredRoles.filter(rol => rol.oculto),
  ];

  // Abrir modal para editar/agregar permisos
  const handleAbrirModal = (rol?: typeof mockRoles[0]) => {
    if (rol) {
      setIsEditing(true);
      setRolSeleccionado(rol);
    } else {
      setIsEditing(false);
      setRolSeleccionado({
        id: Date.now(),
        name: "",
        permisos: [],
        oculto: false
      });
    }
    setModalAbierto(true);
  };

  // Guardar permisos y/o cambios del rol
  const handleGuardarRol = (data: { nombre: string; permisos: string[]; oculto: boolean }) => {
    if (isEditing && rolSeleccionado) {
      setRoles(prevRoles =>
        prevRoles.map(rol =>
          rol.id === rolSeleccionado.id
            ? { ...rol, name: data.nombre, permisos: data.permisos, oculto: data.oculto }
            : rol
        )
      );
    } else {
      setRoles(prevRoles => [
        ...prevRoles,
        {
          id: Date.now(),
          name: data.nombre,
          permisos: data.permisos,
          oculto: data.oculto
        }
      ]);
    }
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen py-10">
      {/* Buscador y botón */}
      <div className="flex justify-between items-center w-4/5 mb-5">
        <form className='flex items-center relative w-1/2'>
          <input
            type="search"
            placeholder='Buscar rol'
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className='bg-white py-2 pl-3 pr-10 border rounded-2xl focus:outline-[#BD1E22] w-full shadow'
          />
          <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </form>
        <button
          className='bg-[#BD1E22] text-white py-2 rounded-2xl cursor-pointer px-10 shadow-md ml-4'
          onClick={() => handleAbrirModal()}
          type="button"
        >
          + Agregar rol
        </button>
      </div>

      {/* Tabla de roles */}
      <div className="w-4/5">
        <div
          className="bg-white h-12 pl-8 flex items-center rounded-t-2xl font-semibold text-lg drop-shadow-[0_2px_3px_rgba(0,0,0,0.07)] mb-1"
          style={{
            boxShadow: "0 2px 3px -2px rgba(0,0,0,0.07)"
          }}
        >
          Rol
        </div>

        <ul className="flex flex-col gap-0">
          {loading && <p>Cargando Roles...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && orderedRoles.length === 0 && (
            <p className="text-red-500 p-4 bg-white rounded-b-2xl shadow">No hay ningún rol creado...</p>
          )}
          {!loading && !error && orderedRoles.map((rol) => (
            <li
              key={rol.id}
              className={`
                bg-white px-8
                ${expandedRole === rol.id ? 'rounded-b-2xl' : ''}
                flex flex-col
                border-b border-gray-300
                shadow-sm
                relative
                transition-all
                duration-200
                group
                ${rol.oculto ? "opacity-40" : ""}
              `}
              style={{
                boxShadow: "0 3px 6px -4px rgba(0,0,0,0.09)"
              }}
            >
              <div className="flex items-center justify-between min-h-[56px]">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-lg font-semibold cursor-pointer py-4 ${expandedRole === rol.id ? "text-[#BD1E22]" : ""}`}
                    onClick={() => setExpandedRole(expandedRole === rol.id ? null : rol.id)}
                  >
                    {rol.name}
                  </span>
                  {rol.oculto && <FaEyeSlash className="ml-2 text-gray-400" title="Oculto" />}
                </div>
                <div className="flex items-center gap-5">
                  <button
                    className="p-1 text-[#BD1E22] hover:bg-gray-100 rounded-full"
                    onClick={() => handleAbrirModal(rol)}
                  >
                    <FaPen size={18} />
                  </button>
                  <button
                    className="p-1 hover:bg-gray-100 rounded-full"
                    onClick={() => setExpandedRole(expandedRole === rol.id ? null : rol.id)}
                  >
                    {expandedRole === rol.id ? <FaChevronUp size={18} /> : <FaChevronDown size={18} />}
                  </button>
                </div>
              </div>
              {/* Permisos */}
              {expandedRole === rol.id && (
                <div className="mt-2 mb-4 ml-2">
                  {rol.permisos.length === 0 ? (
                    <span className="text-gray-500 text-base ml-4">Sin permisos asignados</span>
                  ) : (
                    <ul className="ml-4 mb-2">
                      {rol.permisos.map((permiso, idx) => (
                        <li key={idx} className="text-base text-black">- {permiso}</li>
                      ))}
                    </ul>
                  )}
                  <button
                    className="text-[#BD1E22] text-sm ml-4 font-bold hover:underline"
                    onClick={() => handleAbrirModal(rol)}
                  >
                    + Agregar permiso
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      <PermisosModal
        open={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onSave={handleGuardarRol}
        initialPermisos={rolSeleccionado?.permisos}
        rolName={rolSeleccionado?.name}
        initialOculto={rolSeleccionado?.oculto}
      />
    </div>
  );
};

export default Roles;