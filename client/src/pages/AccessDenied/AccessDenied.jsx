import { Link } from 'react-router-dom';
import styles from './AccessDenied.module.scss';

export default function AccessDeniedPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.code}>403</h1>
      <p className={styles.message}>Access Denied</p>
      <Link to="/" className={styles.link}>Back to Home</Link>
    </div>
  );
}
