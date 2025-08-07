/**
 * Template for creating new components following project standards
 * 
 * Instructions:
 * 1. Copy this template for new components
 * 2. Replace 'ComponentName' with your actual component name
 * 3. Update the interface with your specific props
 * 4. Create corresponding ComponentName.module.css file
 * 5. Follow mobile-first styling approach
 */

import React from 'react';
import styles from './ComponentName.module.css';

interface ComponentNameProps {
  /**
   * Required prop example
   */
  title: string;
  
  /**
   * Optional prop example with default
   */
  isVisible?: boolean;
  
  /**
   * Event handler example
   */
  onAction?: () => void;
  
  /**
   * Children for composable components
   */
  children?: React.ReactNode;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * ComponentName - Brief description of what this component does
 * 
 * @param props - ComponentNameProps
 * @returns JSX.Element
 */
export const ComponentName: React.FC<ComponentNameProps> = ({
  title,
  isVisible = true,
  onAction,
  children,
  className
}) => {
  // Combine CSS classes
  const containerClass = className 
    ? `${styles.container} ${className}` 
    : styles.container;

  // Early return for conditional rendering
  if (!isVisible) {
    return null;
  }

  return (
    <div 
      className={containerClass}
      // Accessibility attributes
      role="region"
      aria-label={title}
    >
      <h2 className={styles.title}>
        {title}
      </h2>
      
      {children && (
        <div className={styles.content}>
          {children}
        </div>
      )}
      
      {onAction && (
        <button 
          className={styles.actionButton}
          onClick={onAction}
          type="button"
        >
          Action
        </button>
      )}
    </div>
  );
};

export default ComponentName;
