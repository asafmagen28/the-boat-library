import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import FormInput from '../../components/FormInput/FormInput';
import Button from '../../components/Button/Button';
import styles from './LoginPage.module.scss';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Username and password are required');
      return;
    }

    setIsLoading(true);
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="login-page">
      <h2 className={styles.title}>Login</h2>
      <form id="login-form" className={styles.form} onSubmit={handleSubmit}>
        <FormInput
          id="login-username-input"
          label="Username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
        />
        <FormInput
          id="login-password-input"
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
        {error && <p id="login-error" className={styles.error}>{error}</p>}
        <Button id="login-submit-btn" type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
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
