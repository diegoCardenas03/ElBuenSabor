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
const RoutesApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />}/> 
        <Route path="/DetalleCompra" element={<DetalleCompra />} /> 
        {/* <Route path="/MisDirecciones" element={<MisDirecciones />} /> */}
        <Route path="/Menu" element={<Menu />} />
        <Route path="/MiPerfil" element={<MiPerfilUsuarioPage />} />
        <Route path="/PedidosCocinero" element={<PedidosCocinero />} />
        <Route path="/admin/Insumos" element={<ScreenInsumo />} />
        <Route path="/admin/productos" element={<ScreenProducto />} />
        <Route path='/admin/Configuracion' element={<Configuracion />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesApp;