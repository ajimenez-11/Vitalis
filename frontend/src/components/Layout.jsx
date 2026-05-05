import { Outlet } from 'react-router-dom';
import Navbar from './Navbar/Navbar';

export default function Layout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9f9f9' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}