import { useAuth0 } from "@auth0/auth0-react";
import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
// import { useAppSelector } from "../hooks/redux";
import { useAuthHandler } from "../hooks/useAuthHandler";
import { Loader } from "../components/commons/Loader";
import axios from "axios";
import { UsuarioResponseDTO } from "../types/Usuario/UsuarioResponseDTO";
import Swal from "sweetalert2";
import { PaginaNoExiste } from "../pages/PaginaNoExiste";

interface Props {
  children: ReactNode;
  allowedRoles: string[];
}

export const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { isAuthenticated, isLoading, logout, getAccessTokenSilently } = useAuth0();
  const { clearSession } = useAuthHandler();
  const [userDataState, setUserDataState] = useState<UsuarioResponseDTO | null>(null);
  

  // const userRole = useAppSelector((state) => state.auth.rol);

  // const sessionRole = sessionStorage.getItem('user_role');
  // const sessionCompleted = sessionStorage.getItem('auth_completed') === 'true';

  //Envia el token a validar y trae la data del usuario
  const userData = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.get(`${import.meta.env.VITE_API_SERVER_URL}/api/usuarios/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data as UsuarioResponseDTO;
    } catch (error) {
      Swal.fire({
        title: "¡Error!",
        text: "Su identidad no ha podido validarse. Redirigiendo...",
        icon: "error",
        confirmButtonText: "Aceptar",
      })
      clearSession();
      logout();
      <Navigate to="/" replace />;

    }
  }

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await userData();
      if (data) setUserDataState(data);
    };
    fetchUserData();
  }, []);

  // Ejemplo: verificar si el usuario tiene algún rol permitido
  const hasAllowedRole =
    userDataState?.roles?.some((rol: any) => allowedRoles.includes(rol.nombre));

  // 1. Loading de Auth0
  if (isLoading) {
    return <Loader />;
  }

  // 2. No autenticado
  if (!isAuthenticated) {
    clearSession();
    return <Navigate to="/" replace />;
  }

  // 3. Esperar a que los datos del usuario estén listos
  if (userDataState === null) {
    return <Loader message="Cargando datos de usuario..." />;
  }

  // 4. Si está autenticado, es valido el token y cumple con los roles se redirige al hijo
  if (isAuthenticated && hasAllowedRole) {
    return <>{children}</>;
  }

  // 6. Si terminó el proceso y no tiene permisos, redirige
  // Swal.fire({
  //   title: "¡Error!",
  //   text: "Ten cuidado amiguito, se donde vives.",
  //   icon: "error",
  //   confirmButtonText: "Aceptar",
  // })

  if (isAuthenticated && !hasAllowedRole) {
    return <PaginaNoExiste />;
  }

  if (userDataState.roles[0].nombre === 'Cliente')
    return <Navigate to="/" replace />;
  else if (userDataState.roles[0].nombre === 'Admin') {
    return <Navigate to="/admin/configuracion" replace />
  }
  else if (userDataState.roles[0].nombre === 'Cocinero') {
    return <Navigate to="/admin/PedidosCocinero" replace />
  }
  else if (userDataState.roles[0].nombre === 'Delivery') {
    return <Navigate to="/admin/delivery" replace />
  }
  else if (userDataState.roles[0].nombre === 'Cajero') {
    return <Navigate to="/admin/pantallaCajero" replace />
  }
  else {
    return <Navigate to="/" replace />
  }
};



// // 3. Esperar a que useAuthHandler termine si no hay datos aún
// if (
//   isAuthenticated &&
//   !sessionCompleted &&
//   (hasAllowedRole) &&
//   (authStatus === 'idle' || authStatus === 'checking' || authStatus === 'creating-user')
// ) {
//   return <Loader message="Esperando datos de sesión..." />;
// }

// // 4. Si hay datos en sessionStorage válidos, permite acceso
// if (sessionCompleted && hasAllowedRole) {
//   return <>{children}</>;
// }