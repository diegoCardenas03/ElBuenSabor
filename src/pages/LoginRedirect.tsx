import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setToken, setRol } from "../hooks/redux/slices/AuthReducer";
import interceptorApiClient from "./../interceptors/Axios.interceptor";
import { Loader } from "../components/commons/Loader";

const VITE_AUTH0_AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE;

export const LoginRedirect = () => {
    const { user, isAuthenticated, isLoading, getAccessTokenSilently } =
        useAuth0();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const checkUserInDB = async () => {
            if (isLoading || !isAuthenticated || !user) return;

            const sub = user.sub;
            const rol = user[`${VITE_AUTH0_AUDIENCE}/roles`]?.[0];

            try {
                const token = await getAccessTokenSilently();
                dispatch(setToken(token));

                if (rol === undefined || rol === null || !rol) {
                    dispatch(setRol(null));

                    const response = await interceptorApiClient.post(
                        "/api/admin/users/getUserById",
                        {
                            auth0Id: sub,
                        }
                    );

                    // Si no existe, reviso firstLogin
                    if (!response.data) {
                        navigate("/post-login");
                    }
                } else {
                    dispatch(setRol(rol));
                    // Si no es cliente, redirijo directo a la ruta del rol
                    navigate(`/${rol}`);
                }
            } catch (error: any) {
                if (error.response?.status === 404 && !rol) {
                    navigate("/post-login");
                } else {
                    console.error("Error al consultar usuario", error);
                    navigate("/");
                }
            }
        };

        checkUserInDB();
    }, [isAuthenticated, isLoading, user, dispatch, navigate]);

    return (
        <div>
            <Loader />
            <h2>Redirigiendo...</h2>
        </div>
    );
};