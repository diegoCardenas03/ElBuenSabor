import { useState } from "react";
import { FaArrowLeft, FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import usuarioImg from '../../assets/img/usuarioLogeado.jpg';

interface AdminHeaderProps {
  showBackButton?: boolean;
  text?: string;
  nombreUsuario?: string;
  rol?: rolUsuario;
  onBackClick?: () => void;
}

type rolUsuario = 'Delivery' | 'Cocinero' | 'Administrador' | 'Cajero';

// Menú por rol de usuario
const menuPorRol: Record<rolUsuario, { path: string; label: string }[]> = {
  Administrador: [
    { path: '/admin/perfil', label: 'Mi Perfil' },
    { path: '/admin/insumos', label: 'Insumos' },
    { path: '/admin/productos', label: 'Productos' },
    { path: '/admin/empleados', label: 'Empleados' },
    { path: '/admin/clientes', label: 'Clientes' },
    { path: '/admin/estadistica', label: 'Estadística' },
    { path: '/admin/configuracion', label: 'Configuración' },
  ],
  Cocinero: [
    { path: '/admin/perfil', label: 'Mi Perfil' },
    { path: '/admin/insumos', label: 'Insumos' },
    { path: '/admin/productos', label: 'Productos' },
    { path: '/admin/comandas', label: 'Comandas' }
  ],
  Cajero: [
    { path: '/admin/perfil', label: 'Mi Perfil' },
    { path: '/admin/pedidos', label: 'Pedidos' }
  ],
  Delivery: [
    { path: '/admin/perfil', label: 'Mi Perfil' },
    { path: '/admin/entregas', label: 'Entregas' }
  ]
};

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  showBackButton = false,
  text = "Configuración",
  onBackClick,
  nombreUsuario = "San Martín",
  rol = 'Administrador'
}) => {
  const [navbarOpen, setNavbarOpen] = useState<boolean>(false);

  const toggleNavbar = () => {
    setNavbarOpen(prev => !prev);
  };

  return (
    <>
      {/* Navbar lateral */}
      {navbarOpen && (
        <div className="fixed inset-0 z-40">
          {/* Fondo semitransparente */}
          <div className="absolute inset-0 bg-black/50" onClick={toggleNavbar} />
          
          {/* Contenido del navbar */}
          <div className="absolute left-0 top-0 h-full w-64 bg-secondary shadow-lg flex flex-col">
            {/* Cabecera */}
            <div className="p-4 flex justify-end">
              <FaTimes 
                className="w-6 h-6 text-white cursor-pointer" 
                onClick={toggleNavbar} 
              />
            </div>

            {/* Información usuario */}
            <div className="px-6 flex flex-col items-center gap-3">
              <img src={usuarioImg} alt="Usuario" className="w-16 h-16 rounded-full border-2 border-white" />
              <div className="text-center">
                <p className="font-medium text-white">{nombreUsuario}</p>
                <p className="text-sm text-gray-300 mt-1">{rol}</p>
              </div>
            </div>

            <hr className="border-white/20 my-4 mx-6" />

            {/* Menú de navegación */}
            <nav className="flex-1 overflow-y-auto px-4">
              <div className="space-y-2">
                {menuPorRol[rol]?.map((item, index) => (
                  <Link key={index} to={item.path} className=" block w-full px-4 py-3  text-white text-center hover:bg-white/10  rounded-lg transition-colors duration-200 " onClick={toggleNavbar}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>

            {/* Pie del navbar */}
            <div className="p-4 border-t border-white/10 ">
              <button className="flex items-center justify-center gap-2 w-fullpx-4 py-2 text-gray-300 hover:text-whitetransition-colors duration-200cursor-pointer ">
                <FaSignOutAlt />
                <span>Cerrar sesión</span>
              </button>
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
            <FaBars 
              className="w-6 h-6 text-tertiary cursor-pointer" 
              onClick={toggleNavbar} 
            />
          )}
        </div>

        <h2 className="font-tertiary text-tertiary text-lg mx-auto">{text}</h2>

        <div className="w-6"></div>
      </div>
    </>
  );
};