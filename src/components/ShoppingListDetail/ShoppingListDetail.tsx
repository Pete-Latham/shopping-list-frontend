import React, { useState } from 'react';
import {
  Button,
  Group,
  Text,
  TextInput,
  Textarea,
  Badge,
  Progress,
  ActionIcon,
  Modal,
  Stack,
  Divider,
  Alert,
  LoadingOverlay
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconArrowLeft,
  IconEdit,
  IconCheck,
  IconX,
  IconPlus,
  IconShoppingCart,
  IconAlertCircle,
  IconTrash
} from '@tabler/icons-react';
import type { UpdateShoppingListDto, CreateShoppingListItemDto, UpdateShoppingListItemDto } from '../../types';
import { ShoppingListItem } from '../ShoppingListItem';
import { AddItemForm } from '../AddItemForm';
import { UserMenu } from '../UserMenu';
import {
  useShoppingList,
  useUpdateShoppingList,
  useDeleteShoppingList,
  useAddShoppingListItem,
  useUpdateShoppingListItem,
  useDeleteShoppingListItem
} from '../../hooks/useShoppingLists';
import styles from './ShoppingListDetail.module.css';

export interface ShoppingListDetailProps {
  /**
   * Shopping list ID to display
   */
  listId: number;

  /**
   * Callback when user wants to go back
   */
  onBack?: () => void;

  /**
   * Callback when list is deleted
   */
  onDeleted?: () => void;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * ShoppingListDetail - Displays and allows editing of a shopping list
 * 
 * Features:
 * - Mobile-first responsive design
 * - Inline editing of list name and description
 * - Add, edit, delete, and toggle items
 * - Progress tracking
 * - Delete confirmation modal
 * 
 * @param props - ShoppingListDetailProps
 * @returns JSX.Element
 */
export const ShoppingListDetail: React.FC<ShoppingListDetailProps> = ({
  listId,
  onBack,
  onDeleted,
  className
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);

  // API hooks
  const { data: shoppingList, isLoading, error } = useShoppingList(listId);
  const updateListMutation = useUpdateShoppingList();
  const deleteListMutation = useDeleteShoppingList();
  const addItemMutation = useAddShoppingListItem();
  const updateItemMutation = useUpdateShoppingListItem();
  const deleteItemMutation = useDeleteShoppingListItem();

  // Form for editing list details
  const editForm = useForm<UpdateShoppingListDto>({
    initialValues: {
      name: shoppingList?.name ?? '',
      description: shoppingList?.description ?? '',
    },
  });

  // Update form when data loads
  React.useEffect(() => {
    if (shoppingList) {
      editForm.setValues({
        name: shoppingList.name,
        description: shoppingList.description ?? '',
      });
    }
  }, [shoppingList]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sort items: unchecked items first (alphabetically), then checked items (alphabetically)
  // This must be called at the top level to follow Rules of Hooks
  const sortedItems = React.useMemo(() => {
    if (!shoppingList?.items || shoppingList.items.length === 0) {
      return [];
    }

    const uncheckedItems = shoppingList.items
      .filter(item => !item.completed)
      .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

    const checkedItems = shoppingList.items
      .filter(item => item.completed)
      .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

    return [...uncheckedItems, ...checkedItems];
  }, [shoppingList?.items]);

  // Combine CSS classes
  const containerClass = className
    ? `${styles.container} ${className}`
    : styles.container;

  // Handle list editing
  const handleEditSubmit = async (values: UpdateShoppingListDto) => {
    try {
      await updateListMutation.mutateAsync({
        id: listId,
        data: {
          name: values.name?.trim(),
          description: values.description?.trim() ?? undefined,
        }
      });

      setIsEditing(false);
      notifications.show({
        title: 'Success',
        message: 'Shopping list updated successfully!',
        color: 'green',
        icon: <IconCheck size={16} />,
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: `Failed to update shopping list. Please try again: ${error}`,
        color: 'red',
        icon: <IconX size={16} />,
      });
    }
  };

  const handleCancelEdit = () => {
    if (shoppingList) {
      editForm.setValues({
        name: shoppingList.name,
        description: shoppingList.description ?? '',
      });
    }
    setIsEditing(false);
  };

  // Handle list deletion
  const handleDeleteList = async () => {
    try {
      await deleteListMutation.mutateAsync(listId);
      notifications.show({
        title: 'Success',
        message: 'Shopping list deleted successfully!',
        color: 'green',
        icon: <IconCheck size={16} />,
      });
      closeDeleteModal();
      onDeleted?.();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: `Failed to update shopping list. Please try again: ${error}`,
        color: 'red',
        icon: <IconX size={16} />,
      });
    }
  };

