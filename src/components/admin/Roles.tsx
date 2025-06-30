import { useEffect, useState } from "react";
import { FaSearch, FaPen, FaChevronDown, FaChevronUp, FaEyeSlash, FaTrash } from "react-icons/fa";
import PermisosModal from "./RolModal";
import { RolService } from "../../services/RolService";
import { RolResponseDTO } from "../../types/Rol/RolResponseDTO";
import Swal from "sweetalert2";

const Roles = () => {
  const [busqueda, setBusqueda] = useState<string>("");
  const [roles, setRoles] = useState<RolResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedRole, setExpandedRole] = useState<number | null>(null);
  const [reloadRoles, setReloadRoles] = useState(0);

  // Guardar cambios del rol
  const handleGuardarRol = async (data: { nombre: string; descripcion: string }) => {
    const rolesService = new RolService();
    if (isEditing && rolSeleccionado) {
      try {
        // Llama al servicio para actualizar el rol por auth0RolId
        await rolesService.putByAuth0Id(rolSeleccionado.auth0RolId, {
          nombre: data.nombre,
          descripcion: data.descripcion,
        });
        Swal.fire("¡Éxito!", "Rol actualizado correctamente.", "success");
        setReloadRoles(prev => prev + 1);
      } catch (error) {
        setError('[Roles.tsx] Error al editar rol');
        Swal.fire("Error", "No se pudo editar el rol.", "error");
      }
    } else {
      // Crear nuevo rol (no enviar id, el backend lo genera)
      try {
        const nuevoRol = await rolesService.post({
          nombre: data.nombre,
          descripcion: data.descripcion,
        });
        Swal.fire({
          title: "¡Éxito!",
          text: "Rol creado correctamente!.",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
        setRoles(prevRoles => [...prevRoles, nuevoRol]);
        setReloadRoles(prev => prev + 1);
      } catch (error) {
        setError('[Roles.tsx] Error al crear rol');
        // console.log('[Roles.tsx] Error al crear rol:', error);
      }
    }
  };

  useEffect(() => {
    const getRoles = async () => {
      try {
        setLoading(true);
        const rolesService = new RolService();
        const rolesData = await rolesService.getAll();
        setRoles(rolesData);
        setError(null);
      } catch (error) {
        setError('[Roles.tsx] Ocurrió un error al traer roles');
        // console.log('[Roles.tsx] Ocurrió un error al traer roles: ', error);
      } finally {
        setLoading(false);
      }
    };

    getRoles();
  }, [reloadRoles]);

  // Modal state
  const [modalAbierto, setModalAbierto] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [rolSeleccionado, setRolSeleccionado] = useState<RolResponseDTO | null>(null);

  // Filtrado por búsqueda
  const filteredRoles = roles.filter(
    rol => rol.nombre && rol.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Ordenar: visibles primero, ocultos después (si tienes un campo oculto)
  const orderedRoles = [
    ...filteredRoles.filter((rol: any) => !rol.oculto),
    ...filteredRoles.filter((rol: any) => rol.oculto),
  ];

  // Abrir modal para editar/agregar rol
  const handleAbrirModal = (rol?: RolResponseDTO) => {
    if (rol) {
      setIsEditing(true);
      setRolSeleccionado(rol);
    } else {
      setIsEditing(false);
      setRolSeleccionado({
        id: 0, // No se enviará al backend, solo para evitar undefined
        nombre: "",
        descripcion: "",
        auth0RolId: "",
      });
    }
    setModalAbierto(true);
  };

  const handleEliminarRol = async (rol: RolResponseDTO) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar rol?",
      text: `¿Seguro que deseas eliminar el rol "${rol.nombre}"? Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      try {
        const rolesService = new RolService();
        await rolesService.deletePhysicalByAuth0Id(rol.auth0RolId);
        Swal.fire("Eliminado", "El rol fue eliminado correctamente.", "success");
        setReloadRoles(prev => prev + 1);
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar el rol.", "error");
        console.error("[Roles.tsx] Error al eliminar rol:", error);
      }
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
          className='bg-secondary text-white py-2 rounded-2xl cursor-pointer px-10 shadow-md ml-4'
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
          {!loading && !error && orderedRoles.map((rol: any) => (
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
                    className={`text-lg font-semibold cursor-pointer py-4 ${expandedRole === rol.id ? "text-secondary" : ""}`}
                    onClick={() => setExpandedRole(expandedRole === rol.id ? null : rol.id)}
                  >
                    {rol.nombre}
                  </span>
                  {rol.oculto && <FaEyeSlash className="ml-2 text-gray-400" title="Oculto" />}
                </div>
                <div className="flex items-center gap-5">
                  <button
                    className="p-1 hover:bg-gray-100 rounded-full cursor-pointer"
                    onClick={() => setExpandedRole(expandedRole === rol.id ? null : rol.id)}
                  >
                    {expandedRole === rol.id ? <FaChevronUp size={18} /> : <FaChevronDown size={18} />}
                  </button>
                  <button
                    className="p-1 text-secondary hover:bg-gray-100 rounded-full cursor-pointer"
                    onClick={() => handleAbrirModal(rol)}
                  >
                    <FaPen size={18} />
                  </button>
                  <button
                    className="p-1 text-red-500 hover:bg-red-100 rounded-full cursor-pointer"
                    onClick={() => handleEliminarRol(rol)}
                    title="Eliminar rol"
                  >
                    <FaTrash size={18} />
                  </button>
                </div>
              </div>
              {/* Puedes mostrar más info si lo deseas */}
              {expandedRole === rol.id && (
                <div className="mt-2 mb-4 ml-2">
                  <div className="ml-4 mb-2 text-gray-700">
                    <strong>Descripción:</strong> {rol.descripcion || "Sin descripción"}
                  </div>
                  <div className="ml-4 mb-2 text-gray-700">
                    <strong>Auth0 Rol ID:</strong> {rol.auth0RolId || "No asignado"}
                  </div>
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
        rolName={rolSeleccionado?.nombre}
        initialDescripcion={rolSeleccionado?.descripcion}
      />
    </div>
  );
};

export default Roles;