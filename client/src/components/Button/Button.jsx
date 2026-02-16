import styles from './Button.module.scss';

export default function Button({ id, variant = 'primary', disabled, onClick, children, type = 'button' }) {
  return (
    <button
      id={id}
      className={`${styles.button} ${styles[variant]}`}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}