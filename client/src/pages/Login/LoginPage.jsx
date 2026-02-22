import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLogin } from '../../services/api';
import FormInput from '../../components/FormInput/FormInput';
import Button from '../../components/Button/Button';
import styles from './LoginPage.module.scss';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  const { mutate, isPending, error, reset } = useLogin({
    onSuccess: (data) => {
      loginWithToken(data.data.token);
      navigate('/');
    },
  });

  const formFields = [
    { id: 'login-username-input', label: 'Username', name: 'username', value: username, setter: setUsername, placeholder: 'Enter your username' },
    { id: 'login-password-input', label: 'Password', name: 'password', type: 'password', value: password, setter: setPassword, placeholder: 'Enter your password' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');
    reset();

    const trimmedUsername = username.trim();
    if (!trimmedUsername || !password.trim()) {
      setValidationError('Please fill all required fields');
      return;
    }

    mutate({ username: trimmedUsername, password });
  };

  return (
    <section id="login-page">
      <h2 className={styles.title}>Login</h2>
      <form id="login-form" className={styles.form} onSubmit={handleSubmit}>
        {formFields.map((field) => (
          <FormInput
            key={field.name}
            id={field.id}
            label={field.label}
            name={field.name}
            type={field.type}
            value={field.value}
            onChange={(e) => field.setter(e.target.value)}
            placeholder={field.placeholder}
          />
        ))}
        {validationError && <p id="login-validation-error" className={styles.error}>{validationError}</p>}
        {error && <p id="login-error" className={styles.error}>{error.message}</p>}
        <Button id="login-submit-btn" type="submit" disabled={isPending}>
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
