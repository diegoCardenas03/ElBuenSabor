import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DetalleCompra from '../pages/detalleCompra';
import Landing from "../pages/Landing";
import Menu from '../pages/MenuPage';
import MiPerfilUsuarioPage from '../pages/MiPerfilUsuarioPage';
import PedidosCocinero from '../pages/pedidosCocinero';
import { ScreenInsumo } from '../pages/ScreenInsumo';
import Configuracion from '../pages/admin/Configuracion';
import { ScreenProducto } from '../pages/ScreenProducto';
import MisPedidos from '../pages/MisPedidos';
import MisDirecciones from '../pages/misDirecciones';
import { MiPerfilEmpleadoPage } from '../pages/MiPerfilEmpleadoPage';
import SuccessMP from '../pages/SuccessMP';
import FailureMP from '../pages/FailureMP';
import Delivery from '../pages/admin/Delivery';
import EstadisticaWithBoundary from '../pages/admin/Estadistica';
import ProductosEstadistica from '../pages/admin/ProductosEstadistica';
import { ScreenPromocion } from '../pages/admin/ScreenPromocion';
import { PantallaCajero } from '../pages/admin/PantallaCajero';
import Clientes from '../pages/admin/Clientes';
import Empleados from '../pages/admin/Empleados';
import ClientesEstadisticas from '../pages/admin/ClientesEstadisticas';

const RoutesApp = () => {
  return (
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
        <Route path='/admin/Estadistica' element={<EstadisticaWithBoundary />} />
        <Route path="/admin/ProductosEstadistica" element={<ProductosEstadistica />} />
        <Route path="/admin/ClientesEstadistica/:clienteId" element={<ClientesEstadisticas />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesApp;