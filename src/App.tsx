import React, { useState } from 'react';
import { useShoppingLists } from './hooks/useShoppingLists';
import { ShoppingListCard } from './components/ShoppingListCard';
import { ShoppingListDetail } from './components/ShoppingListDetail';
import styles from './App.module.css';

const App: React.FC = () => {
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const { data: shoppingLists, isLoading, error } = useShoppingLists();

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
    <div className={`${styles.app} mobile-safe-area`}>
      <header className={styles.appHeader}>
        <h1>🛒 Shopping Lists</h1>
      </header>
      
      <main className={styles.mainContent}>
        {shoppingLists && shoppingLists.length > 0 ? (
          <div className={styles.shoppingListsGrid}>
            {shoppingLists.map((list) => (
              <ShoppingListCard 
                key={list.id} 
                shoppingList={list} 
                onView={handleViewList}
              />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>No shopping lists yet. Create your first one!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
