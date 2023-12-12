import React, {useState} from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Header.module.css';

const Header = ({ activeNav, setActiveNav, onLogout }) => {
    const [showLogout, setShowLogout] = useState(false);

    return (
    <div className={styles.fullHeader}>
      <header className={styles.appHeader}>
        Penny Patrol
      </header>
      <nav className={styles.appNav}>
        <NavLink to="/purchases" className={({ isActive }) => isActive ? styles.navButtonActive : styles.navButton} onClick={() => setActiveNav('Purchases')}>Purchases</NavLink>
        <NavLink to="/spending-log" className={({ isActive }) => isActive ? styles.navButtonActive : styles.navButton} onClick={() => setActiveNav('Spending Log')}>Spending Log</NavLink>
        <NavLink to="/pie-chart" className={({ isActive }) => isActive ? styles.navButtonActive : styles.navButton} onClick={() => setActiveNav('Financial Analysis')}>Financial Analysis</NavLink>
        <div className={styles.userIcon} onClick={onLogout}>👤</div>
      </nav>
    </div>
  );
};

export default Header;
