import React from 'react';
import styles from './DeleteConfirmation.module.css';

interface DeleteConfirmationProps {
  /**
   * Title of the confirmation dialog
   */
  title: string;
  
  /**
   * Descriptive message about what will be deleted
   */
  message: string;
  
  /**
   * Name of the item being deleted (for emphasis)
   */
  itemName: string;
  
  /**
   * Confirm deletion handler
   */
  onConfirm: () => void;
  
  /**
   * Cancel deletion handler
   */
  onCancel: () => void;
  
  /**
   * Loading state during deletion
   */
  isLoading?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * DeleteConfirmation - Modal for confirming deletion of shopping lists
 * Follows mobile-first design with clear, touch-friendly interactions
 * 
 * @param props - DeleteConfirmationProps
 * @returns JSX.Element
 */
export const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  title,
  message,
  itemName,
  onConfirm,
  onCancel,
  isLoading = false,
  className
}) => {
  // Combine CSS classes
  const overlayClass = className 
    ? `${styles.overlay} ${className}` 
    : styles.overlay;

  return (
    <div 
      className={overlayClass}
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="delete-title"
      aria-describedby="delete-message"
    >
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.iconContainer}>
            <span className={styles.warningIcon} aria-hidden="true">⚠️</span>
          </div>
          <h2 id="delete-title" className={styles.title}>
            {title}
          </h2>
        </div>
        
        <div className={styles.content}>
          <p id="delete-message" className={styles.message}>
            {message}
          </p>
          <div className={styles.itemName}>
            "{itemName}"
          </div>
          <p className={styles.warning}>
            This action cannot be undone.
          </p>
        </div>
        
        <div className={styles.actions}>
          <button
            type="button"
            onClick={onCancel}
            className={styles.cancelButton}
            disabled={isLoading}
            autoFocus
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={styles.deleteButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className={styles.spinner} aria-hidden="true"></span>
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
