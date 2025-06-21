import { Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Loader } from "../components/commons/Loader";

const EMPLOYEE_ROLES = ["Admin", "SuperAdmin", "Cajero", "Cocinero", "Delivery"];

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, isAuthenticated, isLoading } = useAuth0();
    const roles = user?.[`${import.meta.env.VITE_AUTH0_AUDIENCE}/roles`] || [];

    if (isLoading) return <Loader message="Cargando..." />;
    
    // Si está autenticado y tiene rol de empleado, redirige
    if (isAuthenticated && roles.some((r: string) => EMPLOYEE_ROLES.includes(r))) {
        return <Navigate to="/admin/Configuracion" replace />;
    }

    return <>{children}</>;
};