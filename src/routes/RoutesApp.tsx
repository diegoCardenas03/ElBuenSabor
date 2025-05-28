import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Configuracion from '../pages/admin/Configuracion';  
import DetalleCompra from '../pages/detalleCompra';
import MisDirecciones from '../pages/misDirecciones';
import Landing from "../pages/Landing"
import Menu from '../pages/MenuPage';
import PedidosCocinero from '../pages/pedidosCocinero';
<<<<<<< Updated upstream


// Pantallas de Administradores


=======
import { ScreenInsumo } from '../pages/ScreenInsumo';
import Configuracion from '../pages/admin/Configuracion';
>>>>>>> Stashed changes
const RoutesApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />}/> 
        <Route path="/DetalleCompra" element={<DetalleCompra />} /> 
        <Route path="/MisDirecciones" element={<MisDirecciones />} />
        <Route path="/Menu" element={<Menu />} />
        
        {/* Pantallas de Administradores */}
        <Route path='/admin/Configuracion' element={<Configuracion />} />
        <Route path="/PedidosCocinero" element={<PedidosCocinero />} />
<<<<<<< Updated upstream
=======
        <Route path="/Insumos" element={<ScreenInsumo />} />
        <Route path='/admin/Configuracion' element={<Configuracion />} />
>>>>>>> Stashed changes
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesApp;