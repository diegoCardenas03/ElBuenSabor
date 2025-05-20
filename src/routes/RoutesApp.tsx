import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from '../components/Header';  
import DetalleCompra from '../pages/detalleCompra';
import MisDirecciones from '../pages/misDirecciones';
import Landing from "../pages/Landing"
import Menu from '../pages/MenuPage';
import PedidosCocinero from '../pages/pedidosCocinero';

const RoutesApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />}/> 
        <Route path="/DetalleCompra" element={<DetalleCompra />} /> 
        <Route path="/MisDirecciones" element={<MisDirecciones />} />
        <Route path="/Menu" element={<Menu />} />
        <Route path="/PedidosCocinero" element={<PedidosCocinero />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesApp;