import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRegister } from '../../services/api';
import FormInput from '../../components/FormInput/FormInput';
import Button from '../../components/Button/Button';
import styles from './RegisterPage.module.scss';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [employeeCode, setEmployeeCode] = useState('');
  const [validationError, setValidationError] = useState('');

  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  const { mutate, isPending, error } = useRegister({
    onSuccess: (data) => {
      loginWithToken(data.data.token);
      navigate('/');
    },
  });

  const formFields = [
    { id: 'register-username-input', label: 'Username', name: 'username', value: username, setter: setUsername, placeholder: 'Choose a username' },
    { id: 'register-password-input', label: 'Password', name: 'password', type: 'password', value: password, setter: setPassword, placeholder: 'Choose a password (min 6 characters)' },
    { id: 'register-confirm-password-input', label: 'Confirm Password', name: 'confirmPassword', type: 'password', value: confirmPassword, setter: setConfirmPassword, placeholder: 'Confirm your password' },
    { id: 'register-employee-code-input', label: 'Employee Code (optional)', name: 'employeeCode', value: employeeCode, setter: setEmployeeCode, placeholder: 'Enter employee code if you have one' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!username || !password || !confirmPassword) {
      setValidationError('Username, password, and confirm password are required');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    mutate({ username, password, employeeCode: employeeCode || undefined });
  };

  const displayError = validationError || (error && error.message);

  return (
    <section id="register-page">
      <h2 className={styles.title}>Register</h2>
      <form id="register-form" className={styles.form} onSubmit={handleSubmit}>
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
        {displayError && <p id="register-error" className={styles.error}>{displayError}</p>}
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
