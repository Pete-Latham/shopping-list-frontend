import React, { useState } from 'react';
import styles from './ShoppingListForm.module.css';
import type { ShoppingList, CreateShoppingListDto, UpdateShoppingListDto } from '../../types';

interface ShoppingListFormProps {
  /**
   * Existing shopping list for editing (optional)
   */
  existingList?: ShoppingList;
  
  /**
   * Form submission handler
   */
  onSubmit: (data: CreateShoppingListDto | UpdateShoppingListDto) => void;
  
  /**
   * Cancel handler
   */
  onCancel: () => void;
  
  /**
   * Loading state during form submission
   */
  isLoading?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * ShoppingListForm - Form for creating new shopping lists or editing existing ones
 * Follows mobile-first design with touch-optimized interactions
 * 
 * @param props - ShoppingListFormProps
 * @returns JSX.Element
 */
export const ShoppingListForm: React.FC<ShoppingListFormProps> = ({
  existingList,
  onSubmit,
  onCancel,
  isLoading = false,
  className
}) => {
  const [name, setName] = useState(existingList?.name || '');
  const [description, setDescription] = useState(existingList?.description || '');
  const [nameError, setNameError] = useState('');

  const isEditing = !!existingList;
  const formTitle = isEditing ? 'Edit Shopping List' : 'Create New Shopping List';

  // Combine CSS classes
  const containerClass = className 
    ? `${styles.container} ${className}` 
    : styles.container;

  const validateForm = (): boolean => {
    setNameError('');
    
    if (!name.trim()) {
      setNameError('Shopping list name is required');
      return false;
    }
    
    if (name.trim().length < 2) {
      setNameError('Shopping list name must be at least 2 characters');
      return false;
    }
    
    if (name.trim().length > 100) {
      setNameError('Shopping list name must be less than 100 characters');
      return false;
    }
    
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const formData = {
      name: name.trim(),
      description: description.trim() || undefined,
    };

    onSubmit(formData);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (nameError) {
      setNameError(''); // Clear error when user starts typing
    }
  };

  return (
    <div className={containerClass}>
      <div className={styles.modalContent}>
        <header className={styles.header}>
          <h2 className={styles.title}>{formTitle}</h2>
          <button
            type="button"
            onClick={onCancel}
            className={styles.closeButton}
            aria-label="Close form"
            disabled={isLoading}
          >
            ✕
          </button>
        </header>

        <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="list-name" className={styles.label}>
            Shopping List Name *
          </label>
          <input
            id="list-name"
            type="text"
            value={name}
            onChange={handleNameChange}
            className={`${styles.input} ${nameError ? styles.inputError : ''}`}
            placeholder="e.g., Weekly Groceries, Party Supplies..."
            disabled={isLoading}
            autoFocus
            maxLength={100}
          />
          {nameError && (
            <span className={styles.errorText} role="alert">
              {nameError}
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="list-description" className={styles.label}>
            Description (optional)
          </label>
          <textarea
            id="list-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.textarea}
            placeholder="Add a description for this shopping list..."
            disabled={isLoading}
            maxLength={500}
            rows={3}
          />
          <div className={styles.charCount}>
            {description.length}/500
          </div>
        </div>

        <div className={styles.formActions}>
          <button
            type="button"
            onClick={onCancel}
            className={styles.cancelButton}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading || !name.trim()}
          >
            {isLoading ? (
              <>
                <span className={styles.spinner} aria-hidden="true"></span>
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              isEditing ? 'Update List' : 'Create List'
            )}
          </button>
        </div>
        </form>
      </div>
    </div>
  );
};

export default ShoppingListForm;
