import styles from './Navbar.module.css';
import { 
  MdDashboard, MdInventory, MdReceipt, 
  MdShowChart, MdSearch, MdMenuBook, 
  MdPeople, MdLogout, MdBusiness 
} from 'react-icons/md';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/', icon: <MdDashboard /> },
    { label: 'Productes', path: '/productes', icon: <MdInventory /> },
    { label: 'Proveïdors', path: '/proveidors', icon: <MdBusiness /> },
    { label: 'Albarans', path: '/albarans', icon: <MdReceipt /> },
    { label: 'Estoc', path: '/stock', icon: <MdShowChart /> },
    { label: 'Receptes', path: '/receptes', icon: <MdMenuBook /> },
    { label: 'Traçabilitat', path: '/tracabilitat', icon: <MdSearch /> },
  ];

  return (
    <nav className={styles.sidebar}>
      <div className={styles.logo}>VITALIS</div>

      <ul className={styles.navList}>
        {navItems.map(({ label, path, icon }) => (
          <li key={path}>
            <NavLink
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.navIcon}>{icon}</span>
              {label}
            </NavLink>
          </li>
        ))}

        {isAdmin && (
          <li>
            <NavLink
              to="/usuaris"
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.navIcon}><MdPeople /></span>
              Usuaris
            </NavLink>
          </li>
        )}
      </ul>

      <div className={styles.logoutContainer}>
        <div className={styles.userInfo}>
           <small>{user?.nom}</small>
        </div>
        <button onClick={handleLogout} className={styles.logoutButton}>
          <span className={styles.navIcon}><MdLogout /></span>
          Tancar sessió
        </button>
      </div>
    </nav>
  );
};

export default Navbar;