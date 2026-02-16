import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.scss';

export default function NotFoundPage() {
  return (
    <section id="not-found-page" className={styles.container}>
      <h1 className={styles.code}>404</h1>
      <p className={styles.message}>Page not found</p>
      <Link id="not-found-back-home-link" to="/" className={styles.link}>Back to Home</Link>
    </section>
  );
}
