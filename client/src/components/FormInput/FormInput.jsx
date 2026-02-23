import { forwardRef } from 'react';
import styles from './FormInput.module.scss';

const FormInput = forwardRef(function FormInput({ id, label, name, error, type = "text", placeholder, ...rest }, ref) {
  return (
    <div className={styles.formInput}>
        <label className={styles.label} htmlFor={id}>{label}</label>
        <input id={id} name={name} className={styles.input} type={type} placeholder={placeholder} ref={ref} {...rest}/>
        {error && <span className={styles.error}> {error} </span>}
    </div>
  );
});

FormInput.displayName = 'FormInput';

export default FormInput;
