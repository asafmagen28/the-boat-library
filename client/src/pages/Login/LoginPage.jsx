import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLogin } from '../../services/api';
import FormInput from '../../components/FormInput/FormInput';
import Button from '../../components/Button/Button';
import styles from './LoginPage.module.scss';

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({ mode: 'onBlur' });

  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  const { mutate, isPending, error, reset } = useLogin({
    onSuccess: (data) => {
      loginWithToken(data.data.token);
      navigate('/');
    },
  });

  const formFields = [
    { id: 'login-username-input', label: 'Username', name: 'username', placeholder: 'Enter your username' },
    { id: 'login-password-input', label: 'Password', name: 'password', type: 'password', placeholder: 'Enter your password' },
  ];

  const validationRules = {
    username: {
      required: 'Username is required',
      validate: { notEmpty: (v) => v.trim() !== '' || 'Username cannot be empty' },
    },
    password: {
      required: 'Password is required',
      validate: { notEmpty: (v) => v.trim() !== '' || 'Password cannot be empty' },
    },
  };

  const onSubmit = (data) => {
    reset();
    mutate({ username: data.username.trim(), password: data.password });
  };

  return (
    <section id="login-page">
      <h2 className={styles.title}>Login</h2>
      <form id="login-form" className={styles.form} onSubmit={handleSubmit(onSubmit)}>
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
        {error && <p id="login-error" className={styles.error}>{error.message}</p>}
        <Button id="login-submit-btn" type="submit" disabled={isPending} isFormValid={isValid}>
          {isPending ? 'Logging in...' : 'Login'}
        </Button>
      </form>
      <p className={styles.footer}>
        Don't have an account?{' '}
        <Link id="login-register-link" to="/register" className={styles.link}>
          Register
        </Link>
      </p>
    </section>
  );
}