  // Handle item operations
  const handleAddItem = async (itemData: CreateShoppingListItemDto) => {
    await addItemMutation.mutateAsync({
      listId,
      data: itemData
    });
    setShowAddForm(false);
  };

  const handleToggleItem = async (itemId: number, completed: boolean) => {
    await updateItemMutation.mutateAsync({
      listId,
      itemId,
      data: { completed }
    });
  };

  const handleDeleteItem = async (itemId: number) => {
    await deleteItemMutation.mutateAsync({ listId, itemId });
  };

  const handleEditItem = (itemId: number) => {
    setEditingItemId(itemId);
    // Close the add form if it's open
    setShowAddForm(false);
  };

  const handleUpdateItem = async (itemId: number, data: UpdateShoppingListItemDto) => {
    await updateItemMutation.mutateAsync({
      listId,
      itemId,
      data
    });
    // Exit edit mode after successful update
    setEditingItemId(null);
  };

  const handleCancelEditItem = () => {
    setEditingItemId(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={containerClass}>
        <LoadingOverlay visible />
        <div className={styles.loading}>
          Loading shopping list...
        </div>
      </div>
    );
  }

  // Error state
  if (error ?? !shoppingList) {
    return (
      <div className={containerClass}>
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Error"
          color="red"
          className={styles.error}
        >
          {error?.message ?? 'Shopping list not found'}
        </Alert>
        {onBack && (
          <Button
            leftSection={<IconArrowLeft size={16} />}
            variant="light"
            onClick={onBack}
            className={styles.backButton}
          >
            Go Back
          </Button>
        )}
      </div>
    );
  }

  // Calculate progress
  const completedItems = shoppingList.items.filter(item => item.completed).length;
  const totalItems = shoppingList.items.length;
  const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const getStatusColor = () => {
    if (completionPercentage === 100) return 'green';
    if (completionPercentage >= 50) return 'yellow';
    return 'blue';
  };

