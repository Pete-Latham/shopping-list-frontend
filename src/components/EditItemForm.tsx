import { useState } from 'react';
import { 
  TextInput, 
  NumberInput, 
  Select, 
  Textarea, 
  Button, 
  Paper,
  Stack,
  Group
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import type { ShoppingListItem, UpdateShoppingListItemDto } from '../types';
import styles from './EditItemForm.module.css';
import { clsx } from 'clsx';

interface EditItemFormProps {
  item: ShoppingListItem;
  onUpdate: (itemId: number, data: UpdateShoppingListItemDto) => Promise<void>;
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

export function EditItemForm({ item, onUpdate, onCancel, loading = false }: EditItemFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UpdateShoppingListItemDto>({
    initialValues: {
      name: item.name,
      quantity: item.quantity || undefined,
      unit: item.unit || '',
      notes: item.notes || ''
    },
    validate: {
      name: (value) => (!value || value.trim().length < 2 ? 'Item name must be at least 2 characters' : null),
      quantity: (value) => (value !== undefined && value <= 0 ? 'Quantity must be greater than 0' : null),
    },
  });

  const handleSubmit = async (values: UpdateShoppingListItemDto) => {
    setIsSubmitting(true);
    try {
      // Clean up the data before sending
      const cleanedValues = {
        name: values.name?.trim(),
        quantity: values.quantity || undefined,
        unit: values.unit?.trim() || undefined,
        notes: values.notes?.trim() || undefined,
      };

      await onUpdate(item.id, cleanedValues);
      
      notifications.show({
        title: 'Success',
        message: 'Item updated successfully!',
        color: 'green',
        icon: <IconCheck size={16} />,
      });
      
      // Call onCancel to exit edit mode
      onCancel?.();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update item. Please try again.',
        color: 'red',
        icon: <IconX size={16} />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    form.setValues({
      name: item.name,
      quantity: item.quantity || undefined,
      unit: item.unit || '',
      notes: item.notes || ''
    });
    onCancel?.();
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

          <Group justify="flex-end" gap="sm" className={styles.actionsGroup}>
            <Button 
              variant="subtle" 
              onClick={handleCancel}
              disabled={isSubmitting || loading}
              className={styles.cancelButton}
            >
              Cancel
            </Button>
            
            <Button 
              type="submit" 
              leftSection={<IconCheck size={16} />}
              loading={isSubmitting || loading}
              className={styles.submitButton}
            >
              Update Item
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}
