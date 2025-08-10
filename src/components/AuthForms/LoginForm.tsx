import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import type { LoginRequest } from '../../types/auth';
import styles from './LoginForm.module.css';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const { login, authEnabled } = useAuth();
  const [formData, setFormData] = useState<LoginRequest>({
    usernameOrEmail: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<LoginRequest>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginRequest> = {};

    if (!formData.usernameOrEmail.trim()) {
      newErrors.usernameOrEmail = 'Username or email is required';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof LoginRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await login(formData);
    } catch (error) {
      // Error handling is done in the auth context
    } finally {
      setIsLoading(false);
    }
  };

  if (!authEnabled) {
    return null; // Don't show login form when auth is disabled
  }

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.subtitle}>
            Sign in to access your shopping lists
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="usernameOrEmail">Username or Email</label>
            <input
              id="usernameOrEmail"
              type="text"
              className={styles.input}
              placeholder="Enter your username or email"
              value={formData.usernameOrEmail}
              onChange={(e) => handleInputChange('usernameOrEmail', e.target.value)}
              disabled={isLoading}
              autoComplete="username"
              aria-invalid={!!errors.usernameOrEmail}
              aria-describedby={errors.usernameOrEmail ? 'usernameOrEmail-error' : undefined}
            />
            {errors.usernameOrEmail && (
              <div id="usernameOrEmail-error" className={styles.errorMessage} role="alert">
                {errors.usernameOrEmail}
              </div>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className={styles.input}
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              disabled={isLoading}
              autoComplete="current-password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
            {errors.password && (
              <div id="password-error" className={styles.errorMessage} role="alert">
                {errors.password}
              </div>
            )}
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
            aria-label={isLoading ? 'Signing in...' : 'Sign in'}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            Don't have an account?
          </p>
          <button
            type="button"
            className={styles.switchButton}
            onClick={onSwitchToRegister}
            disabled={isLoading}
          >
            Create account
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
