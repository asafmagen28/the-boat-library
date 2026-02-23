import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRegister } from '../../services/api';
import FormInput from '../../components/FormInput/FormInput';
import Button from '../../components/Button/Button';
import styles from './RegisterPage.module.scss';

export default function RegisterPage() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({ mode: 'onBlur' });

  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  const { mutate, isPending, error, reset } = useRegister({
    onSuccess: (data) => {
      loginWithToken(data.data.token);
      navigate('/');
    },
  });

  const formFields = [
    { id: 'register-username-input', label: 'Username', name: 'username', placeholder: 'Choose a username' },
    { id: 'register-password-input', label: 'Password', name: 'password', type: 'password', placeholder: 'Choose a password (min 6 characters)' },
    { id: 'register-confirm-password-input', label: 'Confirm Password', name: 'confirmPassword', type: 'password', placeholder: 'Confirm your password' },
    { id: 'register-employee-code-input', label: 'Employee Code (optional)', name: 'employeeCode', placeholder: 'Enter employee code if you have one' },
  ];

  const validationRules = {
    username: {
      required: 'Username is required',
      validate: { notEmpty: (v) => v.trim() !== '' || 'Username cannot be empty' },
    },
    password: {
      required: 'Password is required',
      validate: {
        notEmpty: (v) => v.trim() !== '' || 'Password cannot be empty',
        minLength: (v) => v.trim().length >= 6 || 'Password must be at least 6 characters',
      },
    },
    confirmPassword: {
      required: 'Confirm password is required',
      validate: {
        notEmpty: (v) => v.trim() !== '' || 'Confirm password cannot be empty',
        matchesPassword: (v) => v === watch('password') || 'Passwords do not match',
      },
    },
    employeeCode: {},
  };

  const onSubmit = (data) => {
    reset();
    mutate({
      username: data.username.trim(),
      password: data.password,
      employeeCode: data.employeeCode?.trim() || undefined,
    });
  };

  return (
    <section id="register-page">
      <h2 className={styles.title}>Register</h2>
      <form id="register-form" className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        {formFields.map((field) => (
          <FormInput
            key={field.name}
            id={field.id}
            label={field.label}
            type={field.type}
            placeholder={field.placeholder}
            error={errors[field.name]?.message}
            {...register(field.name, validationRules[field.name])}
          />
        ))}
        {error && <p id="register-error" className={styles.error}>{error.message}</p>}
        <Button id="register-submit-btn" type="submit" disabled={isPending}>
          {isPending ? 'Registering...' : 'Register'}
        </Button>
      </form>
      <p className={styles.footer}>
        Already have an account?{' '}
        <Link id="register-login-link" to="/login" className={styles.link}>
          Login
        </Link>
      </p>
    </section>
  );
}
