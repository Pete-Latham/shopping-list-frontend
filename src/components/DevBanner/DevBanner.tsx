import React, { useEffect, useState } from 'react';
import styles from './DevBanner.module.css';

// Global state for API mode (set by the API client)
declare global {
  interface Window {
    __DEV_API_MODE__?: 'mock' | 'real';
  }
}

interface DevBannerProps {
  className?: string;
}

/**
 * DevBanner - Shows development status and API mode
 * Only appears in development mode
 */
export const DevBanner: React.FC<DevBannerProps> = ({ className }) => {
  const [apiMode, setApiMode] = useState<'real' | 'mock' | 'unknown'>('unknown');
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    // Only show in development (Vite uses import.meta.env.DEV)
    if (!import.meta.env.DEV) {
      setIsVisible(false);
      return;
    }

    // Check for global API mode flag (set by API client)
    const checkApiMode = () => {
      if (window.__DEV_API_MODE__) {
        setApiMode(window.__DEV_API_MODE__);
      } else {
        // Fallback: assume mock if no backend URL configured
        setApiMode(import.meta.env.VITE_API_URL ? 'real' : 'mock');
      }
    };

    // Initial check
    checkApiMode();

    // Listen for changes to the global flag
    const interval = setInterval(checkApiMode, 100); // Check every 100ms for quick updates

    // Auto-hide after 30 seconds (longer for better UX)
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 30000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  if (!isVisible) return null;

  const containerClass = className 
    ? `${styles.container} ${className}` 
    : styles.container;

  return (
    <div className={containerClass}>
      <div className={styles.content}>
        <span className={styles.icon}>🚧</span>
        <div className={styles.text}>
          <strong>Development Mode</strong>
          <span className={styles.mode}>
            {apiMode === 'mock' && '• Using Mock Data (Backend not connected)'}
            {apiMode === 'real' && '• Connected to Backend API'}
            {apiMode === 'unknown' && '• Checking API connection...'}
          </span>
        </div>
        <button 
          className={styles.closeButton}
          onClick={() => setIsVisible(false)}
          aria-label="Close banner"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default DevBanner;
