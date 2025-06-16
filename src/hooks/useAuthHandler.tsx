import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { setToken, setRol, clearAuth } from "../hooks/redux/slices/AuthReducer";
import { interceptorApiClient } from '../interceptors/Axios.interceptor'
import { UsuarioDTO } from "../types/Usuario/UsuarioDTO";
import { ClienteDTO } from "../types/Cliente/ClienteDTO";

export const useAuthHandler = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [authStatus, setAuthStatus] = useState<'idle' | 'checking' | 'completed' | 'creating-user'>('idle');
  const dispatch = useDispatch();

  const isProcessingRef = useRef(false);
  const processedUserRef = useRef<string | null | undefined>(null);
  // ✅ NUEVO: Flag para evitar re-ejecución después de crear usuario
  const userCreatedRef = useRef(false);

  // ✅ FUNCIÓN CENTRALIZADA: Crear usuario (Google o tradicional)
  const createUser = useCallback(async (userData: {
    email?: string;
    nombreCompleto?: string;
    telefono?: string;
    password?: string;
    auth0Id?: string;
    isGoogleUser?: boolean;
  }) => {
    try {

      if (!userData.isGoogleUser) {
        setAuthStatus('creating-user');
      }

      // 1. Obtener rol Cliente
      const roleResponse = await interceptorApiClient.get('/api/admin/roles');
      const clienteRole = roleResponse.data.find((role: any) => role.nombre === 'Cliente');

      if (!clienteRole?.auth0RolId) {
        throw new Error('Rol Cliente no encontrado');
      }

      // 2. Preparar datos del usuario
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

      // 3. Crear cliente en BD
      const createResponse = await interceptorApiClient.post("/api/clientes/save", clienteDTO);
      console.log('Usuario creado exitosamente:', createResponse.data);

      // 4. Manejar token según el tipo de usuario
      if (userData.isGoogleUser && userData.auth0Id) {
        // Usuario Google: obtener token de Auth0
        const newToken = await getAccessTokenSilently({ cacheMode: "off" });
        dispatch(setToken(newToken));
      } else {
        // Usuario tradicional: hacer login automático
        const loginResponse = await interceptorApiClient.post('/api/clientes/login', {
          email: userData.email,
          password: userData.password
        });

        const { token } = loginResponse.data;
        dispatch(setToken(token));
      }

      dispatch(setRol("Cliente"));

      // ✅ NUEVO: Marcar que el usuario fue creado exitosamente
      if (userData.isGoogleUser) {
        userCreatedRef.current = true;
        processedUserRef.current = userData.auth0Id;
      }

      setAuthStatus('completed');

      return {
        success: true,
        data: createResponse.data
      };

    } catch (error: any) {
      console.error('Error creando usuario:', error);
      setAuthStatus('completed');
      throw error;
    }
  }, [dispatch, getAccessTokenSilently]);

  // ✅ FUNCIÓN ESPECÍFICA: Login tradicional
  const loginTraditional = useCallback(async (email: string, password: string) => {
    try {
      const loginResponse = await interceptorApiClient.post('/api/clientes/login', {
        email,
        password
      });

      const { token, cliente } = loginResponse.data;

      dispatch(setToken(token));
      dispatch(setRol('Cliente'));

      return {
        success: true,
        cliente
      };
    } catch (error: any) {
      console.error('Error en login tradicional:', error);
      throw error;
    }
  }, [dispatch]);

  // ✅ FUNCIÓN DE REGISTRO: Registro tradicional completo
  const registerTraditional = useCallback(async (userData: {
    nombreCompleto: string;
    telefono: string;
    email: string;
    password: string;
  }) => {
    try {
      // Crear usuario
      const result = await createUser({
        ...userData,
        isGoogleUser: false
      });

      return result;
    } catch (error: any) {
      throw error;
    }
  }, [createUser]);

  // Línea 125 - Modifica handleAuthUser:
  const handleAuthUser = useCallback(async () => {
    if (isLoading || !isAuthenticated || !user) return;

    if (userCreatedRef.current && processedUserRef.current === user.sub) {
      console.log('Usuario ya fue creado, evitando re-procesamiento');
      return;
    }

    if (isProcessingRef.current || processedUserRef.current === user.sub) {
      console.log('Ya procesando usuario o usuario ya procesado:', user.sub);
      return;
    }

    isProcessingRef.current = true;
    // setAuthStatus('checking');

    try {
      // ✅ CAMBIO: NO obtener token hasta verificar/crear usuario
      // const token = await getAccessTokenSilently();
      // dispatch(setToken(token));

      const rol = user[`${import.meta.env.VITE_AUTH0_AUDIENCE}/roles`]?.[0];

      if (rol) {
        console.log('Usuario ya tiene rol en Auth0:', rol);
        // ✅ AQUÍ SÍ obtener token porque ya existe
        const token = await getAccessTokenSilently();
        dispatch(setToken(token));
        dispatch(setRol(rol));
        processedUserRef.current = user.sub;
        setAuthStatus('completed');
        return;
      }

      try {
        // ✅ CAMBIO: Buscar usuario SIN token primero
        const response = await interceptorApiClient.get(
          `/api/clientes/email/${user.email}`
        );

        console.log('Usuario encontrado en BD:', response.data);

        // ✅ AQUÍ SÍ obtener token porque el usuario ya existe en BD
        const token = await getAccessTokenSilently();
        dispatch(setToken(token));

        if (response.data?.usuario?.roles?.length > 0) {
          dispatch(setRol(response.data.usuario.roles[0].nombre));
        } else {
          dispatch(setRol("Cliente"));
        }

        processedUserRef.current = user.sub;

      } catch (userError: any) {
        const is404Error =
          userError.response?.status === 404 ||
          userError.statusCode === 404 ||
          userError.message?.includes('404') ||
          userError.message?.includes('not found') ||
          userError.message?.includes('could not be found');

        if (is404Error) {
          console.log('Usuario Google no existe, creando...');
          // setAuthStatus('creating-user');

          try {
            await createUser({
              email: user.email,
              nombreCompleto: user.name || user.email,
              telefono: user.phone_number || "",
              auth0Id: user.sub,
              isGoogleUser: true
            });

            // console.log('Usuario Google creado exitosamente');
            // ✅ El token ya se estableció dentro de createUser
            return;

          } catch (createError: any) {
            console.error('Error al crear usuario Google:', createError);
            // ✅ En caso de error, establecer token y rol por defecto
            const token = await getAccessTokenSilently();
            dispatch(setToken(token));
            dispatch(setRol("Cliente"));
            processedUserRef.current = user.sub;
          }
        } else {
          console.error('Error inesperado verificando usuario:', userError);
          const token = await getAccessTokenSilently();
          dispatch(setToken(token));
          dispatch(setRol("Cliente"));
          processedUserRef.current = user.sub;
        }
      }

      setAuthStatus('completed');

    } catch (error: any) {
      console.error('Error general en autenticación:', error);
      const token = await getAccessTokenSilently();
      dispatch(setToken(token));
      dispatch(setRol("Cliente"));
      setAuthStatus('completed');
      processedUserRef.current = user.sub;
    } finally {
      isProcessingRef.current = false;
    }
  }, [isAuthenticated, isLoading, user, dispatch, getAccessTokenSilently, createUser]);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(clearAuth());
      setAuthStatus('completed');
      isProcessingRef.current = false;
      processedUserRef.current = null;
      // ✅ NUEVO: Resetear flag de usuario creado
      userCreatedRef.current = false;
      return;
    }

    handleAuthUser().catch((error) => {
      console.error('Error no manejado en handleAuthUser:', error);
      dispatch(setRol("Cliente"));
      setAuthStatus('completed');
    });
  }, [isAuthenticated, handleAuthUser, dispatch]);

  useEffect(() => {
    if (user?.sub && processedUserRef.current && processedUserRef.current !== user.sub) {
      console.log('Usuario cambió, reseteando referencias');
      processedUserRef.current = null;
      isProcessingRef.current = false;
      // ✅ NUEVO: Resetear flag de usuario creado
      userCreatedRef.current = false;
    }
  }, [user?.sub]);

  return {
    authStatus,
    isAuthenticated,
    isCreatingUser: authStatus === 'creating-user',
    isProcessing: authStatus === 'checking' || authStatus === 'creating-user',
    // ✅ NUEVAS FUNCIONES EXPORTADAS
    createUser,
    loginTraditional,
    registerTraditional
  };
};