import styles from './Button.module.scss';

export default function Button({ variant = 'primary', disabled, onClick, children, type = 'button' }) {
  return (
    <button
      className={`${styles.button} ${styles[variant]}`}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}