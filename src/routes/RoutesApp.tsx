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
import Delivery from '../pages/admin/Delivery';
import { Estadistica } from '../pages/admin/Estadistica';

import { ScreenPromocion } from '../pages/admin/ScreenPromocion';
import { PantallaCajero } from '../pages/admin/PantallaCajero';
import Clientes from '../pages/admin/Clientes';
import Empleados from '../pages/admin/Empleados';
import { CallbackPage } from '../pages/CallBackPage';
import { LoginRedirect } from '../pages/LoginWithRedirect';
import { MiPerfilEmpleadoPage } from '../pages/MiPerfilEmpleadoPage';
import { PublicRoute } from './PublicRoute';

const RoutesApp = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/"
        element={<PublicRoute> <Landing /> </PublicRoute>} />
      <Route path="/Menu" element={<PublicRoute><Menu /></PublicRoute>} />
      <Route path="/callback" element={<PublicRoute><CallbackPage /></PublicRoute>} />
      <Route path="/login-redirect" element={<PublicRoute><LoginRedirect /></PublicRoute>} />

      {/* Rutas privadas para clientes */}
      <Route
        path="/DetalleCompra"
        element={
          <ProtectedRoute allowedRoles={['Cliente', 'SuperAdmin']}>
            <DetalleCompra />
          </ProtectedRoute>
        }
      />
      <Route
        path="/MisDirecciones"
        element={
          <ProtectedRoute allowedRoles={['SuperAdmin']}>
            <MisDirecciones />
          </ProtectedRoute>
        }
      />
      <Route
        path='/MisPedidos'
        element={
          <ProtectedRoute allowedRoles={['Cliente', 'SuperAdmin']}>
            <MisPedidos />
          </ProtectedRoute>
        }
      />
      <Route
        path='/Success'
        element={
          <ProtectedRoute allowedRoles={['Cliente', 'SuperAdmin']}>
            <SuccessMP />
          </ProtectedRoute>
        }
      />
      <Route
        path='/Failure'
        element={
          <ProtectedRoute allowedRoles={['Cliente', 'SuperAdmin']}>
            <FailureMP />
          </ProtectedRoute>
        }
      />
      <Route
        path="/MiPerfil"
        element={
          <ProtectedRoute allowedRoles={['Cliente', 'SuperAdmin']}>
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
          <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin', 'Cocinero']}>
            <ScreenInsumo />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/productos"
        element={
          <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin', 'Cocinero']}>
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
      <Route
        path="/admin/Delivery"
        element={
          <ProtectedRoute allowedRoles={['Cajero', 'Delivery', 'Admin', 'SuperAdmin']}>
            <Delivery />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/Promociones"
        element={
          <ProtectedRoute allowedRoles={['Cajero', 'Delivery', 'Admin', 'SuperAdmin']}>
            <ScreenPromocion />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/MiPerfil"
        element={
          <ProtectedRoute allowedRoles={['SuperAdmin', 'Admin', 'Cocinero', 'Delivery', 'Cajero']}>
            <MiPerfilEmpleadoPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/Empleados"
        element={
          <ProtectedRoute allowedRoles={['SuperAdmin' , 'Admin']}>
            <Empleados />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/Clientes"
        element={
          <ProtectedRoute allowedRoles={['SuperAdmin', 'Admin']}>
            <Clientes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/Estadistica"
        element={
          <ProtectedRoute allowedRoles={['SuperAdmin', 'Admin']}>
            <Estadistica />
          </ProtectedRoute>
        }
      />
    </Routes>

    /*  
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />}/> 
        <Route path="/DetalleCompra" element={<DetalleCompra />} /> 
        <Route path="/MisDirecciones" element={<MisDirecciones />} /> 
        <Route path="/Menu" element={<Menu />} />
        <Route path='/MisPedidos' element={<MisPedidos />} />
        <Route path='/Success' element={<SuccessMP/>}/>
        <Route path='/Failure' element={<FailureMP/>}/>
        <Route path="/MiPerfil" element={<MiPerfilUsuarioPage />} />
        <Route path='/admin/MiPerfil' element={<MiPerfilEmpleadoPage/>}/>
        <Route path="/admin/PedidosCocinero" element={<PedidosCocinero />} />
        <Route path="/admin/Insumos" element={<ScreenInsumo />} />
        <Route path="/admin/Productos" element={<ScreenProducto />} />
        <Route path='/admin/Configuracion' element={<Configuracion />} />
        <Route path="/admin/PantallaCajero" element={<PantallaCajero />} />
        <Route path="/admin/Clientes" element={<Clientes />} />
        <Route path="/admin/Empleados" element={<Empleados />} />
        <Route path="/admin/Promociones" element={<ScreenPromocion />} />
        
        <Route path='/admin/Delivery' element={<Delivery />} />
        <Route path='/admin/Estadistica' element={<Estadistica />} />
      </Routes>
    </BrowserRouter>
    */
  );
};

export default RoutesApp;