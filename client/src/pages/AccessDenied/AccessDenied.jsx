import { Link } from 'react-router-dom';
import styles from './AccessDenied.module.scss';

export default function AccessDeniedPage() {
  return (
    <section id="access-denied-page" className={styles.container}>
      <h1 className={styles.code}>403</h1>
      <p className={styles.message}>Access Denied</p>
      <Link id="access-denied-back-home-link" to="/" className={styles.link}>Back to Home</Link>
    </section>
  );
}
