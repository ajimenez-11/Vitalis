import styles from './Navbar.module.css';
import { MdDashboard, MdInventory, MdReceipt, MdShowChart, MdSearch, MdMenuBook, MdPeople } from 'react-icons/md';

const navItems = [
  { label: 'Dashboard', icon: <MdDashboard /> },
  { label: 'Productes', icon: <MdInventory /> },
  { label: 'Albarans', icon: <MdReceipt /> },
  { label: 'Estoc', icon: <MdShowChart /> },
  { label: 'Traçabilitat', icon: <MdSearch /> },
  { label: 'Receptes', icon: <MdMenuBook /> },
  { label: 'Usuaris', icon: <MdPeople /> },
];

const Navbar = ({ activeItem, onNavigate }) => {
  return (
    <nav className={styles.sidebar}>
      <div className={styles.logo}>VITALIS</div>
      <ul className={styles.navList}>
        {navItems.map(({ label, icon }) => (
          <li
            key={label}
            className={`${styles.navItem} ${activeItem === label ? styles.active : ''}`}
            onClick={() => onNavigate?.(label)}
          >
            <span className={styles.navIcon}>{icon}</span>
            {label}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;