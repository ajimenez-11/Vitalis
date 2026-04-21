import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import LoginPage       from '../pages/LoginPage';
import DashboardPage   from '../pages/DashboardPage';
import ProductesPage   from '../pages/ProductesPage';
import ProveidorsPage  from '../pages/ProveidorsPage';
import AlbaransPage    from '../pages/AlbaransPage';
import AlbaranDetall   from '../pages/AlbaranDetall';
import StockPage       from '../pages/StockPage';
import ReceptesPage    from '../pages/ReceptesPage';
import ReceptaDetall   from '../pages/ReceptaDetall';
import TracabilitatPage from '../pages/TracabilitatPage';
import UsuarisPage     from '../pages/UsuarisPage';
import Layout          from '../components/Layout';

// Guard per rutes autenticades
function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

// Guard per rutes només admin
function AdminRoute({ children }) {
  const { isAdmin } = useAuth();
  return isAdmin ? children : <Navigate to="/" replace />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<DashboardPage />} />
          <Route path="productes"     element={<ProductesPage />} />
          <Route path="proveidors"    element={<ProveidorsPage />} />
          <Route path="albarans"      element={<AlbaransPage />} />
          <Route path="albarans/:id"  element={<AlbaranDetall />} />
          <Route path="stock"         element={<StockPage />} />
          <Route path="receptes"      element={<ReceptesPage />} />
          <Route path="receptes/:id"  element={<ReceptaDetall />} />
          <Route path="tracabilitat"  element={<TracabilitatPage />} />
          <Route path="usuaris" element={
            <AdminRoute><UsuarisPage /></AdminRoute>
          } />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}