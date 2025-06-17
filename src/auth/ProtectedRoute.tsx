import { useAuth0 } from "@auth0/auth0-react";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/redux";
import { useAuthHandler } from "../hooks/useAuthHandler";
import { Loader } from "../components/commons/Loader";

interface Props {
  children: ReactNode;
  allowedRoles: string[];
}

export const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { isAuthenticated, isLoading } = useAuth0();
  const { authStatus } = useAuthHandler();
  const userRole = useAppSelector((state) => state.auth.rol);

  const sessionRole = sessionStorage.getItem('user_role');
  const sessionCompleted = sessionStorage.getItem('auth_completed') === 'true';

  // 1. Loading de Auth0
  if (isLoading) {
    console.log("[ProtectedRoute] Auth0 loading...");
    return <Loader/>;
  }

  // 2. No autenticado
  if (!isAuthenticated) {
    console.log("[ProtectedRoute] No autenticado, redirigiendo al home");
    return <Navigate to="/" replace />;
  }

  // 3. Esperar a que useAuthHandler termine si no hay datos aún
  if (
    isAuthenticated &&
    !sessionCompleted &&
    (!userRole || !allowedRoles.includes(userRole)) &&
    (authStatus === 'idle' || authStatus === 'checking' || authStatus === 'creating-user')
  ) {
    console.log("[ProtectedRoute] Esperando datos de sesión o rol...");
    return null;
  }

  // 4. Si hay datos en sessionStorage válidos, permite acceso
  if (sessionCompleted && sessionRole && allowedRoles.includes(sessionRole)) {
    console.log("[ProtectedRoute] Acceso por sessionStorage");
    return <>{children}</>;
  }

  // 5. Si hay datos en Redux válidos, permite acceso
  if (userRole && allowedRoles.includes(userRole)) {
    console.log("[ProtectedRoute] Acceso por Redux");
    return <>{children}</>;
  }

  // 6. Si terminó el proceso y no tiene permisos, redirige
  console.log("[ProtectedRoute] Sin permisos, redirigiendo al home");
  return <Navigate to="/" replace />;
};