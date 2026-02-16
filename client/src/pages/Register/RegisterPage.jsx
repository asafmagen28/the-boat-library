import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import FormInput from '../../components/FormInput/FormInput';
import Button from '../../components/Button/Button';
import styles from './RegisterPage.module.scss';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [employeeCode, setEmployeeCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password || !confirmPassword) {
      setError('Username, password, and confirm password are required');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await authAPI.register(username, password, employeeCode || undefined);
      loginWithToken(data.token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="register-page">
      <h2 className={styles.title}>Register</h2>
      <form id="register-form" className={styles.form} onSubmit={handleSubmit}>
        <FormInput
          id="register-username-input"
          label="Username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Choose a username"
        />
        <FormInput
          id="register-password-input"
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Choose a password (min 6 characters)"
        />
        <FormInput
          id="register-confirm-password-input"
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your password"
        />
        <FormInput
          id="register-employee-code-input"
          label="Employee Code (optional)"
          name="employeeCode"
          value={employeeCode}
          onChange={(e) => setEmployeeCode(e.target.value)}
          placeholder="Enter employee code if you have one"
        />
        {error && <p id="register-error" className={styles.error}>{error}</p>}
        <Button id="register-submit-btn" type="submit" disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register'}
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
