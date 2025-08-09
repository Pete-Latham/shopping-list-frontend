import { useState, useEffect, useRef, forwardRef } from 'react';
import { 
  Combobox, 
  InputBase, 
  useCombobox,
  Loader,
  ScrollArea
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { shoppingListsApi } from '../api/client';
import styles from './AutocompleteItemInput.module.css';

interface AutocompleteItemInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  error?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  'data-autofocus'?: boolean;
}

export const AutocompleteItemInput = forwardRef<HTMLInputElement, AutocompleteItemInputProps>(
  ({ label, placeholder, value = '', onChange, onBlur, error, required, disabled, ...others }, ref) => {
    const [inputValue, setInputValue] = useState(value);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [debouncedInputValue] = useDebouncedValue(inputValue, 300);
    const abortControllerRef = useRef<AbortController | null>(null);

    const combobox = useCombobox({
      onDropdownClose: () => combobox.resetSelectedOption(),
      onDropdownOpen: () => {
        if (suggestions.length === 0 && !loading) {
          loadSuggestions(inputValue);
        }
      },
    });

    const loadSuggestions = async (query: string) => {
      // Cancel any pending request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Don't load suggestions if input is too short
      if (query.length === 0) {
        try {
          setLoading(true);
          const results = await shoppingListsApi.getItemSuggestions();
          setSuggestions(results);
        } catch (error) {
          console.error('Failed to load default suggestions:', error);
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
        return;
      }

      // Create new abort controller for this request
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        setLoading(true);
        const results = await shoppingListsApi.getItemSuggestions(query);
        
        // Only update suggestions if this request wasn't cancelled
        if (!controller.signal.aborted) {
          setSuggestions(results);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('Failed to load suggestions:', error);
          setSuggestions([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    // Load suggestions when debounced input changes
    useEffect(() => {
      loadSuggestions(debouncedInputValue);
    }, [debouncedInputValue]);

    // Update input value when external value changes
    useEffect(() => {
      setInputValue(value);
    }, [value]);

    // Clean up abort controller on unmount
    useEffect(() => {
      return () => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
      };
    }, []);

    const handleInputChange = (newValue: string) => {
      setInputValue(newValue);
      onChange?.(newValue);
    };

    const handleSuggestionSelect = (suggestion: string) => {
      handleInputChange(suggestion);
      combobox.closeDropdown();
    };

    const filteredSuggestions = suggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
      suggestion.toLowerCase() !== inputValue.toLowerCase()
    );

    const options = filteredSuggestions.map((suggestion) => (
      <Combobox.Option value={suggestion} key={suggestion}>
        {suggestion}
      </Combobox.Option>
    ));

    return (
      <Combobox
        store={combobox}
        onOptionSubmit={handleSuggestionSelect}
        position="bottom-start"
        middlewares={{ flip: false, shift: false }}
        offset={4}
      >
        <Combobox.Target>
          <InputBase
            ref={ref}
            label={label}
            placeholder={placeholder}
            value={inputValue}
            onChange={(event) => handleInputChange(event.currentTarget.value)}
            onBlur={() => {
              combobox.closeDropdown();
              onBlur?.();
            }}
            onFocus={() => combobox.openDropdown()}
            rightSection={loading ? <Loader size={18} /> : <Combobox.Chevron />}
            rightSectionPointerEvents="none"
            error={error}
            required={required}
            disabled={disabled}
            className={styles.input}
            {...others}
          />
        </Combobox.Target>

        <Combobox.Dropdown>
          <ScrollArea.Autosize type="scroll" mah={200}>
            <Combobox.Options>
              {options.length > 0 ? (
                options
              ) : loading ? (
                <Combobox.Option value="" disabled>
                  <div className={styles.loadingOption}>
                    <Loader size={16} />
                    <span>Loading suggestions...</span>
                  </div>
                </Combobox.Option>
              ) : (
                <Combobox.Option value="" disabled>
                  <span className={styles.noResults}>No suggestions found</span>
                </Combobox.Option>
              )}
            </Combobox.Options>
          </ScrollArea.Autosize>
        </Combobox.Dropdown>
      </Combobox>
    );
  }
);

AutocompleteItemInput.displayName = 'AutocompleteItemInput';
