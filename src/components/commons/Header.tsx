import { useState } from 'react';
import { FaArrowLeft, FaShoppingCart } from "react-icons/fa";
import { Navbar } from './Navbar';
import logo from "../../assets/el_buen_sabor_logo.png";
import CarritoLateral from './CarritoLateral';
import { Link } from 'react-router-dom';

interface HeaderProps {
  showBackButton?: boolean;
  onBackClick?: () => void;
  whiteUserBar?: boolean;
  nombreUsuario?: string;
  backgroundColor?: string;
}

export const Header: React.FC<HeaderProps> = ({
  showBackButton = true,
  onBackClick,
  whiteUserBar = false,
  nombreUsuario = "Tung Tung Sahur",
  backgroundColor = "none",
}) => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [carritoAbierto, setCarritoAbierto] = useState(false);

  const usuarioLogeado = true;

  const handleUserClick = () => setNavbarOpen(true);
  const handleCloseNavbar = () => setNavbarOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 flex items-center justify-between h-20 px-7 z-50  ${backgroundColor}`}
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
          <div className="md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center">
            <img src={logo} alt="Logo El Buen Sabor" className="h-20 w-auto" />
          </div>
        )}
      </Link>

      {/* Derecha - Usuario y carrito */}
      <div className="flex-shrink-0 flex items-center space-x-3 z-10">
        <span
          className={`font-secondary text-base cursor-pointer max-w-[120px] truncate ${
            whiteUserBar ? "text-white" : "text-black"
          }`}
          onClick={handleUserClick}
          title={nombreUsuario}
        >
          {nombreUsuario}
        </span>
        <div
          className={`h-5 border-l flex-shrink-0 ${
            whiteUserBar ? "border-white" : "border-black"
          }`}
        ></div>
        <FaShoppingCart
          className="flex-shrink-0 cursor-pointer"
          fill={whiteUserBar ? "white" : ""}
          color={whiteUserBar ? "white" : "black"}
          onClick={() => setCarritoAbierto(true)}
        />
        {carritoAbierto && (
          <CarritoLateral onClose={() => setCarritoAbierto(false)} />
        )}
      </div>

      <Navbar
        open={navbarOpen}
        onClose={handleCloseNavbar}
        usuarioLogeado={usuarioLogeado}
        nombreUsuario={nombreUsuario}
        whiteUserBar={navbarOpen ? true : whiteUserBar} // <- SIEMPRE BLANCO SI ESTÁ ABIERTO
      />
    </header>
  );
};