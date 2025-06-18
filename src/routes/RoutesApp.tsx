import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../auth/ProtectedRoute';
import DetalleCompra from '../pages/detalleCompra';
import Landing from "../pages/Landing"
import Menu from '../pages/MenuPage';
import MiPerfilUsuarioPage from '../pages/MiPerfilUsuarioPage';
import PedidosCocinero from '../pages/pedidosCocinero';
import { ScreenInsumo } from '../pages/ScreenInsumo';
import Configuracion from '../pages/admin/Configuracion';
import { ScreenProducto } from '../pages/ScreenProducto';
import MisPedidos from '../pages/MisPedidos';
import MisDirecciones from '../pages/misDirecciones';
import SuccessMP from '../pages/SuccessMP';
import FailureMP from '../pages/FailureMP';
import { PantallaCajero } from '../pages/admin/PantallaCajero';
import { CallbackPage } from '../pages/CallBackPage';
import { LoginRedirect } from '../pages/LoginWithRedirect';

const RoutesApp = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Landing />} />
      <Route path="/Menu" element={<Menu />} />
      <Route path="/callback" element={<CallbackPage />} />
      <Route path="/login-redirect" element={<LoginRedirect />} />

      {/* Rutas privadas para clientes */}
      <Route
        path="/DetalleCompra"
        element={
          <ProtectedRoute allowedRoles={['Cliente']}>
            <DetalleCompra />
          </ProtectedRoute>
        }
      />
      <Route
        path="/MisDirecciones"
        element={
          <ProtectedRoute allowedRoles={['Cliente']}>
            <MisDirecciones />
          </ProtectedRoute>
        }
      />
      <Route
        path='/MisPedidos'
        element={
          <ProtectedRoute allowedRoles={['Cliente']}>
            <MisPedidos />
          </ProtectedRoute>
        }
      />
      <Route
        path='/Success'
        element={
          <ProtectedRoute allowedRoles={['Cliente']}>
            <SuccessMP />
          </ProtectedRoute>
        }
      />
      <Route
        path='/Failure'
        element={
          <ProtectedRoute allowedRoles={['Cliente']}>
            <FailureMP />
          </ProtectedRoute>
        }
      />
      <Route
        path="/MiPerfil"
        element={
          <ProtectedRoute allowedRoles={['Cliente']}>
            <MiPerfilUsuarioPage />
          </ProtectedRoute>
        }
      />

      {/* Rutas para empleados/admin */}
      <Route
        path="/admin/PedidosCocinero"
        element={
          <ProtectedRoute allowedRoles={['Cocinero', 'Admin', 'SuperAdmin']}>
            <PedidosCocinero />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/Insumos"
        element={
          <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
            <ScreenInsumo />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/productos"
        element={
          <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
            <ScreenProducto />
          </ProtectedRoute>
        }
      />
      <Route
        path='/admin/Configuracion'
        element={
          <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
            <Configuracion />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/PantallaCajero"
        element={
          <ProtectedRoute allowedRoles={['Cajero', 'Admin', 'SuperAdmin']}>
            <PantallaCajero />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default RoutesApp;