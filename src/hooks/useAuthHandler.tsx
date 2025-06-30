import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { setToken, setRol, clearAuth } from "../hooks/redux/slices/AuthReducer";
import { interceptorApiClient } from '../interceptors/Axios.interceptor'
import { UsuarioDTO } from "../types/Usuario/UsuarioDTO";
import { ClienteDTO } from "../types/Cliente/ClienteDTO";

const saveToSession = (key: string, value: string) => {
  try {
    sessionStorage.setItem(key, value);
    // console.log(`[useAuthHandler] Guardado en sessionStorage: ${key} = ${value}`);
  } catch (e) {
    // console.error(`[useAuthHandler] Error guardando en sessionStorage: ${key}`, e);
  }
};

const getFromSession = (key: string): string | null => {
  try {
    const value = sessionStorage.getItem(key);
    // console.log(`[useAuthHandler] Leyendo sessionStorage: ${key} = ${value}`);
    return value;
  } catch (e) {
    // console.error(`[useAuthHandler] Error leyendo sessionStorage: ${key}`, e);
    return null;
  }
};



export const clearSession = () => {
  try {
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('user_role');
    sessionStorage.removeItem('user_name');
    sessionStorage.removeItem('user_email');
    sessionStorage.removeItem('user_picture');
    sessionStorage.removeItem('auth_completed');
    sessionStorage.removeItem('user_telefono');
    sessionStorage.removeItem('user_needs_extra_data');
    sessionStorage.removeItem('user_id_db');
    // console.log("[useAuthHandler] clearSession ejecutado");
  } catch (e) {
    // console.error("[useAuthHandler] Error limpiando sessionStorage", e);
  }
};

