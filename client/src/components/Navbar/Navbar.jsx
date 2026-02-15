import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Navbar.module.scss';

const employeeLinks = [
  { to: '/', label: 'Home', id: 'nav-link-home' },
  { to: '/books', label: 'Library', id: 'nav-link-library' },
  { to: '/authors', label: 'Authors', id: 'nav-link-authors' },
  { to: '/manage/customers', label: 'Customers', id: 'nav-link-customers' },
  { to: '/manage/loans', label: 'Manage Loans', id: 'nav-link-manage-loans' },
  { to: '/reports', label: 'Reports', id: 'nav-link-reports' },
];

const customerLinks = [
  { to: '/', label: 'Home', id: 'nav-link-home' },
  { to: '/books', label: 'Library', id: 'nav-link-library' },
  { to: '/authors', label: 'Authors', id: 'nav-link-authors' },
  { to: '/my-loans', label: 'My Loans', id: 'nav-link-my-loans' },
  { to: '/budget', label: 'Budget', id: 'nav-link-budget' },
];

export default function Navbar() {
  const { user, logout, switchRole } = useAuth();

  const links = user?.roleName === 'employee' ? employeeLinks : customerLinks;

  const toggleRole = () => {
    switchRole(user.roleName === 'employee' ? 'customer' : 'employee');
  };

  return (
    <nav id="navbar" className={styles.navbar}>
      <div className={styles.left}>
        <NavLink id="navbar-logo" to="/" className={styles.logo} end>
          The Boat
        </NavLink>
        <button id="navbar-logout-btn" className={styles.logoutBtn} onClick={logout}>
          LogOut
        </button>
        <button id="navbar-role-toggle" className={styles.roleToggle} onClick={toggleRole}>
          Role: {user?.roleName}
        </button>
      </div>

      <div className={styles.right}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            id={link.id}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
