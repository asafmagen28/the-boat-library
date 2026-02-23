import styles from './Toast.module.scss';

export default function Toast({ id, message, variant = 'info', onDismiss }) {
  const isError = variant === 'error';

  return (
    <div
      id={id}
      className={`${styles.toast} ${styles[variant]}`}
      role="alert"
      aria-live={isError ? 'assertive' : 'polite'}
    >
      <span className={styles.message}>{message}</span>
      <button
        className={styles.closeBtn}
        onClick={onDismiss}
        aria-label="Dismiss notification"
      >
        &times;
      </button>
    </div>
  );
}
