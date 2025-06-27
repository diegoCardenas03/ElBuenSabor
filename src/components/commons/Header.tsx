import { useEffect, useState } from 'react';
import { FaArrowLeft, FaShoppingCart } from "react-icons/fa";
import { Navbar } from './Navbar';
import logo from "../../assets/el_buen_sabor_logo.png";
import CarritoLateral from './CarritoLateral';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { abrirCarrito, cerrarCarrito } from '../../hooks/redux/slices/AbrirCarritoReducer';
import Swal from 'sweetalert2';
import { fetchPedidosByUsuario } from '../../hooks/redux/slices/PedidoReducer';
import PedidoDetalleModal from '../modals/PedidoDetalleModal';
import { Estado } from '../../types/enums/Estado';
import { PedidoResponseDTO } from '../../types/Pedido/PedidoResponseDTO';
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

  const getFirstName = (fullName?: string) => {
    if (!fullName) return "Usuario";
    return fullName.split(" ")[0];
  };


  const [navbarOpen, setNavbarOpen] = useState(false);
  const carrito = useAppSelector((state) => state.carrito.items);
  const carritoAbierto = useAppSelector((state) => state.carritoUI.abierto);
  const dispatch = useAppDispatch();

  // ✅ NUEVO: Auth0 integration
  const { isAuthenticated, isLoading, user, loginWithRedirect } = useAuth0();
  const { authStatus } = useAuthHandler();

  // --- OPTIMIZACIÓN: Leer datos de sessionStorage si existen ---
  const sessionCompleted = sessionStorage.getItem('auth_completed') === 'true';
  const sessionRole = sessionStorage.getItem('user_role');
  const sessionToken = sessionStorage.getItem('auth_token');
  const sessionName = sessionStorage.getItem('user_name'); // <-- NUEVO
  const sessionEmail = sessionStorage.getItem('user_email');
  const sessionPicture = sessionStorage.getItem('user_picture');
  const hasSessionData = sessionCompleted && sessionRole && sessionToken;

  // ✅ NUEVO: Determinar estado del usuario dinámicamente
  const usuarioLogeado =
    !!((isAuthenticated && authStatus === 'completed') || hasSessionData);

  const nombreUsuario = usuarioLogeado
    ? (sessionName || "Usuario")
    : "Invitado";
  const emailUsuario = sessionEmail || "Sin email";
  const fotoUsuario = sessionPicture || "nada";

  // Mostrar loading SOLO si no hay datos en sessionStorage y Auth0 está cargando
  const isAppLoading =
    (!hasSessionData && isLoading) ||
    (isAuthenticated && authStatus === 'checking');

  useEffect(() => {
    if (isAppLoading) {
      setNavbarOpen(false);
    }
  }, [isAppLoading]);
  const [modalPedidoEnCurso, setModalPedidoEnCurso] = useState(false);

   const pedidoEnCurso = useAppSelector(state => state.pedido.pedidoEnCurso);
   const clienteId = 1;

  useEffect(() => {
    if (clienteId) {
      dispatch(fetchPedidosByUsuario(clienteId));
    }
  }, [clienteId, dispatch]);

  useEffect(() => {
    if (carritoAbierto && carrito.length === 0) {
      dispatch(cerrarCarrito());
    }
  }, [carrito, carritoAbierto, dispatch]);

  const handleUserClick = () => setNavbarOpen(true);
  const handleCloseNavbar = () => setNavbarOpen(false);

  // ✅ CORREGIDO: Usar la variable combinada de loading
  if (isAppLoading) {
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
            Cargando...
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
          <div className="flex-shrink-0 flex items-center space-x-3 z-10">
            <img src={logo} alt="Logo El Buen Sabor" className="h-20 w-auto" />
            {!showBackButton && pedidoEnCurso && (
              <div className="flex-shrink-0 flex items-center space-x-3 z-10">
                <div
                  className={`h-5 border-l flex-shrink-0 text-secondary`}
                ></div>
                <span
                  key={pedidoEnCurso.id}
                  className="font-secondary text-base cursor-pointer max-w-[120px] truncate text-secondary"
                  onClick={() => setModalPedidoEnCurso(true)}
                >
                  Ver pedido en curso
                </span>
              </div>
            )}
            {modalPedidoEnCurso &&
              <PedidoDetalleModal pedido={pedidoEnCurso as PedidoResponseDTO} open={modalPedidoEnCurso} onClose={() => {setModalPedidoEnCurso(false); dispatch(fetchPedidosByUsuario(clienteId));}}/>
            }
          </div>
        )}
      </div>

      {/* Logo centrado solo cuando hay botón de volver */}
      {/* <Link to={"/"}>
        {showBackButton && (
          <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center">
            <img src={logo} alt="Logo El Buen Sabor" className="h-20 w-auto" />
          </div>
        )}
      </Link> */}

      {/* Derecha - Usuario y carrito */}

      <div className="flex-shrink-0 flex items-center space-x-3 z-10">
        {isAuthenticated ? <span
          className={`font-secondary text-base cursor-pointer max-w-[120px] truncate ${whiteUserBar ? "text-white" : "text-black"}`}
          onClick={handleUserClick}
          title={getFirstName(nombreUsuario)}
        >
          {nombreUsuario}
        </span> : <span
          className={`font-secondary text-base cursor-pointer max-w-[120px] truncate ${whiteUserBar ? "text-white" : "text-black"}`}
          onClick={() => loginWithRedirect()}
        >
          INGRESAR
        </span>}

           <div
            className={`h-5 border-l flex-shrink-0 ${whiteUserBar ? "border-white" : "border-black"}`}
          >
          </div>

        {isAuthenticated && 
         
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
          /> }

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
        fotoUsuario={fotoUsuario}
        emailUsuario={emailUsuario}
        whiteUserBar={navbarOpen ? true : whiteUserBar}
      />
    </header >
  );
};