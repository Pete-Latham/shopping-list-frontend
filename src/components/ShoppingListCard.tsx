import { Card, Text, Badge, Group, Button, Menu, ActionIcon, Progress } from '@mantine/core';
import { IconDots, IconEdit, IconTrash, IconEye, IconShoppingCart } from '@tabler/icons-react';
import type { ShoppingList } from '../types';
import styles from './ShoppingListCard.module.css';

interface ShoppingListCardProps {
  shoppingList: ShoppingList;
  onView?: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export const ShoppingListCard: React.FC<ShoppingListCardProps> = ({
  shoppingList,
  onView,
  onEdit,
  onDelete
}) => {
  const completedItems = shoppingList.items.filter(item => item.completed).length;
  const totalItems = shoppingList.items.length;
  const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const getStatusColor = () => {
    if (completionPercentage === 100) return 'green';
    if (completionPercentage >= 50) return 'yellow';
    return 'blue';
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder className={styles.card}>
      <Group justify="space-between" mb="xs">
        <Group className={styles.cardHeader}>
          <IconShoppingCart size={20} color="var(--mantine-color-blue-6)" />
          <Text 
            fw={500} 
            size="lg"
            className={styles.cardTitle}
            onClick={() => onView?.(shoppingList.id)}
          >
            {shoppingList.name}
          </Text>
        </Group>
        
        {(onEdit || onDelete) && (
          <Menu shadow="md" width={120}>
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray">
                <IconDots size={16} />
              </ActionIcon>
            </Menu.Target>
            
            <Menu.Dropdown>
              {onView && (
                <Menu.Item 
                  leftSection={<IconEye size={14} />}
                  onClick={() => onView(shoppingList.id)}
                >
                  View
                </Menu.Item>
              )}
              {onEdit && (
                <Menu.Item 
                  leftSection={<IconEdit size={14} />}
                  onClick={() => onEdit(shoppingList.id)}
                >
                  Edit
                </Menu.Item>
              )}
              {onDelete && (
                <>
                  <Menu.Divider />
                  <Menu.Item 
                    leftSection={<IconTrash size={14} />}
                    color="red"
                    onClick={() => onDelete(shoppingList.id)}
                  >
                    Delete
                  </Menu.Item>
                </>
              )}
            </Menu.Dropdown>
          </Menu>
        )}
      </Group>

      {shoppingList.description && (
        <Text size="sm" c="dimmed" mb="md">
          {shoppingList.description}
        </Text>
      )}

      <Group justify="space-between" mb="sm">
        <Badge color={getStatusColor()} variant="light" className={styles.statusBadge}>
          {completedItems}/{totalItems} items
        </Badge>
        {completionPercentage === 100 && (
          <Badge color="green" variant="filled" className={styles.completeBadge}>
            Complete!
          </Badge>
        )}
      </Group>

      <div className={styles.progressSection}>
        <Progress 
          value={completionPercentage} 
          color={getStatusColor()} 
          size="sm" 
          striped={completionPercentage > 0 && completionPercentage < 100}
        />
      </div>

      {onView && (
        <Button 
          variant="light" 
          color="blue" 
          fullWidth 
          onClick={() => onView(shoppingList.id)}
          leftSection={<IconEye size={16} />}
          className={styles.actionButton}
        >
          View Shopping List
        </Button>
      )}

      <Text size="xs" c="dimmed" className={styles.metadata}>
        Created: {new Date(shoppingList.createdAt).toLocaleDateString()}
      </Text>
    </Card>
  );
};
