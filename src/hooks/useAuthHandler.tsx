import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { setToken, setRol, clearAuth } from "../hooks/redux/slices/AuthReducer";
import { interceptorApiClient } from '../interceptors/Axios.interceptor'

export const useAuthHandler = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [authStatus, setAuthStatus] = useState<'idle' | 'checking' | 'completed' | 'creating-user'>('idle');
  const dispatch = useDispatch();

  const createUserInDB = useCallback(async (user: any, token: string) => {
    try {
      setAuthStatus('creating-user');
      
      // 1. Obtener rol de Cliente
      const roleResponse = await interceptorApiClient.get(
        "/api/admin/roles/getRoleByName?name=Cliente"
      );

      // 2. Crear usuario en BD
      await interceptorApiClient.post("/api/admin/users/createUserClient", {
        auth0Id: user.sub,
        email: user.email,
        name: user.name,
        nickName: user.nickname || user.name,
        connection: "google-oauth2",
        roles: [roleResponse.data.auth0RoleId]
      });

      // 3. Obtener nuevo token con roles actualizados
      const newToken = await getAccessTokenSilently({ cacheMode: "off" });
      dispatch(setToken(newToken));
      dispatch(setRol("Cliente"));
      
      console.log('Usuario creado exitosamente en BD');
      return true;
    } catch (error: any) {
      console.error('Error creando usuario en BD:', error);
      // Si hay error, aún podemos continuar con el usuario autenticado
      return false;
    }
  }, [dispatch, getAccessTokenSilently]);

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
            // Usuario no existe en BD, crear automáticamente si viene de Google
            const isGoogleUser = user.sub?.includes('google-oauth2') || 
                                user.identities?.some((id: any) => id.provider === 'google-oauth2');
            
            if (isGoogleUser) {
              console.log('Usuario de Google detectado, creando en BD...');
              await createUserInDB(user, token);
            }
            
            setAuthStatus('completed');
            return;
          }
          
          // Usuario existe, establecer rol si lo tiene
          if (response.data.roles && response.data.roles.length > 0) {
            dispatch(setRol(response.data.roles[0].name));
          }
        } catch (userError: any) {
          if (userError.response?.status === 404) {
            // Usuario no encontrado, crear si es de Google
            const isGoogleUser = user.sub?.includes('google-oauth2') || 
                                user.identities?.some((id: any) => id.provider === 'google-oauth2');
            
            if (isGoogleUser) {
              console.log('Usuario de Google no encontrado en BD, creando...');
              await createUserInDB(user, token);
            }
            
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
  }, [isAuthenticated, isLoading, user, dispatch, getAccessTokenSilently, createUserInDB]);

  useEffect(() => {
    handleAuthUser();
  }, [handleAuthUser]);

  return { 
    authStatus, 
    isAuthenticated,
    isCreatingUser: authStatus === 'creating-user',
    isProcessing: authStatus === 'checking' || authStatus === 'creating-user'
  };
};