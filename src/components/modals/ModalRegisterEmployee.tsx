import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';
import { interceptorApiClient } from '../../interceptors/Axios.interceptor';
import Swal from 'sweetalert2';

interface Role {
  id: number;
  name: string;
  auth0RoleId: string;
}

interface ModalRegisterEmployeeProps {
  onClose: () => void;
  onSuccess?: () => void;
}

type FormData = {
  nombre: string;
  email: string;
  telefono: string;
  calle: string;
  numero: string;
  localidad: string;
  codigoPostal: string;
  password: string;
  rol: string;
};

export const ModalRegisterEmployee: React.FC<ModalRegisterEmployeeProps> = ({ 
  onClose, 
  onSuccess 
}) => {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    email: '',
    telefono: '',
    calle: '',
    numero: '',
    localidad: '',
    codigoPostal: '',
    password: '',
    rol: ''
  });

  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [verContrasenia, setVerContrasenia] = useState<boolean>(false);

  // Cargar roles al montar el componente
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await interceptorApiClient.get<Role[]>('/api/admin/roles');
        // Filtrar roles que no sean "Cliente" para empleados
        const employeeRoles = response.data.filter(role => role.name !== 'Cliente');
        setRoles(employeeRoles);
      } catch (error) {
        console.error('Error cargando roles:', error);
        Swal.fire('Error', 'No se pudieron cargar los roles', 'error');
      }
    };

    fetchRoles();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const verPassword = (): void => {
    setVerContrasenia(!verContrasenia);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        email: formData.email,
        name: formData.nombre,
        nickName: formData.nombre,
        password: formData.password,
        connection: "Username-Password-Authentication",
        roles: [formData.rol],
        // Datos adicionales que tu backend pueda necesitar
        telefono: formData.telefono,
        direccion: {
          calle: formData.calle,
          numero: formData.numero,
          localidad: formData.localidad,
          codigoPostal: formData.codigoPostal
        }
      };

      await interceptorApiClient.post('/api/admin/users/createUser', payload);
      
      Swal.fire({
        icon: 'success',
        title: '¡Empleado creado!',
        text: 'El empleado ha sido registrado exitosamente',
        timer: 2000,
        showConfirmButton: false
      });

      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error('Error creando empleado:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error?.response?.data?.message || 'Ocurrió un error al crear el empleado'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="relative bg-secondary rounded-lg p-6 w-full max-w-sm mx-4 max-h-[90vh] overflow-y-auto font-primary">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-xl font-bold">Nuevo empleado</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 text-xl font-bold"
          >
            <FaTimes />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-white text-sm font-medium mb-1">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Ingrese el nombre completo"
              className="w-full px-3 py-2 rounded-md border-0 outline-none text-gray-800 placeholder-gray-500 bg-white"
              required
            />
          </div>

          {/* Dirección - Calle y Número */}
          <div>
            <label className="block text-white text-sm font-medium mb-1">
              Dirección
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                name="calle"
                value={formData.calle}
                onChange={handleInputChange}
                placeholder="Calle"
                className="px-3 py-2 rounded-md border-0 outline-none text-gray-800 placeholder-gray-500 bg-white"
                required
              />
              <input
                type="text"
                name="numero"
                value={formData.numero}
                onChange={handleInputChange}
                placeholder="Número"
                className="px-3 py-2 rounded-md border-0 outline-none text-gray-800 placeholder-gray-500 bg-white"
                required
              />
            </div>
          </div>

          {/* Localidad y Código Postal */}
          <div>
            <label className="block text-white text-sm font-medium mb-1">
              Localidad
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                name="localidad"
                value={formData.localidad}
                onChange={handleInputChange}
                placeholder="Localidad"
                className="px-3 py-2 rounded-md border-0 outline-none text-gray-800 placeholder-gray-500 bg-white"
                required
              />
              <input
                type="text"
                name="codigoPostal"
                value={formData.codigoPostal}
                onChange={handleInputChange}
                placeholder="Código postal"
                className="px-3 py-2 rounded-md border-0 outline-none text-gray-800 placeholder-gray-500 bg-white"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-white text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Ingrese el email"
              className="w-full px-3 py-2 rounded-md border-0 outline-none text-gray-800 placeholder-gray-500 bg-white"
              required
            />
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-white text-sm font-medium mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              placeholder="Ingrese el teléfono"
              className="w-full px-3 py-2 rounded-md border-0 outline-none text-gray-800 placeholder-gray-500 bg-white"
              required
            />
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-white text-sm font-medium mb-1">
              Contraseña Provisoria
            </label>
            <div className="relative">
              <input
                type={verContrasenia ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Ingrese la contraseña"
                className="w-full px-3 py-2 rounded-md border-0 outline-none text-gray-800 placeholder-gray-500 pr-10 bg-white"
                required
              />
              <div className='absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer'>
                {verContrasenia ? (
                  <FaEye className="text-gray-600" onClick={verPassword} />
                ) : (
                  <FaEyeSlash className='text-gray-600' onClick={verPassword} />
                )}
              </div>
            </div>
          </div>

          {/* Rol */}
          <div>
            <label className="block text-white text-sm font-medium mb-1">
              Rol
            </label>
            <select
              name="rol"
              value={formData.rol}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-md border-0 outline-none text-gray-800 bg-white"
              required
            >
              <option  value="">Seleccione un rol</option>
              {roles.map((role) => (
                <option key={role.id} value={role.auth0RoleId}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-3xl transition-colors font-medium cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-tertiary hover:bg-orange-600 text-white py-2 px-4 rounded-3xl transition-colors font-medium disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};