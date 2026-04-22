import styles from './Navbar.module.css';
import {
  MdDashboard,
  MdInventory,
  MdReceipt,
  MdShowChart,
  MdSearch,
  MdMenuBook,
  MdPeople
} from 'react-icons/md';

import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', path: '/', icon: <MdDashboard /> },
  { label: 'Productes', path: '/productes', icon: <MdInventory /> },
  { label: 'Albarans', path: '/albarans', icon: <MdReceipt /> },
  { label: 'Estoc', path: '/stock', icon: <MdShowChart /> },
  { label: 'Traçabilitat', path: '/tracabilitat', icon: <MdSearch /> },
  { label: 'Receptes', path: '/receptes', icon: <MdMenuBook /> },
  { label: 'Usuaris', path: '/usuaris', icon: <MdPeople /> },
];

const Navbar = () => {
  return (
    <nav className={styles.sidebar}>
      <div className={styles.logo}>VITALIS</div>

      <ul className={styles.navList}>
        {navItems.map(({ label, path, icon }) => (
          <li key={label}>
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
      </ul>
    </nav>
  );
};

export default Navbar;