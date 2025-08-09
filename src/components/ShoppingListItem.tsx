import { Group, Text, Checkbox, Badge, ActionIcon, Paper } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import type { ShoppingListItem as ShoppingListItemType, UpdateShoppingListItemDto } from '../types';
import { EditItemForm } from './EditItemForm';
import styles from './ShoppingListItem.module.css';
import { clsx } from 'clsx';

interface ShoppingListItemProps {
  item: ShoppingListItemType;
  onToggleComplete?: (itemId: number, completed: boolean) => void;
  onDelete?: (itemId: number) => void;
  onEdit?: (itemId: number) => void;
  onUpdate?: (itemId: number, data: UpdateShoppingListItemDto) => Promise<void>;
  editingItemId?: number | null;
  onCancelEdit?: () => void;
  updateLoading?: boolean;
}

export const ShoppingListItem: React.FC<ShoppingListItemProps> = ({
  item,
  onToggleComplete,
  onDelete,
  onEdit,
  onUpdate,
  editingItemId,
  onCancelEdit,
  updateLoading = false
}) => {
  const handleToggle = () => {
    onToggleComplete?.(item.id, !item.completed);
  };

  const handleUpdate = async (itemId: number, data: UpdateShoppingListItemDto) => {
    if (onUpdate) {
      await onUpdate(itemId, data);
    }
  };

  // If this item is being edited, show the edit form
  if (editingItemId === item.id && onUpdate) {
    return (
      <EditItemForm
        item={item}
        onUpdate={handleUpdate}
        onCancel={onCancelEdit}
        loading={updateLoading}
      />
    );
  }

  return (
    <Paper 
      p="md" 
      shadow="xs" 
      withBorder 
      className={clsx(styles.itemContainer, {
        [styles.completed]: item.completed
      })}
    >
      <Group justify="space-between" align="flex-start">
        <Group align="flex-start" className={styles.itemContent}>
          <Checkbox
            checked={item.completed}
            onChange={handleToggle}
            size="md"
            color="green"
            className={styles.checkbox}
          />
          
          <div className={styles.itemContent}>
            <Text 
              fw={500} 
              size="md" 
              className={clsx(styles.itemName, {
                [styles.completed]: item.completed
              })}
            >
              {item.name}
            </Text>
            
            <div className={styles.itemDetails}>
              {item.quantity && (
                <Badge variant="light" color="blue" size="sm" className={styles.quantityBadge}>
                  {item.quantity}{item.unit ? ` ${item.unit}` : ''}
                </Badge>
              )}
              
              {item.notes && (
                <Text size="sm" className={styles.notes}>
                  {item.notes}
                </Text>
              )}
            </div>
          </div>
        </Group>
        
        <div className={styles.actions}>
          {onEdit && (
            <ActionIcon 
              variant="subtle" 
              color="blue"
              onClick={() => onEdit(item.id)}
              aria-label="Edit item"
              className={styles.actionButton}
            >
              <IconEdit size={16} />
            </ActionIcon>
          )}
          
          {onDelete && (
            <ActionIcon 
              variant="subtle" 
              color="red"
              onClick={() => onDelete(item.id)}
              aria-label="Delete item"
              className={styles.actionButton}
            >
              <IconTrash size={16} />
            </ActionIcon>
          )}
        </div>
      </Group>
    </Paper>
  );
};
