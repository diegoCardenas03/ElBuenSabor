import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../auth/ProtectedRoute';
import PedidosCocinero from '../pages/pedidosCocinero';
import { ScreenInsumo } from '../pages/ScreenInsumo';
import Configuracion from '../pages/admin/Configuracion';
import { ScreenProducto } from '../pages/ScreenProducto';
import { PantallaCajero } from '../pages/admin/PantallaCajero';

export const AdminRoutes = () => {
  return (
    <Routes>
      <Route 
        path="/admin/PedidosCocinero" 
        element={
          <ProtectedRoute allowedRoles={['Cocinero', 'Admin']}>
            <PedidosCocinero />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/Insumos" 
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <ScreenInsumo />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/productos" 
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <ScreenProducto />
          </ProtectedRoute>
        } 
      />
      <Route 
        path='/admin/Configuracion' 
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <Configuracion />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/PantallaCajero" 
        element={
          <ProtectedRoute allowedRoles={['Cajero', 'Admin']}>
            <PantallaCajero />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};