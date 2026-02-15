import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Navbar.module.scss';

const employeeLinks = [
  { to: '/', label: 'Home' },
  { to: '/books', label: 'Library' },
  { to: '/authors', label: 'Authors' },
  { to: '/manage/customers', label: 'Customers' },
  { to: '/manage/loans', label: 'Manage Loans' },
  { to: '/reports', label: 'Reports' },
];

const customerLinks = [
  { to: '/', label: 'Home' },
  { to: '/books', label: 'Library' },
  { to: '/authors', label: 'Authors' },
  { to: '/my-loans', label: 'My Loans' },
  { to: '/budget', label: 'Budget' },
];

export default function Navbar() {
  const { user, logout, switchRole } = useAuth();

  const links = user?.roleName === 'employee' ? employeeLinks : customerLinks;

  const toggleRole = () => {
    switchRole(user.roleName === 'employee' ? 'customer' : 'employee');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <NavLink to="/" className={styles.logo} end>
          The Boat
        </NavLink>
        <button className={styles.logoutBtn} onClick={logout}>
          LogOut
        </button>
        <button className={styles.roleToggle} onClick={toggleRole}>
          Role: {user?.roleName}
        </button>
      </div>

      <div className={styles.right}>
        {links.map((link) => (
          <NavLink
            key={link.to}
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
