import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import LoginPage        from '../pages/Auth/Login';
import DashboardPage    from '../pages/Dashboard/Dashboard';
import ProductesPage    from '../pages/Productes/Productes';
import ProveidorsPage   from '../pages/Proveidors/Proveidors';
import AlbaransPage     from '../pages/Albaran/AlbaransList';
import InventariPage    from '../pages/Estoc/Inventari';
import TracabilitatPage from '../pages/Estoc/Tracabilitat';
import ReceptesPage     from '../pages/Receptes/ReceptesList';
import ReceptaForm     from '../pages/Receptes/ReceptaForm';

function PrivateRoute() {
  const { token } = useAuth();
  return token ? <Layout /> : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { isAdmin } = useAuth();
  return isAdmin ? children : <Navigate to="/" replace />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<PrivateRoute />}>
          <Route index          element={<DashboardPage />} />
          <Route path="productes"    element={<ProductesPage />} />
          <Route path="proveidors"   element={<ProveidorsPage />} />
          <Route path="albarans"     element={<AlbaransPage />} />
          <Route path="stock"        element={<InventariPage />} />
          <Route path="receptes"     element={<ReceptesPage />} />
          <Route path="receptes/:id" element={<ReceptaForm />} />
          <Route path="tracabilitat" element={<TracabilitatPage />} />
          <Route path="usuaris"      element={<AdminRoute><div>Usuaris (pendent)</div></AdminRoute>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}