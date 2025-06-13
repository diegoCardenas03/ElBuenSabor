import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { setToken, setRol, clearAuth } from "../hooks/redux/slices/AuthReducer";
import { interceptorApiClient } from '../interceptors/Axios.interceptor'

export const useAuthHandler = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [authStatus, setAuthStatus] = useState<'idle' | 'checking' | 'completed'>('idle');
  const dispatch = useDispatch();

  const handleAuthUser = useCallback(async () => {
    if (isLoading) return;
    
    // Limpiar estado si no está autenticado
    if (!isAuthenticated) {
      dispatch(clearAuth());
      setAuthStatus('completed');
      return;
    }
    
    if (!user) return;
    
    setAuthStatus('checking');
    
    const sub = user.sub;
    const rol = user[`${import.meta.env.VITE_AUTH0_AUDIENCE}/roles`]?.[0];

    try {
      const token = await getAccessTokenSilently();
      dispatch(setToken(token));

      if (!rol) {
        dispatch(setRol(null));
        try {
          const response = await interceptorApiClient.post(
            "/api/admin/users/getUserById",
            { auth0Id: sub }
          );
          
          if (!response.data) {
            setAuthStatus('completed');
            return;
          }
        } catch (userError: any) {
          if (userError.response?.status === 404) {
            setAuthStatus('completed');
            return;
          }
          throw userError;
        }
      } else {
        dispatch(setRol(rol));
      }
      
      setAuthStatus('completed');
    } catch (error: any) {
      console.error('Error en useAuthHandler:', error);
      setAuthStatus('completed');
    }
  }, [isAuthenticated, isLoading, user, dispatch, getAccessTokenSilently]);

  useEffect(() => {
    handleAuthUser();
  }, [handleAuthUser]);

  return { authStatus, isAuthenticated };
};