import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../auth/ProtectedRoute';
import DetalleCompra from '../pages/detalleCompra';
import MiPerfilUsuarioPage from '../pages/MiPerfilUsuarioPage';
import MisPedidos from '../pages/MisPedidos';
import MisDirecciones from '../pages/misDirecciones';
import FailureMP from '../pages/FailureMP';
import SuccessMP from '../pages/SuccessMP';

export const PrivateRoutes = () => {
  return (
    <Routes>
      {/* Rutas para usuarios */}
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
        path="/MiPerfil" 
        element={
          <ProtectedRoute allowedRoles={['Cliente']}>
            <MiPerfilUsuarioPage />
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
        path="/Failure" 
        element={
          <ProtectedRoute allowedRoles={['Cliente']}>
            <FailureMP />
          </ProtectedRoute>
        } 
      />
       <Route 
        path="/Sucess" 
        element={
          <ProtectedRoute allowedRoles={['Cliente']}>
            <SuccessMP />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};