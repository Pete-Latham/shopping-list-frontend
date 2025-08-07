import { useState } from 'react';
import { 
  TextInput, 
  NumberInput, 
  Select, 
  Textarea, 
  Button, 
  Paper,
  Stack
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconPlus, IconCheck, IconX } from '@tabler/icons-react';
import type { CreateShoppingListItemDto } from '../types';
import styles from './AddItemForm.module.css';
import { clsx } from 'clsx';

interface AddItemFormProps {
  onAdd: (item: CreateShoppingListItemDto) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
}

const COMMON_UNITS = [
  'pieces',
  'kg',
  'g',
  'lbs',
  'oz',
  'liters',
  'ml',
  'cups',
  'tbsp',
  'tsp',
  'dozen',
  'pack',
  'bottle',
  'can',
  'box'
];

export function AddItemForm({ onAdd, onCancel, loading = false }: AddItemFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateShoppingListItemDto>({
    initialValues: {
      name: '',
      quantity: undefined,
      unit: '',
      notes: ''
    },
    validate: {
      name: (value) => (value.trim().length < 2 ? 'Item name must be at least 2 characters' : null),
      quantity: (value) => (value !== undefined && value <= 0 ? 'Quantity must be greater than 0' : null),
    },
  });

  const handleSubmit = async (values: CreateShoppingListItemDto) => {
    setIsSubmitting(true);
    try {
      // Clean up the data before sending
      const cleanedValues = {
        name: values.name.trim(),
        quantity: values.quantity || undefined,
        unit: values.unit?.trim() || undefined,
        notes: values.notes?.trim() || undefined,
      };

      await onAdd(cleanedValues);
      
      // Reset form on success
      form.reset();
      
      notifications.show({
        title: 'Success',
        message: 'Item added successfully!',
        color: 'green',
        icon: <IconCheck size={16} />,
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to add item. Please try again.',
        color: 'red',
        icon: <IconX size={16} />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper 
      p="md" 
      shadow="sm" 
      withBorder 
      className={clsx(styles.formContainer, {
        [styles.loading]: isSubmitting || loading
      })}
    >
      <form onSubmit={form.onSubmit(handleSubmit)} className={styles.form}>
        <Stack gap="md">
          <TextInput
            label="Item Name"
            placeholder="Enter item name..."
            required
            {...form.getInputProps('name')}
          />

          <div className={styles.inputGroup}>
            <NumberInput
              label="Quantity"
              placeholder="Optional"
              min={0.1}
              step={0.1}
              decimalScale={2}
              className={styles.quantityInput}
              {...form.getInputProps('quantity')}
            />

            <Select
              label="Unit"
              placeholder="Select unit"
              data={COMMON_UNITS}
              searchable
              clearable
              className={styles.unitSelect}
              {...form.getInputProps('unit')}
            />
          </div>

          <Textarea
            label="Notes"
            placeholder="Additional notes (optional)"
            rows={2}
            className={styles.notesField}
            {...form.getInputProps('notes')}
          />

          <div className={styles.actionsGroup}>
            {onCancel && (
              <Button 
                variant="subtle" 
                onClick={onCancel}
                disabled={isSubmitting || loading}
                className={styles.cancelButton}
              >
                Cancel
              </Button>
            )}
            
            <Button 
              type="submit" 
              leftSection={<IconPlus size={16} />}
              loading={isSubmitting || loading}
              className={styles.submitButton}
            >
              Add Item
            </Button>
          </div>
        </Stack>
      </form>
    </Paper>
  );
}
