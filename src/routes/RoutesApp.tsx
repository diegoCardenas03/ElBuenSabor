import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from '../components/Header';  
import DetalleCompra from '../pages/detalleCompra';
import MisDirecciones from '../pages/misDirecciones';

const RoutesApp = () => {
  return (
    <BrowserRouter>
      <Header></Header>
      <Routes>
        <Route path="/" /> 
        <Route path="/DetalleCompra" element={<DetalleCompra />} /> 
        <Route path="/MisDirecciones" element={<MisDirecciones />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesApp;