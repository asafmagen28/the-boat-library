import styles from './FormInput.module.scss';

export default function FormInput({ label, name, value, onChange, error, type = "text", placeholder}) {
  return (
    <div className={styles.formInput}>
        <label className={styles.label}>{label}</label>
        <input name={name} className={styles.input} type={type} onChange={onChange} placeholder={placeholder} value={value}/>
        {error && <span className={styles.error}> {error} </span>}
    </div>
  );
}