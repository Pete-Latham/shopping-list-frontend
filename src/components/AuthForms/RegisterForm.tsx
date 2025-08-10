import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import type { RegisterRequest } from '../../types/auth';
import styles from './RegisterForm.module.css';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const { register, authEnabled } = useAuth();
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<RegisterRequest>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterRequest> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters long';
    } else if (formData.username.length > 20) {
      newErrors.username = 'Username must be no more than 20 characters long';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof RegisterRequest, value: string) => {
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
      await register(formData);
      // On success, switch to login form
      onSwitchToLogin();
    } catch (error) {
      // Error handling is done in the auth context
    } finally {
      setIsLoading(false);
    }
  };

  if (!authEnabled) {
    return null; // Don't show register form when auth is disabled
  }

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>
            Join us to start organizing your shopping lists
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.inputLabel}>Email</label>
            <input
              id="email"
              type="email"
              className={styles.input}
              placeholder="Enter your email address"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={isLoading}
              autoComplete="email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <div id="email-error" className={styles.errorMessage} role="alert">
                {errors.email}
              </div>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.inputLabel}>Username</label>
            <input
              id="username"
              type="text"
              className={styles.input}
              placeholder="Choose a username"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              disabled={isLoading}
              autoComplete="username"
              aria-invalid={!!errors.username}
              aria-describedby={errors.username ? 'username-error' : 'username-hint'}
            />
            {errors.username ? (
              <div id="username-error" className={styles.errorMessage} role="alert">
                {errors.username}
              </div>
            ) : (
              <div id="username-hint" className={styles.passwordHint}>
                3-20 characters, will be used for login
              </div>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.inputLabel}>Password</label>
            <input
              id="password"
              type="password"
              className={styles.input}
              placeholder="Create a password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              disabled={isLoading}
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : 'password-hint'}
            />
            {errors.password ? (
              <div id="password-error" className={styles.errorMessage} role="alert">
                {errors.password}
              </div>
            ) : (
              <div id="password-hint" className={styles.passwordHint}>
                At least 6 characters long
              </div>
            )}
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
            aria-label={isLoading ? 'Creating account...' : 'Create account'}
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            Already have an account?
          </p>
          <button
            type="button"
            className={styles.switchButton}
            onClick={onSwitchToLogin}
            disabled={isLoading}
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
