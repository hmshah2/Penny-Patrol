import React, {useState} from 'react';
import Hamburger from 'hamburger-react';
import { NavLink } from 'react-router-dom';
import styles from './Header.module.css';

const Header = ({ activeNav, setActiveNav, onLogout }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false)

    return (
    <div>
    <div className={styles.headerPlaceholder}>
    </div>
    <div className={styles.fullHeader}>
      <header className={styles.appHeader}>
        Penny Patrol
      </header>
      <nav className={styles.appNav}>
        <div className={styles.navItems}>
          <NavLink to="/budget" className={({ isActive }) => isActive ? styles.navButtonActive : styles.navButton} onClick={() => setActiveNav('Budget')}>Budget</NavLink>
          <NavLink to="/transactions" className={({ isActive }) => isActive ? styles.navButtonActive : styles.navButton} onClick={() => setActiveNav('Transactions')}>Spending Log</NavLink>
          <NavLink to="/pie-chart" className={({ isActive }) => isActive ? styles.navButtonActive : styles.navButton} onClick={() => setActiveNav('Financial Analysis')}>Financial Analysis</NavLink>
        </div>
        <Hamburger toggled={menuOpen} toggle={setMenuOpen} onToggle={() => setShowDropdown(!showDropdown)} color='white' />
        {showDropdown && (
          <div className={styles.dropdownMenu}>
            <div className={styles.menuItems}>
              <NavLink to="/budget" className={({ isActive }) => isActive ? styles.navButtonActive : styles.navButton} onClick={() => setActiveNav('Budget')}>Budget</NavLink>
              <NavLink to="/transactions" className={({ isActive }) => isActive ? styles.navButtonActive : styles.navButton} onClick={() => setActiveNav('Transactions')}>Spending Log</NavLink>
              <NavLink to="/pie-chart" className={({ isActive }) => isActive ? styles.navButtonActive : styles.navButton} onClick={() => setActiveNav('Financial Analysis')}>Financial Analysis</NavLink>
            </div>
            <button className={styles.logoutButton} onClick={onLogout}>Log Out</button>
          </div>
        )}
      </nav>
    </div>
    </div>
  );
};

export default Header;
