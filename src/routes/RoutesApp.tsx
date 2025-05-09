import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Configuracion from '../pages/admin/Configuracion';  
import DetalleCompra from '../pages/detalleCompra';
import MisDirecciones from '../pages/misDirecciones';
import Landing from "../pages/Landing"
import Menu from '../pages/MenuPage';


// Pantallas de Administradores


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
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesApp;