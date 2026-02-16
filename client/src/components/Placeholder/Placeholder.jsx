import styles from './Placeholder.module.scss';

export default function Placeholder({ id, pageName, description }) {
  return (
    <div id={id} className={styles.card}>
      <h2 className={styles.title}>{pageName}</h2>
      <p className={styles.description}>
        {description || 'This page is coming soon.'}
      </p>
      <span className={styles.badge}>Under Construction</span>
    </div>
  );
}
