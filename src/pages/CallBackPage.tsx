import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader } from "../components/commons/Loader";


export const CallbackPage = () => {
    const { isLoading, error, isAuthenticated, logout } = useAuth0();
    const navigate = useNavigate();
    const location = useLocation();
    const [blockedUserDetected, setBlockedUserDetected] = useState(false);
    const [alertShown, setAlertShown] = useState(false);

    // useEffect SEPARADO para detectar usuario bloqueado (solo se ejecuta una vez)
    useEffect(() => {
        if (!alertShown) {
            const urlParams = new URLSearchParams(location.search);
            const urlError = urlParams.get('error');
            const urlErrorDescription = urlParams.get('error_description') ?? '';
            
            console.log('CallbackPage - URL Error:', urlError);
            console.log('CallbackPage - URL Error Description:', urlErrorDescription);
            
            if (urlError === 'unauthorized' && 
                (urlErrorDescription.includes('user is blocked') || 
                 urlErrorDescription.includes('user%20is%20blocked'))) {
                
                console.log('CallbackPage - Usuario bloqueado detectado');
                localStorage.setItem('userStatus', 'BLOCKED');
                setBlockedUserDetected(true);
                setAlertShown(true);
                
            }
        }
    }, [location.search, navigate, alertShown]);

    // useEffect SEPARADO para el flujo normal de Auth0
    useEffect(() => {
        if (!blockedUserDetected) {
            if (!isLoading && isAuthenticated) {
                navigate("/login-redirect");
            }
            if (error) {
                console.log('CallbackPage - Auth0 Error:', error);
                logout();
                setTimeout(() => {
                    navigate("/");
                }, 2500);
            }
        }
    }, [isLoading, isAuthenticated, error, navigate, logout, blockedUserDetected]);

    // Render condicional basado en el estado
    if (blockedUserDetected) {
        return (
            <div>
                <Loader />
                <h2>Usuario bloqueado, redirigiendo...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <Loader />
                <h2>Error al iniciar sesión, redirigiendo...</h2>
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