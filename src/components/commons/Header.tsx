import { useEffect, useState } from 'react';
import { FaArrowLeft, FaShoppingCart } from "react-icons/fa";
import { Navbar } from './Navbar';
import logo from "../../assets/el_buen_sabor_logo.png";
import CarritoLateral from './CarritoLateral';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { abrirCarrito, cerrarCarrito } from '../../hooks/redux/slices/AbrirCarritoReducer';
import Swal from 'sweetalert2';
import { useAuthHandler } from '../../hooks/useAuthHandler';
import { useAuth0 } from '@auth0/auth0-react';

interface HeaderProps {
  showBackButton?: boolean;
  onBackClick?: () => void;
  whiteUserBar?: boolean;

  backgroundColor?: string;
}

export const Header: React.FC<HeaderProps> = ({
  showBackButton = true,
  onBackClick,
  whiteUserBar = false,
  backgroundColor = "none",
}) => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const carrito = useAppSelector((state) => state.carrito.items);
  const carritoAbierto = useAppSelector((state) => state.carritoUI.abierto);
  const dispatch = useAppDispatch();

  // ✅ NUEVO: Auth0 integration
  const { user, isAuthenticated, isLoading } = useAuth0();
  const { authStatus } = useAuthHandler();

  // ✅ NUEVO: Determinar estado del usuario dinámicamente
  const usuarioLogeado = isAuthenticated && authStatus === 'completed';
  const nombreUsuario = usuarioLogeado
    ? (user?.name || user?.nickname || user?.email || "Usuario")
    : "Invitado";

  useEffect(() => {
    if (carritoAbierto && carrito.length === 0) {
      dispatch(cerrarCarrito());
    }
  }, [carrito, carritoAbierto, dispatch]);

  const handleUserClick = () => setNavbarOpen(true);
  const handleCloseNavbar = () => setNavbarOpen(false);

  // ✅ NUEVO: Mostrar loading mientras se procesa la autenticación
  if (isLoading || authStatus === 'checking') {
    return (
      <header className={`fixed top-0 left-0 right-0 flex items-center justify-between h-20 px-7 z-50 ${backgroundColor}`}>
        <div className="flex-shrink-0 flex items-center z-10">
          {showBackButton ? (
            <div className="flex items-center space-x-2 cursor-pointer" onClick={onBackClick}>
              <Link to={"/"} className="flex items-center space-x-2">
                <div className="bg-orange-400 rounded-full p-1.5">
                  <FaArrowLeft color="white" />
                </div>
                <span className="font-tertiary text-black text-base">VOLVER</span>
              </Link>
            </div>
          ) : (
            <img src={logo} alt="Logo El Buen Sabor" className="h-20 w-auto" />
          )}
        </div>

        <Link to={"/"}>
          {showBackButton && (
            <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center">
              <img src={logo} alt="Logo El Buen Sabor" className="h-20 w-auto" />
            </div>
          )}
        </Link>

        <div className="flex-shrink-0 flex items-center space-x-3 z-10">
          <span className={`font-secondary text-base ${whiteUserBar ? "text-white" : "text-black"}`}>
            Cargando... {/* ✅ NUEVO: Mostrar estado de carga */}
          </span>
        </div>
      </header>
    );
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 flex items-center justify-between h-20 px-7 z-50 ${backgroundColor}`}
    >
      {/* Izquierda - Contenedor dinámico */}
      <div className="flex-shrink-0 flex items-center z-10">
        {showBackButton ? (
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={onBackClick}
          >
            <Link to={"/"} className="flex items-center space-x-2">
              <div className="bg-orange-400 rounded-full p-1.5">
                <FaArrowLeft color="white" />
              </div>
              <span className="font-tertiary text-black text-base">VOLVER</span>
            </Link>
          </div>
        ) : (
          <img src={logo} alt="Logo El Buen Sabor" className="h-20 w-auto" />
        )}
      </div>

      {/* Logo centrado solo cuando hay botón de volver */}
      <Link to={"/"}>
        {showBackButton && (
          <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center">
            <img src={logo} alt="Logo El Buen Sabor" className="h-20 w-auto" />
          </div>
        )}
      </Link>

      {/* Derecha - Usuario y carrito */}
      <div className="flex-shrink-0 flex items-center space-x-3 z-10">
        <span
          className={`font-secondary text-base cursor-pointer max-w-[120px] truncate ${whiteUserBar ? "text-white" : "text-black"}`}
          onClick={handleUserClick}
          title={nombreUsuario} 
        >
          {nombreUsuario} 
        </span>
        <div
          className={`h-5 border-l flex-shrink-0 ${whiteUserBar ? "border-white" : "border-black"}`}
        ></div>
        <FaShoppingCart
          className="flex-shrink-0 cursor-pointer"
          fill={whiteUserBar ? "white" : ""}
          color={whiteUserBar ? "white" : "black"}
          onClick={() => carrito.length === 0 ?
            Swal.fire({
              position: "center",
              icon: "error",
              title: "El carrito esta vacio",
              showConfirmButton: false,
              timer: 1000,
              width: "20em"
            }) : dispatch(abrirCarrito())}
        />
        {carritoAbierto && (
          <div className="fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => dispatch(cerrarCarrito())}
            ></div>
            <CarritoLateral onClose={() => dispatch(cerrarCarrito())} />
          </div>
        )}
      </div>

      <Navbar
        open={navbarOpen}
        onClose={handleCloseNavbar}
        usuarioLogeado={usuarioLogeado} 
        nombreUsuario={nombreUsuario} 
        whiteUserBar={navbarOpen ? true : whiteUserBar}
      />
    </header>
  );
};