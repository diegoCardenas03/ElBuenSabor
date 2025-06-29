import { useInactivityLogout } from "../hooks/useInactivityLogout";
import RoutesApp from "../routes/RoutesApp";

export default function AppWrapper() {
  useInactivityLogout();
  return <RoutesApp />;
}