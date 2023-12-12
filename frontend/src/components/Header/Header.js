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
        <NavLink to="/budget" className={({ isActive }) => isActive ? styles.navButtonActive : styles.navButton} onClick={() => setActiveNav('Budget')}>Budget</NavLink>
        <NavLink to="/transactions" className={({ isActive }) => isActive ? styles.navButtonActive : styles.navButton} onClick={() => setActiveNav('Transactions')}>Spending Log</NavLink>
        <NavLink to="/pie-chart" className={({ isActive }) => isActive ? styles.navButtonActive : styles.navButton} onClick={() => setActiveNav('Financial Analysis')}>Financial Analysis</NavLink>
        <div className={styles.userIconWrapper}>
            <div className={styles.userIcon} onClick={() => setShowLogout(!showLogout)}>👤</div>
            {showLogout && (
                <div className={styles.logoutDropdown}>
                    <button onClick={onLogout}>Log Out</button>
                </div>
            )}
        </div>
      </nav>
    </div>
  );
};

export default Header;
