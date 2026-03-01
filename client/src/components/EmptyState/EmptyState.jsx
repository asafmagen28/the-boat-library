import styles from './EmptyState.module.scss';

export default function EmptyState({ id, message, icon }) {
  return (
    <div id={id} className={styles.container}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <p className={styles.message}>{message}</p>
    </div>
  );
}
