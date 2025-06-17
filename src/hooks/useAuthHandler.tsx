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
    console.log(`[useAuthHandler] Guardado en sessionStorage: ${key} = ${value}`);
  } catch (e) {
    console.error(`[useAuthHandler] Error guardando en sessionStorage: ${key}`, e);
  }
};

const getFromSession = (key: string): string | null => {
  try {
    const value = sessionStorage.getItem(key);
    console.log(`[useAuthHandler] Leyendo sessionStorage: ${key} = ${value}`);
    return value;
  } catch (e) {
    console.error(`[useAuthHandler] Error leyendo sessionStorage: ${key}`, e);
    return null;
  }
};

const getFirstName = (fullName?: string) => {
  if (!fullName) return "Usuario";
  return fullName.split(" ")[0];
};

const clearSession = () => {
  try {
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('user_role');
    sessionStorage.removeItem('user_name');
    sessionStorage.removeItem('user_email');
    sessionStorage.removeItem('user_picture');
    sessionStorage.removeItem('auth_completed');
    sessionStorage.removeItem('user_id_db');
    sessionStorage.removeItem('user_telefono');
    console.log("[useAuthHandler] clearSession ejecutado");
  } catch (e) {
    console.error("[useAuthHandler] Error limpiando sessionStorage", e);
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
      console.log("[useAuthHandler] Restaurando estado desde sessionStorage");
      return;
    }

    if (isAuthenticated && user && !isProcessingRef.current) {
      setAuthStatus('checking');
    } else if (!isAuthenticated && !isLoading) {
      console.log("[useAuthHandler] No autenticado (Auth0 listo), limpiando sessionStorage");
      dispatch(clearAuth());
      clearSession();
      setAuthStatus('completed');
      isProcessingRef.current = false;
      processedUserRef.current = null;
      return;
    }
  }, [isAuthenticated, isLoading, user, dispatch]);

  // CREAR USUARIO (debug)
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
      console.log("[useAuthHandler] createUser llamado con:", userData);

      const roleResponse = await interceptorApiClient.get('/api/admin/roles');
      console.log("[useAuthHandler] Roles obtenidos:", roleResponse.data);
      const clienteRole = roleResponse.data.find((role: any) => role.nombre === 'Cliente');

      if (!clienteRole?.auth0RolId) {
        console.error("[useAuthHandler] Rol Cliente no encontrado en roles:", roleResponse.data);
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

      console.log("[useAuthHandler] Enviando clienteDTO al backend:", clienteDTO);

      const createResponse = await interceptorApiClient.post("/api/clientes/save", clienteDTO);

      console.log("[useAuthHandler] Respuesta del backend al crear usuario:", createResponse.data);

      let token: string;
      if (userData.isGoogleUser && userData.auth0Id) {
        token = await getAccessTokenSilently({ cacheMode: "off" });
        console.log("[useAuthHandler] Token obtenido con Google:", token);
      } else {
        const loginResponse = await interceptorApiClient.post('/api/clientes/login', {
          email: userData.email,
          password: userData.password
        });
        token = loginResponse.data.token;
        console.log("[useAuthHandler] Token obtenido con login tradicional:", token);
      }

      dispatch(setToken(token));
      dispatch(setRol("Cliente"));
      saveToSession('auth_token', token);
      saveToSession('user_role', 'Cliente');
      saveToSession('auth_completed', 'true');
      saveToSession('user_name', getFirstName(user?.name) || user?.nickname || user?.given_name || "Usuario");
      saveToSession('user_email', user?.email || "");
      saveToSession('user_picture', user?.picture || "");
      saveToSession('user_telefono', createResponse.data.telefono || "");

      setAuthStatus('completed');
      processedUserRef.current = userData.auth0Id || null;

      return { success: true, data: createResponse.data };
    } catch (error: any) {
      setAuthStatus('completed');
      console.error("[useAuthHandler] Error en createUser:", error?.response?.data || error);
      throw error;
    }
  }, [dispatch, getAccessTokenSilently, user]);

  // LOGIN TRADICIONAL (debug)
  const loginTraditional = useCallback(async (email: string, password: string) => {
    try {
      console.log("[useAuthHandler] loginTraditional llamado con:", email);
      const loginResponse = await interceptorApiClient.post('/api/clientes/login', {
        email, password
      });

      const { token, cliente } = loginResponse.data;

      dispatch(setToken(token));
      dispatch(setRol('Cliente'));
      saveToSession('auth_token', token);
      saveToSession('user_role', 'Cliente');
      saveToSession('auth_completed', 'true');
      saveToSession('user_name', getFirstName(user?.name) || user?.nickname || user?.given_name || "Usuario");
      saveToSession('user_email', user?.email || "");
      saveToSession('user_picture', user?.picture || "");
      saveToSession('user_telefono', cliente.telefono || "");

      return { success: true, cliente };
    } catch (error: any) {
      console.error("[useAuthHandler] Error en loginTraditional:", error?.response?.data || error);
      throw error;
    }
  }, [dispatch, user]);

  // REGISTRO TRADICIONAL (debug)
  const registerTraditional = useCallback(async (userData: {
    nombreCompleto: string;
    telefono: string;
    email: string;
    password: string;
  }) => {
    try {
      console.log("[useAuthHandler] registerTraditional llamado con:", userData);
      return await createUser({ ...userData, isGoogleUser: false });
    } catch (error: any) {
      console.error("[useAuthHandler] Error en registerTraditional:", error?.response?.data || error);
      throw error;
    }
  }, [createUser]);

  // MANEJAR AUTH USER (debug)
  const handleAuthUser = useCallback(async () => {
    if (isLoading || !isAuthenticated || !user || isProcessingRef.current) return;

    if (processedUserRef.current === user.sub && authStatus === 'completed') {
      console.log("[useAuthHandler] Usuario ya procesado:", user.sub);
      return;
    }

    const savedToken = getFromSession('auth_token');
    const savedRole = getFromSession('user_role');
    if (savedToken && savedRole) {
      console.log("[useAuthHandler] Token y rol ya en sessionStorage");
      return;
    }

    isProcessingRef.current = true;

    try {
      const rol = user[`${import.meta.env.VITE_AUTH0_AUDIENCE}/roles`]?.[0];
      console.log("[useAuthHandler] Rol detectado en user:", rol);

      if (rol) {
        const token = await getAccessTokenSilently();
        dispatch(setToken(token));
        dispatch(setRol(rol));
        saveToSession('auth_token', token);
        saveToSession('user_role', rol);
        saveToSession('auth_completed', 'true');
        saveToSession('user_name', getFirstName(user?.name) || user?.nickname || user?.given_name || "Usuario");
        saveToSession('user_email', user?.email || "");
        saveToSession('user_picture', user?.picture || "");
        processedUserRef.current = user.sub;
        setAuthStatus('completed');
        console.log("[useAuthHandler] Rol desde Auth0, acceso directo");
        return;
      }

      // Verificar si usuario existe en BD
      try {
        console.log("[useAuthHandler] Buscando usuario en BD por email:", user.email);
        const response = await interceptorApiClient.get(`/api/clientes/email/${user.email}`);
        console.log("[useAuthHandler] Usuario encontrado en BD:", response.data);

        const token = await getAccessTokenSilently();

        const userRole = response.data?.usuario?.roles?.length > 0
          ? response.data.usuario.roles[0].nombre
          : "Cliente";

        dispatch(setToken(token));
        dispatch(setRol(userRole));
        saveToSession('auth_token', token);
        saveToSession('user_role', userRole);
        saveToSession('auth_completed', 'true');
        saveToSession('user_name', getFirstName(user?.name) || user?.nickname || user?.given_name || "Usuario");
        saveToSession('user_email', user?.email || "");
        saveToSession('user_picture', user?.picture || "");
        saveToSession('user_id_db', response.data.id);
        saveToSession('user_telefono', response.data.telefono || "");
        processedUserRef.current = user.sub;
        setAuthStatus('completed');
        console.log("[useAuthHandler] Usuario encontrado en BD, acceso por BD");
      } catch (userError: any) {
        console.log("userError completo:", userError);
        const is404Error = (userError.response && userError.response.status === 404) ||
          (userError.message && (
            userError.message.includes("404") ||
            userError.message.toLowerCase().includes("not found")
          ));

        console.log('Error: ' + is404Error);
        console.error("[useAuthHandler] Error buscando usuario en BD:", userError?.response?.data || userError);

        if (is404Error) {
          console.log("[useAuthHandler] Usuario no existe en BD, creando usuario...");
          const createResult = await createUser({
            email: user.email,
            nombreCompleto: user.name || user.email,
            telefono: user.phone_number || "",
            auth0Id: user.sub,
            isGoogleUser: true
          });
          if (createResult?.data?.id) {
            saveToSession('user_id_db', createResult.data.id);
            console.log("[useAuthHandler] Usuario creado, id:", createResult.data.id);
          } else {
            console.warn("[useAuthHandler] Usuario creado pero no se recibió id en la respuesta:", createResult);
          }
          console.log("[useAuthHandler] Usuario creado");
          return;
        } else {
          throw userError;
        }
      }

    } catch (error: any) {
      console.error("[useAuthHandler] Error general en handleAuthUser:", error?.response?.data || error);
      const token = await getAccessTokenSilently();
      dispatch(setToken(token));
      dispatch(setRol("Cliente"));
      saveToSession('auth_token', token);
      saveToSession('user_role', 'Cliente');
      saveToSession('auth_completed', 'true');
      saveToSession('user_name', getFirstName(user?.name) || user?.nickname || user?.given_name || "Usuario");
      saveToSession('user_email', user?.email || "");
      saveToSession('user_picture', user?.picture || "");
      setAuthStatus('completed');
      console.log("[useAuthHandler] Fallback acceso como Cliente");
    } finally {
      isProcessingRef.current = false;
    }
  }, [isAuthenticated, isLoading, user, dispatch, getAccessTokenSilently, createUser, authStatus]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log("[useAuthHandler] No autenticado (Auth0 listo), limpiando sessionStorage");
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
        console.error("[useAuthHandler] Error en effect principal:", e?.response?.data || e);
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
    loginTraditional,
    registerTraditional
  };
};