  return (
    <div className={containerClass}>
      {/* Header */}
      <header className={styles.header}>
        <Group justify="space-between" align="flex-start" className={styles.headerContent}>
          {onBack && (
            <ActionIcon
              variant="subtle"
              size="lg"
              onClick={onBack}
              aria-label="Go back"
              className={styles.backButtonIcon}
            >
              <IconArrowLeft size={20} />
            </ActionIcon>
          )}

          <div className={styles.headerActions}>
            <ActionIcon
              variant="subtle"
              color="blue"
              size="lg"
              onClick={() => setIsEditing(!isEditing)}
              aria-label={isEditing ? "Cancel editing" : "Edit shopping list"}
              className={styles.editButton}
            >
              {isEditing ? <IconX size={20} /> : <IconEdit size={20} />}
            </ActionIcon>

            <ActionIcon
              variant="subtle"
              color="red"
              size="lg"
              onClick={openDeleteModal}
              aria-label="Delete shopping list"
              className={styles.deleteButton}
            >
              <IconTrash size={20} />
            </ActionIcon>
            
            <UserMenu />
          </div>
        </Group>
      </header>

      {/* List Details */}
      <div className={styles.listDetails}>
        {isEditing ? (
          <form onSubmit={editForm.onSubmit(handleEditSubmit)} className={styles.editForm}>
            <Stack gap="md">
              <TextInput
                label="List Name"
                placeholder="Enter list name..."
                required
                {...editForm.getInputProps('name')}
                className={styles.nameInput}
              />

              <Textarea
                label="Description"
                placeholder="Optional description..."
                rows={2}
                {...editForm.getInputProps('description')}
                className={styles.descriptionInput}
              />

              <Group justify="flex-end" gap="sm" className={styles.editActions}>
                <Button
                  variant="subtle"
                  onClick={handleCancelEdit}
                  disabled={updateListMutation.isPending}
                  className={styles.cancelButton}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  leftSection={<IconCheck size={16} />}
                  loading={updateListMutation.isPending}
                  className={styles.saveButton}
                >
                  Save Changes
                </Button>
              </Group>
            </Stack>
          </form>
        ) : (
          <div className={styles.listInfo}>
            <Group align="flex-start" mb="sm" className={styles.titleGroup}>
              <IconShoppingCart size={24} color="var(--mantine-color-blue-6)" />
              <div className={styles.titleContent}>
                <Text size="xl" fw={600} className={styles.listTitle}>
                  {shoppingList.name}
                </Text>
                {shoppingList.description && (
                  <Text size="sm" c="dimmed" className={styles.listDescription}>
                    {shoppingList.description}
                  </Text>
                )}
              </div>
            </Group>

            {/* Progress Section */}
            <div className={styles.progressSection}>
              <Group justify="space-between" mb="xs">
                <Badge color={getStatusColor()} variant="light" className={styles.progressBadge}>
                  {completedItems}/{totalItems} items
                </Badge>
                {completionPercentage === 100 && (
                  <Badge color="green" variant="filled" className={styles.completeBadge}>
                    Complete!
                  </Badge>
                )}
              </Group>

              <Progress
                value={completionPercentage}
                color={getStatusColor()}
                size="md"
                striped={completionPercentage > 0 && completionPercentage < 100}
                className={styles.progressBar}
              />
            </div>
          </div>
        )}
      </div>

      <Divider className={styles.divider} />

      {/* Items Section */}
      <div className={styles.itemsSection}>
        <Group justify="space-between" align="center" mb="lg" className={styles.itemsHeader}>
          <Text size="lg" fw={500}>
            Items ({totalItems})
          </Text>

          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => setShowAddForm(!showAddForm)}
            variant={showAddForm ? "subtle" : "light"}
            className={styles.addItemButton}
          >
            {showAddForm ? 'Cancel' : 'Add Item'}
          </Button>
        </Group>

        {/* Add Item Form */}
        {showAddForm && (
          <div className={styles.addItemFormContainer}>
            <AddItemForm
              onAdd={handleAddItem}
              onCancel={() => setShowAddForm(false)}
              loading={addItemMutation.isPending}
            />
          </div>
        )}

        {/* Items List */}
        <div className={styles.itemsList}>
          {sortedItems.length > 0 ? (
            <Stack gap="sm">
              {sortedItems.map((item) => (
                <ShoppingListItem
                  key={item.id}
                  item={item}
                  onToggleComplete={handleToggleItem}
                  onDelete={handleDeleteItem}
                  onEdit={handleEditItem}
                  onUpdate={handleUpdateItem}
                  editingItemId={editingItemId}
                  onCancelEdit={handleCancelEditItem}
                  updateLoading={updateItemMutation.isPending}
                />
              ))}
            </Stack>
          ) : (
            <div className={styles.emptyState}>
              <Text size="lg" c="dimmed" ta="center">
                No items yet
              </Text>
              <Text size="sm" c="dimmed" ta="center">
                Add your first item to get started!
              </Text>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title="Delete Shopping List"
        size="sm"
        centered
        className={styles.deleteModal}
      >
        <Stack>
          <Text>
            Are you sure you want to delete "{shoppingList.name}"?
            This action cannot be undone.
          </Text>

          <Group justify="flex-end" gap="sm">
            <Button
              variant="subtle"
              onClick={closeDeleteModal}
              disabled={deleteListMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              color="red"
              onClick={handleDeleteList}
              loading={deleteListMutation.isPending}
              leftSection={<IconTrash size={16} />}
            >
              Delete List
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
};

export default ShoppingListDetail;
