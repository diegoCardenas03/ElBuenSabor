import { useAuth0 } from "@auth0/auth0-react";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/redux";
import { useAuthHandler } from "../hooks/useAuthHandler";

interface Props {
  children: ReactNode;
  allowedRoles: string[];
}

export const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { isAuthenticated, isLoading } = useAuth0();
  const { authStatus } = useAuthHandler();
  const userRole = useAppSelector((state) => state.auth.rol);

  // ✅ Mostrar loading mientras se procesa
  if (isLoading || authStatus === 'checking') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  // ✅ No autenticado - redirigir al home
  if (!isAuthenticated || authStatus !== 'completed') {
    return <Navigate to="/" replace />;
  }

  // ✅ Autenticado pero sin rol válido - redirigir al home
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  // ✅ Todo OK - mostrar el componente
  return <>{children}</>;
};