export const useAuthHandler = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [authStatus, setAuthStatus] = useState<'idle' | 'checking' | 'completed' | 'creating-user'>('idle');
  const dispatch = useDispatch();

  const isProcessingRef = useRef(false);
  const processedUserRef = useRef<string | null | undefined>(null);

  useEffect(() => {
    const savedToken = getFromSession('auth_token');
    const savedRole = getFromSession('user_role');
    const authCompleted = getFromSession('auth_completed');

    if (isAuthenticated && savedToken && savedRole && authCompleted === 'true') {
      dispatch(setToken(savedToken));
      dispatch(setRol(savedRole));
      setAuthStatus('completed');
      processedUserRef.current = user?.sub || null;
      // console.log("[useAuthHandler] Restaurando estado desde sessionStorage");
      return;
    }

    if (isAuthenticated && user && !isProcessingRef.current) {
      setAuthStatus('checking');
    } else if (!isAuthenticated && !isLoading) {
      // console.log("[useAuthHandler] No autenticado (Auth0 listo), limpiando sessionStorage");
      dispatch(clearAuth());
      clearSession();
      setAuthStatus('completed');
      isProcessingRef.current = false;
      processedUserRef.current = null;
      return;
    }
  }, [isAuthenticated, isLoading, user, dispatch]);

  // ✅ NUEVA FUNCIÓN: Completar datos de sessionStorage después del modal
  const completeSessionData = useCallback(async (clienteData: any) => {
    try {
      // console.log("[useAuthHandler] Completando datos de sessionStorage:", clienteData);

      saveToSession('user_name', clienteData.nombreCompleto || "Usuario");
      saveToSession('user_telefono', clienteData.telefono || "");
      saveToSession('user_needs_extra_data', 'false');
      saveToSession('auth_completed', 'true');

      // console.log("[useAuthHandler] Datos de sessionStorage completados");
    } catch (error) {
      // console.error("[useAuthHandler] Error completando sessionStorage:", error);
    }
  }, []);

  // ✅ CREAR USUARIO (para Auth0 social)
  const createUser = useCallback(async (userData: {
    email?: string;
    nombreCompleto?: string;
    telefono?: string;
    password?: string;
    auth0Id?: string;
    isGoogleUser?: boolean;
  }) => {
    try {
      setAuthStatus('creating-user');
      // console.log("[useAuthHandler] createUser llamado con:", userData);

      const roleResponse = await interceptorApiClient.get('/api/admin/roles');
      // console.log("[useAuthHandler] Roles obtenidos:", roleResponse.data);
      const clienteRole = roleResponse.data.find((role: any) => role.nombre === 'Cliente');

      if (!clienteRole?.auth0RolId) {
        // console.error("[useAuthHandler] Rol Cliente no encontrado en roles:", roleResponse.data);
        throw new Error('Rol Cliente no encontrado');
      }

      const usuarioDTO: UsuarioDTO = {
        email: userData.email,
        nombreCompleto: userData.nombreCompleto,
        nickName: userData.nombreCompleto,
        connection: userData.isGoogleUser ? "google-oauth2" : "Username-Password-Authentication",
        roles: [clienteRole.auth0RolId],
        ...(userData.auth0Id && { auth0Id: userData.auth0Id }),
        ...(userData.password && { contrasenia: userData.password })
      };

      const clienteDTO: ClienteDTO = {
        nombreCompleto: userData.nombreCompleto!,
        telefono: userData.telefono || "",
        usuario: usuarioDTO
      };

      // console.log("[useAuthHandler] Enviando clienteDTO al backend:", clienteDTO);

      const createResponse = await interceptorApiClient.post("/api/clientes/save", clienteDTO);

      // console.log("[useAuthHandler] Respuesta del backend al crear usuario:", createResponse.data);

      let token: string;

      token = await getAccessTokenSilently({ cacheMode: "off" });
      // console.log("[useAuthHandler] Token obtenido con Google:", token);


      dispatch(setToken(token));
      dispatch(setRol("Cliente"));


      // ✅ CAMBIO PRINCIPAL: Solo guardar datos esenciales, marcar que necesita datos extra
      saveToSession('auth_token', token);
      saveToSession('user_role', 'Cliente');
      saveToSession('user_email', userData.email || user?.email || "");
      saveToSession('user_picture', user?.picture || "");
      // console.log('[UseAuthHandler] createResponse Id: ', createResponse.data.id);
      saveToSession('user_id_db', createResponse.data.id || "");

      // ✅ CONDICIONAL: Si es nuevo usuario de Google y no tiene teléfono, marcar para datos extra

      saveToSession('user_needs_extra_data', 'true');
      // console.log("[useAuthHandler] Usuario nuevo de Google, requiere datos adicionales");


      setAuthStatus('completed');
      processedUserRef.current = userData.auth0Id || null;

      return { success: true, data: createResponse.data };

    } catch (error: any) {
      setAuthStatus('completed');
      // console.error("[useAuthHandler] Error en createUser:", error?.response?.data || error);
      throw error;
    }
  }, [dispatch, getAccessTokenSilently, user]);



  // ✅ MANEJAR AUTH USER (con fallback para usuarios que salieron del modal)
  const handleAuthUser = useCallback(async () => {
    if (isLoading || !isAuthenticated || !user || isProcessingRef.current) return;

    if (processedUserRef.current === user.sub && authStatus === 'completed') {
      // console.log("[useAuthHandler] Usuario ya procesado:", user.sub);
      return;
    }

    const savedToken = getFromSession('auth_token');
    const savedRole = getFromSession('user_role');
    const needsExtraData = getFromSession('user_needs_extra_data');

    // ✅ MODIFICADO: Si necesita datos extra y no tiene nombre, usar email como fallback (Salio del modal)
    if (savedToken && savedRole && needsExtraData === 'true') {
      const userName = getFromSession('user_name');
      if (!userName) {
        // console.log("[useAuthHandler] Usuario salió del modal, usando email como nombre fallback");
        if (user?.sub?.startsWith("google-oauth2")) {
          saveToSession('user_name', user?.name || "Usuario");
        }
        else {
          saveToSession('user_name', user?.email?.split('@')[0] || "Usuario");
        }


        saveToSession('auth_completed', 'true');
      }
      dispatch(setToken(savedToken));
      dispatch(setRol(savedRole));
      setAuthStatus('completed');
      processedUserRef.current = user.sub;
      return;
    }

    if (savedToken && savedRole) {
      // console.log("[useAuthHandler] Token y rol ya en sessionStorage");
      return;
    }

    isProcessingRef.current = true;

    try {
      const rol = user[`${import.meta.env.VITE_AUTH0_AUDIENCE}/roles`]?.[0];
      // console.log('user:', user);
      // console.log('VITE_AUTH0_AUDIENCE:', import.meta.env.VITE_AUTH0_AUDIENCE);
      // console.log('roles en user:', user[`${import.meta.env.VITE_AUTH0_AUDIENCE}/roles`]);
      // console.log('rolUsuario:', rol);
      // console.log("[useAuthHandler] Rol detectado en user:", rol);


      if (rol) {
        const token = await getAccessTokenSilently();
        dispatch(setToken(token));
        dispatch(setRol(rol));
        saveToSession('auth_token', token);
        saveToSession('user_role', rol);
        saveToSession('auth_completed', 'true');
        saveToSession('user_email', user?.email || "");
        saveToSession('user_picture', user?.picture || "");

        try {
          const response = await interceptorApiClient.get(`/api/clientes/email/${user.email}`);
          const nombreCompleto = response.data?.nombreCompleto || user?.email?.split('@')[0] || "Usuario";
          saveToSession('user_name', nombreCompleto);
          saveToSession('user_id_db', response.data?.id);
        } catch (e) {
          // Si falla, usar el email como fallback
          saveToSession('user_name', user?.email?.split('@')[0] || "Usuario");
          
        }
        
        processedUserRef.current = user.sub;
        setAuthStatus('completed');
        // console.log("[useAuthHandler] Rol desde Auth0, acceso directo");
        return;
      }

      // Verificar si usuario existe en BD
      try {



        // console.log("[useAuthHandler] Buscando usuario en BD por email:", user.email);
        let response;
        const rolUsuario = user[`${import.meta.env.VITE_AUTH0_AUDIENCE}/roles`]?.[0] || "Cliente";
        // console.log('Rol detectado para usuario:', rolUsuario);

        response = await interceptorApiClient.get(`/api/clientes/email/${user.email}`);

        // console.log("[useAuthHandler] Usuario encontrado en BD:", response.data);

        const token = await getAccessTokenSilently();

        const userRole = response.data?.usuario?.roles?.length > 0
          ? response.data.usuario.roles[0].nombre
          : "Cliente";

        dispatch(setToken(token));
        dispatch(setRol(userRole));
        saveToSession('auth_token', token);
        saveToSession('user_role', userRole);
        saveToSession('auth_completed', 'true');
        saveToSession('user_name', response.data.nombreCompleto || user?.email?.split('@')[0] || "Usuario");
        saveToSession('user_email', user?.email || "");
        saveToSession('user_picture', user?.picture || "");
        saveToSession('user_id_db', response.data.id);
        saveToSession('user_telefono', response.data.telefono || "");
        saveToSession('user_needs_extra_data', 'false');
        processedUserRef.current = user.sub;
        setAuthStatus('completed');
        // console.log("[useAuthHandler] Usuario encontrado en BD, acceso por BD");
      } catch (userError: any) {
        // console.log("userError completo:", userError);
        const is404Error = (userError.response && userError.response.status === 404) ||
          (userError.message && (
            userError.message.includes("404") ||
            userError.message.toLowerCase().includes("not found")
          ));

        // console.log('Error: ' + is404Error);
        // console.error("[useAuthHandler] Error buscando usuario en BD:", userError?.response?.data || userError);

        if (is404Error) {
          // console.log("[useAuthHandler] Usuario no existe en BD, creando usuario...");
          await createUser({
            email: user.email,
            nombreCompleto: user.name || user.email,
            telefono: user.phone_number || "",
            auth0Id: user.sub,
            isGoogleUser: user.sub?.startsWith("google-oauth2")
          });
          // console.log("[useAuthHandler] Usuario creado");
          return;
        } else {
          throw userError;
        }
      }

    } finally {
      isProcessingRef.current = false;
    }
  }, [isAuthenticated, isLoading, user, dispatch, getAccessTokenSilently, createUser, authStatus]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // console.log("[useAuthHandler] No autenticado (Auth0 listo), limpiando sessionStorage");
      dispatch(clearAuth());
      clearSession();
      setAuthStatus('completed');
      isProcessingRef.current = false;
      processedUserRef.current = null;
      return;
    }

    const hasSessionData = getFromSession('auth_completed') === 'true';
    if (!hasSessionData && authStatus === 'checking') {
      handleAuthUser().catch((e) => {
        // console.error("[useAuthHandler] Error en effect principal:", e?.response?.data || e);
        setAuthStatus('completed');
      });
    }
  }, [isAuthenticated, isLoading, authStatus, dispatch, handleAuthUser]);

  return {
    authStatus,
    isAuthenticated,
    isCreatingUser: authStatus === 'creating-user',
    isProcessing: authStatus === 'checking' || authStatus === 'creating-user',
    createUser,
    completeSessionData,
    clearSession // ✅ Función para completar datos
  };
};