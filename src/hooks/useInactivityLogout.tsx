import { useEffect, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { clearSession } from "./useAuthHandler";
import Swal from "sweetalert2";

const INACTIVITY_LIMIT = 45 * 60 * 1000; // 45 minutos
const WARNING_TIME =  2 * 60 * 1000; // 2 minutos antes del logout

export function useInactivityLogout() {
  const { logout, isAuthenticated } = useAuth0();
  const timer = useRef<NodeJS.Timeout | null>(null);
  const warningTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const startTimers = () => {
      // Limpia timers previos
      if (timer.current) clearTimeout(timer.current);
      if (warningTimer.current) clearTimeout(warningTimer.current);

      // Timer para mostrar el warning
      warningTimer.current = setTimeout(() => {
        Swal.fire({
          title: "¿Sigues ahí?",
          text: "Tu sesión está a punto de expirar por inactividad.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "¡Sigo aquí!",
          cancelButtonText: "Cerrar sesión",
          allowOutsideClick: false,
          confirmButtonColor: "#FF9D3A",
          cancelButtonColor: "#BD1E22",
        }).then((result) => {
          if (result.isConfirmed) {
            // Usuario sigue activo, reinicia timers
            startTimers();
          } else {
            // Usuario no respondió o canceló, cerrar sesión
            clearSession();
            logout();
          }
        });
      }, INACTIVITY_LIMIT - WARNING_TIME);

      // Timer para cerrar sesión automáticamente
      timer.current = setTimeout(() => {
        clearSession();
        logout();
      }, INACTIVITY_LIMIT);
    };

    // Eventos que reinician el temporizador
    const resetTimers = () => startTimers();
    const events = ["mousemove", "keydown", "mousedown", "touchstart"];
    events.forEach(event =>
      window.addEventListener(event, resetTimers)
    );

    startTimers();

    return () => {
      if (timer.current) clearTimeout(timer.current);
      if (warningTimer.current) clearTimeout(warningTimer.current);
      events.forEach(event =>
        window.removeEventListener(event, resetTimers)
      );
    };
  }, [isAuthenticated, logout]);
}