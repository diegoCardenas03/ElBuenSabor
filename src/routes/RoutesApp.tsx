import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { Header } from '../components/Header';  
import DetalleCompra from '../pages/detalleCompra';
// import MisDirecciones from '../pages/misDirecciones';
import Landing from "../pages/Landing"
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

import { PantallaCajero } from '../pages/admin/PantallaCajero';
const RoutesApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />}/> 
        <Route path="/DetalleCompra" element={<DetalleCompra />} /> 
        {/* <Route path="/MisDirecciones" element={<MisDirecciones />} /> */}
        <Route path="/Menu" element={<Menu />} />
        <Route path='/MisPedidos' element={<MisPedidos />} />
        <Route path='/Success' element={<SuccessMP/>}/>
        <Route path='/Failure' element={<FailureMP/>}/>
        <Route path="/MiPerfil" element={<MiPerfilUsuarioPage />} />
        <Route path="/PedidosCocinero" element={<PedidosCocinero />} />
        <Route path="/admin/Insumos" element={<ScreenInsumo />} />
        <Route path="/admin/productos" element={<ScreenProducto />} />
        <Route path='/admin/Configuracion' element={<Configuracion />} />
        <Route path="/admin/PantallaCajero" element={<PantallaCajero />} />
        
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesApp;