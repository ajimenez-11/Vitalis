import Navbar from '../../components/Navbar/Navbar.jsx';
import styles from './Dashboard.module.css';
import { useState } from 'react';

const Dashboard = () => {
  const [activeItem, setActiveItem] = useState('Dashboard');

  return (
    <div className={styles.layout}>
      <Navbar activeItem={activeItem} onNavigate={setActiveItem} />
      <main className={styles.content}>
      </main>
    </div>
  );
};

export default Dashboard;