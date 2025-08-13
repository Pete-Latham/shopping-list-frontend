import React, { useState } from 'react';
import { 
  useShoppingLists, 
  useCreateShoppingList, 
  useUpdateShoppingList, 
  useDeleteShoppingList 
} from './hooks/useShoppingLists';
import { useShoppingListWebSocket } from './hooks/useShoppingListWebSocket';
import { ShoppingListCard } from './components/ShoppingListCard';
import { ShoppingListDetail } from './components/ShoppingListDetail';
import { ShoppingListForm } from './components/ShoppingListForm';
import { DeleteConfirmation } from './components/DeleteConfirmation';
import { DevBanner } from './components/DevBanner';
import { AuthPage } from './components/AuthForms';
import { UserMenu } from './components/UserMenu';
import { useAuth } from './contexts/AuthContext';
import type { ShoppingList, CreateShoppingListDto, UpdateShoppingListDto } from './types';
import styles from './App.module.css';

const App: React.FC = () => {
  const { isAuthenticated, authEnabled } = useAuth();
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingList, setEditingList] = useState<ShoppingList | null>(null);
  const [deletingList, setDeletingList] = useState<ShoppingList | null>(null);
  
  // Only fetch shopping lists if user is authenticated or auth is disabled
  const shouldFetchLists = !authEnabled || isAuthenticated;
  const { data: shoppingLists, isLoading, error } = useShoppingLists(shouldFetchLists);
  const createListMutation = useCreateShoppingList();
  const updateListMutation = useUpdateShoppingList();
  const deleteListMutation = useDeleteShoppingList();
  
  // WebSocket connection for real-time updates
  // Only connect when user is authenticated (or auth is disabled) and not viewing a specific list
  const shouldConnectWebSocket = shouldFetchLists && !selectedListId;
  useShoppingListWebSocket(shouldConnectWebSocket ? undefined : null);

  // Navigation handlers
  const handleViewList = (listId: number) => {
    setSelectedListId(listId);
  };

  const handleBackToLists = () => {
    setSelectedListId(null);
  };

  const handleListDeleted = () => {
    setSelectedListId(null);
  };

  // Form handlers
  const handleCreateList = () => {
    setShowCreateForm(true);
  };

  const handleEditList = (listId: number) => {
    const list = shoppingLists?.find(l => l.id === listId);
    if (list) {
      setEditingList(list);
    }
  };

  const handleDeleteList = (listId: number) => {
    const list = shoppingLists?.find(l => l.id === listId);
    if (list) {
      setDeletingList(list);
    }
  };

  const handleFormSubmit = async (data: CreateShoppingListDto | UpdateShoppingListDto) => {
    try {
      if (editingList) {
        // Update existing list
        await updateListMutation.mutateAsync({ 
          id: editingList.id, 
          data: data as UpdateShoppingListDto 
        });
        setEditingList(null);
      } else {
        // Create new list
        await createListMutation.mutateAsync(data as CreateShoppingListDto);
        setShowCreateForm(false);
      }
    } catch (error) {
      // Error handling is managed by react-query
      console.error('Form submission error:', error);
    }
  };

  const handleFormCancel = () => {
    setShowCreateForm(false);
    setEditingList(null);
  };

  const handleDeleteConfirm = async () => {
    if (deletingList) {
      try {
        await deleteListMutation.mutateAsync(deletingList.id);
        setDeletingList(null);
      } catch (error) {
        // Error handling is managed by react-query
        console.error('Delete error:', error);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeletingList(null);
  };

  // Show authentication form if auth is enabled and user is not authenticated
  if (authEnabled && !isAuthenticated) {
    return <AuthPage />;
  }

  // Show detail view if a list is selected
  if (selectedListId) {
    return (
      <ShoppingListDetail 
        listId={selectedListId} 
        onBack={handleBackToLists}
        onDeleted={handleListDeleted}
        className="mobile-safe-area"
      />
    );
  }

  if (isLoading) return <div className={styles.loading}>Loading shopping lists...</div>;
  if (error) return <div className={styles.error}>Error: {error.message}</div>;

  return (
    <>
      <DevBanner />
      <div className={`${styles.app} mobile-safe-area`}>
        <header className={styles.appHeader}>
          <h1>🛒 Shopping Lists</h1>
          <div className={styles.headerActions}>
            <button 
              className={styles.createButton}
              onClick={handleCreateList}
              aria-label="Create new shopping list"
            >
              + New List
            </button>
            <UserMenu />
          </div>
        </header>
        
        <main className={styles.mainContent}>
          {shoppingLists && shoppingLists.length > 0 ? (
            <div className={styles.shoppingListsGrid}>
              {[...shoppingLists]
                .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
                .map((list) => (
                  <ShoppingListCard 
                    key={list.id} 
                    shoppingList={list} 
                    onView={handleViewList}
                    onEdit={handleEditList}
                    onDelete={handleDeleteList}
                  />
                ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No shopping lists yet. Create your first one!</p>
              <button 
                className={styles.createButtonLarge}
                onClick={handleCreateList}
              >
                🛒 Create Your First Shopping List
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Create/Edit Form Modal */}
      {(showCreateForm || editingList) && (
        <ShoppingListForm
          existingList={editingList || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          isLoading={editingList ? updateListMutation.isPending : createListMutation.isPending}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingList && (
        <DeleteConfirmation
          title="Delete Shopping List"
          message="Are you sure you want to delete this shopping list? All items in the list will also be deleted."
          itemName={deletingList.name}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          isLoading={deleteListMutation.isPending}
        />
      )}
    </>
  );
};

export default App;
