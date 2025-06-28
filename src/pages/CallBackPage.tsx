import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { Loader } from "../components/commons/Loader";

export const CallbackPage = () => {
    const { isLoading, error, isAuthenticated, logout } = useAuth0();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            navigate("/login-redirect");
        }
        if (error) {
            logout();
            // Mostrar mensaje y redirigir al home o login
            setTimeout(() => {
                navigate("/");
            }, 2500);
        }
    }, [isLoading, isAuthenticated, error, navigate]);

    if (error) {
        return (
            <div>
                <Loader />
                <h2>Error al iniciar sesion, redirigiendo...</h2>
            </div>
        );
    }

    return (
        <div>
            <Loader />
            <h2>Procesando inicio de sesión...</h2>
        </div>
    );
};