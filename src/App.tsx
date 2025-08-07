import React from 'react';
import { useShoppingLists } from './hooks/useShoppingLists';
import { ShoppingListCard } from './components/ShoppingListCard';
import styles from './App.module.css';

const App: React.FC = () => {
  const { data: shoppingLists, isLoading, error } = useShoppingLists();

  if (isLoading) return <div className={styles.loading}>Loading shopping lists...</div>;
  if (error) return <div className={styles.error}>Error: {error.message}</div>;

  return (
    <div className={styles.app}>
      <header className={styles.appHeader}>
        <h1>🛒 Shopping Lists</h1>
      </header>
      
      <main className={styles.mainContent}>
        {shoppingLists && shoppingLists.length > 0 ? (
          <div className={styles.shoppingListsGrid}>
            {shoppingLists.map((list) => (
              <ShoppingListCard key={list.id} shoppingList={list} />
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
