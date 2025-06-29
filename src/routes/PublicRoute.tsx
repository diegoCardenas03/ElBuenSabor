import { Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Loader } from "../components/commons/Loader";

// const EMPLOYEE_ROLES = ["Admin", "SuperAdmin", "Cajero", "Cocinero", "Delivery"];

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, isAuthenticated, isLoading } = useAuth0();
    const rol = user?.[`${import.meta.env.VITE_AUTH0_AUDIENCE}/roles`][0];

    if (isLoading) return <Loader message="Cargando..." />;

    // Si está autenticado y tiene rol de empleado, redirige
    if (isAuthenticated) {

        if (rol === 'Admin') {
            return <Navigate to="/admin/configuracion" replace />;
        }
        else if (rol === 'Cocinero') {
            return <Navigate to="/admin/pedidosCocinero" replace />;
        }
        else if (rol === 'Delivery') {
            return <Navigate to="/admin/delivery" replace />;
        }
        else if (rol === 'Cajero') {
            return <Navigate to="/admin/pantallaCajero" replace />;
        }
        else {
            return <>{children}</>;
        }
    }

    return <>{children}</>;
};