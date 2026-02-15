import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Navbar.module.scss';

export default function Navbar() {
  const { user, switchRole } = useAuth();

  const toggleRole = () => {
    switchRole(user.roleName === 'employee' ? 'customer' : 'employee');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <Link to="/" className={styles.logo}>
          The Boat Library
        </Link>
        <div className={styles.links}>
          <Link to="/">Home</Link>
          <Link to="/books">Books</Link>
          <Link to="/authors">Authors</Link>
        </div>
      </div>

      <div className={styles.right}>
        <span className={styles.username}>{user?.username}</span>
        <button className={styles.roleToggle} onClick={toggleRole}>
          Role: {user?.roleName}
        </button>
      </div>
    </nav>
  );
}
