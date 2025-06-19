import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthHandler } from "../hooks/useAuthHandler";
import { Loader } from "../components/commons/Loader";
import ModalUserExtraData from "../components/modals/ModalExtraData";
import { useAppSelector } from "../hooks/redux";

export const LoginRedirect = () => {
  const navigate = useNavigate();
  const { authStatus, isAuthenticated, isProcessing } = useAuthHandler();
  const [showExtraDataModal, setShowExtraDataModal] = useState(false);
  const clienteId = useAppSelector((state) => state.auth.userId);

 

  useEffect(() => {
    console.log("[LoginRedirect] Estado actual:", { authStatus, isAuthenticated, isProcessing });

    // Si no está autenticado, redirigir al login
    if (!isAuthenticated && authStatus === 'completed') {
      console.log("[LoginRedirect] No autenticado, redirigiendo a login");
      navigate("/login");
      return;
    }

    // Si la autenticación está completa y exitosa
    if (authStatus === 'completed' && isAuthenticated) {
      console.log("[LoginRedirect] Autenticación completada exitosamente");



      // Verificar si necesita datos adicionales
      const userTelefono = sessionStorage.getItem('user_telefono');

      

      console.log("[LoginRedirect] Datos del usuario:", { clienteId, userTelefono });

      if (clienteId && (!userTelefono || userTelefono === "")) {
        console.log("[LoginRedirect] Usuario necesita completar datos adicionales");
        setShowExtraDataModal(true);
      } else {
        console.log("[LoginRedirect] Usuario completo, redirigiendo a home");
        navigate("/");
      }
    }
  }, [authStatus, isAuthenticated, navigate]);

  const handleExtraDataComplete = () => {
    console.log("[LoginRedirect] Datos adicionales completados");
    setShowExtraDataModal(false);
    navigate("/");
  };

  // Mostrar loader mientras se procesa la autenticación
  if (isProcessing || authStatus === 'checking' || authStatus === 'creating-user') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <Loader />
        <div className="mt-4 text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            {authStatus === 'checking' && "Verificando usuario..."}
            {authStatus === 'creating-user' && "Creando perfil de usuario..."}
            {isProcessing && authStatus === 'idle' && "Procesando autenticación..."}
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            <Loader message="Por favor espera un momento" />

          </p>
        </div>
      </div>
    );
  }

  // Mostrar modal de datos adicionales si es necesario
  if (showExtraDataModal && clienteId) {
    return (
      <ModalUserExtraData
        clienteId={parseInt(clienteId)}
        onComplete={handleExtraDataComplete}
      />
    );
  }

  // Estado por defecto mientras se determina el siguiente paso
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Loader />
      <div className="mt-4 text-center">
        <h2 className="text-xl font-semibold text-gray-700">
          Finalizando inicio de sesión...
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          Redirigiendo...
        </p>
      </div>
    </div>
  );
};