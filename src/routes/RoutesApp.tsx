import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Configuracion from '../pages/admin/Configuracion';  
import DetalleCompra from '../pages/detalleCompra';
import MisDirecciones from '../pages/misDirecciones';
import Landing from "../pages/Landing"
import Menu from '../pages/MenuPage';
import PedidosCocinero from '../pages/pedidosCocinero';
import MisPedidos from '../pages/MisPedidos';


// Pantallas de Administradores


const RoutesApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />}/> 
        <Route path="/DetalleCompra" element={<DetalleCompra />} /> 
        <Route path="/MisDirecciones" element={<MisDirecciones />} />
        <Route path="/Menu" element={<Menu />} />
        <Route path="/MisPedidos" element={<MisPedidos />} />
        
        {/* Pantallas de Clientes */}
        
        {/* Pantallas de Administradores */}
        <Route path='/admin/Configuracion' element={<Configuracion />} />
        <Route path="/PedidosCocinero" element={<PedidosCocinero />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesApp;