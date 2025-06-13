import { Routes, Route } from 'react-router-dom';
import Landing from "../pages/Landing";
import Menu from '../pages/MenuPage';

export const PublicRoutes = () => {
  return (
    <>
      <Route path="/" element={<Landing />} />
      <Route path="/Menu" element={<Menu />} />
    </>
  );
};