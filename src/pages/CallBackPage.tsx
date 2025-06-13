import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { Loader } from "../components/commons/Loader";

export const CallbackPage = () => {
    const { isLoading, error, isAuthenticated } = useAuth0();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            navigate("/login-redirect");
        }
        if (error) {
            console.error("Auth0 error:", error);
        }
    }, [isLoading, isAuthenticated, error, navigate]);

    return (
        <div>
            <Loader />
            <h2>Procesando inicio de sesión...</h2>
        </div>
    );
};
