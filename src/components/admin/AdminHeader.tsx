import { useEffect, useState } from "react";
import { FaArrowLeft, FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Rol } from "../../types/enums/Rol";
import { UsuarioResponseDTO } from "../../types/Usuario/UsuarioResponseDTO";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import Swal from "sweetalert2";
import { clearSession } from "../../hooks/useAuthHandler";

interface AdminHeaderProps {
  showBackButton?: boolean;
  text?: string;
  nombreUsuario?: string;
  rol?: Rol;
  onBackClick?: () => void;
}



export const AdminHeader: React.FC<AdminHeaderProps> = ({
  showBackButton = false,
  text = "Configuración",
  onBackClick,
  nombreUsuario = sessionStorage.getItem('user_name')
}) => {
  const [navbarOpen, setNavbarOpen] = useState<boolean>(false);

  const [roles, setRoles] = useState<string[] | null>([]);

  const { logout } = useAuth0();

  const userData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_SERVER_URL}/api/usuarios/me`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
        },
      });
      return response.data as UsuarioResponseDTO;
    } catch (error) {
      Swal.fire({
        title: "¡Error!",
        text: "Su identidad no ha podido validarse.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      clearSession();
      logout({
        logoutParams: {
          returnTo: window.location.origin
        }
      });
    }
  }



  useEffect(() => {
    const fetchUserData = async () => {
      const data = await userData();
      if (data) {
        setRoles(data.roles.map((rol) => rol.nombre));
      };
    };
    fetchUserData();
  }, []);


  // Menú por rol de usuario (usando string)
  const menuPorRol: Record<string, { path: string; label: string }[]> = {

    SuperAdmin: [
      { path: '/admin/MiPerfil', label: 'Mi Perfil' },
      { path: '/admin/insumos', label: 'Insumos' },
      { path: '/admin/productos', label: 'Productos' },
      { path: '/admin/empleados', label: 'Empleados' },
      { path: '/admin/clientes', label: 'Clientes' },
      { path: '/admin/estadistica', label: 'Estadísticas' },
      { path: '/admin/configuracion', label: 'Configuración' },
      { path: '/admin/delivery', label: 'Delivery' },
      { path: '/admin/promociones', label: 'Promociones' },
      { path: '/admin/pantallaCajero', label: 'Cajero' },
      { path: '/admin/pedidosCocinero', label: 'Pedidos' },
    ]
    ,
    Admin: [
      { path: '/admin/MiPerfil', label: 'Mi Perfil' },
      { path: '/admin/insumos', label: 'Insumos' },
      { path: '/admin/productos', label: 'Productos' },
      { path: '/admin/empleados', label: 'Empleados' },
      { path: '/admin/clientes', label: 'Clientes' },
      { path: '/admin/estadistica', label: 'Estadísticas' },
      { path: '/admin/configuracion', label: 'Configuración' },
      { path: '/admin/delivery', label: 'Delivery' },
      { path: '/admin/promociones', label: 'Promociones' },
      { path: '/admin/pantallaCajero', label: 'Cajero' },
      { path: '/admin/pedidosCocinero', label: 'Pedidos' },

    ],
    Cocinero: [
      { path: '/admin/MiPerfil', label: 'Mi Perfil' },
      { path: '/admin/insumos', label: 'Insumos' },
      { path: '/admin/productos', label: 'Productos' },
      { path: '/admin/pedidosCocinero', label: 'Pedidos' },
      { path: '/admin/promociones', label: 'Promociones' }
    ],
    Cajero: [
      { path: '/admin/MiPerfil', label: 'Mi Perfil' },
      { path: '/admin/pedidosCocinero', label: 'Pedidos' },
      { path: '/admin/pantallaCajero', label: 'Cajero' }
    ],
    Delivery: [
      { path: '/admin/MiPerfil', label: 'Mi Perfil' },
      { path: '/admin/delivery', label: 'Entregas' }
    ]
  };

  // Mapeo de nombres amigables para los roles
  // const nombreRol: Record<Rol, string> = {
  //   [Rol.ADMIN]: 'Administrador',
  //   [Rol.COCINERO]: 'Cocinero',
  //   [Rol.DELIVERY]: 'Delivery',
  //   [Rol.CAJERO]: 'Cajero',
  //   [Rol.CLIENTE]: 'Cliente'
  // };

  // // Menú por rol de usuario
  // const menuPorRol: Record<string, { path: string; label: string }[]> = {
  //   [Rol.ADMIN]: [
  //     { path: '/admin/MiPerfil', label: 'Mi Perfil' },
  //     { path: '/admin/insumos', label: 'Insumos' },
  //     { path: '/admin/productos', label: 'Productos' },
  //     { path: '/admin/empleados', label: 'Empleados' },
  //     { path: '/admin/clientes', label: 'Clientes' },
  //     { path: '/admin/estadistica', label: 'Estadísticas' },
  //     { path: '/admin/configuracion', label: 'Configuración' },
  //     { path: '/admin/delivery', label: 'Delivery' },
  //   ],
  //   [Rol.COCINERO]: [
  //     { path: '/admin/perfil', label: 'Mi Perfil' },
  //     { path: '/admin/insumos', label: 'Insumos' },
  //     { path: '/admin/productos', label: 'Productos' },
  //     { path: '/admin/comandas', label: 'Comandas' }
  //   ],
  //   [Rol.CAJERO]: [
  //     { path: '/admin/perfil', label: 'Mi Perfil' },
  //     { path: '/admin/pedidos', label: 'Pedidos' }
  //   ],
  //   [Rol.DELIVERY]: [
  //     { path: '/admin/perfil', label: 'Mi Perfil' },
  //     { path: '/admin/entregas', label: 'Entregas' }
  //   ],
  //   [Rol.CLIENTE]: []


  // };


  const toggleNavbar = () => {
    setNavbarOpen(prev => !prev);
  };

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };

  const sessionPicture = sessionStorage.getItem('user_picture');


  return (
    <>
      {/* Navbar lateral */}
      {navbarOpen && (
        <div className="fixed inset-0 z-40">
          <div className="absolute left-0 top-0 h-full w-64 bg-secondary shadow-lg flex flex-col">
            <div className="p-4 flex justify-end">
              <FaTimes className="w-6 h-6 text-white cursor-pointer" onClick={toggleNavbar} />
            </div>

            <div className="px-6 flex flex-col items-center gap-3">
              <img src={sessionPicture!} alt="Usuario" className="w-16 h-16 rounded-full border-2 border-white object-cover" />
              <div className="text-center">
                <p className="font-medium text-white">{nombreUsuario}</p>
                <p className="text-sm text-gray-300 mt-1">{roles}</p>
              </div>
            </div>

            <hr className="border-white/20 my-4 mx-6" />

            {/* Menú de navegación */}
            <nav className="flex-1 overflow-y-auto px-4">
              <div className="space-y-2">
                {roles && roles.length > 0 && (
                  // Usamos un Set para evitar duplicados
                  Array.from(
                    new Map(
                      roles
                        .flatMap((rol) => menuPorRol[rol] || [])
                        .map((item) => [item.path, item])
                    ).values()
                  ).map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="block w-full px-4 py-3 text-white text-center hover:bg-white/10 rounded-lg transition-colors duration-200"
                      onClick={toggleNavbar}
                    >
                      {item.label}
                    </Link>
                  ))
                )}
              </div>
            </nav>

            <div className="p-4 border-t border-white/10">
              <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full px-4 py-2 text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer"><FaSignOutAlt /><span>Cerrar sesión</span></button>
            </div>
          </div>
        </div>
      )}

      {/* Header principal */}
      <div className="h-20 px-7 flex items-center justify-between bg-secondary p-4 shadow-md relative z-30">
        <div className="flex items-center gap-4">
          {showBackButton ? (
            <div className="flex items-center space-x-2 cursor-pointer" onClick={onBackClick}>
              <Link to="/" className="flex items-center space-x-2">
                <div className="bg-orange-400 rounded-full p-1.5">
                  <FaArrowLeft className="text-secondary" />
                </div>
                <span className="font-tertiary text-white text-base">VOLVER</span>
              </Link>
            </div>
          ) : (
            <FaBars className="w-6 h-6 text-tertiary cursor-pointer" onClick={toggleNavbar} />
          )}
        </div>

        <h2 className="font-tertiary text-tertiary text-2xl mx-auto">{text}</h2>

        <div className="w-6"></div>
      </div>
    </>
  );
};