import styles from './Button.module.scss';

export default function Button({ id, variant = 'primary', disabled, isFormValid = true, onClick, children, type = 'button' }) {
  const isDisabled = disabled || (type === 'submit' && !isFormValid);

  return (
    <button
      id={id}
      className={`${styles.button} ${styles[variant]}`}
      disabled={isDisabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}