export interface ShoppingList {
  id: number;
  name: string;
  description?: string;
  items: ShoppingListItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ShoppingListItem {
  id: number;
  name: string;
  quantity: number;
  unit?: string;
  completed: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateShoppingListDto {
  name: string;
  description?: string;
}

export interface UpdateShoppingListDto {
  name?: string;
  description?: string;
}

export interface CreateShoppingListItemDto {
  name: string;
  quantity?: number;
  unit?: string;
  notes?: string;
}

export interface UpdateShoppingListItemDto {
  name?: string;
  quantity?: number;
  unit?: string;
  completed?: boolean;
  notes?: string;
}

// Global Window interface extension for development features
declare global {
  interface Window {
    __DEV_API_MODE__?: 'mock' | 'real';
  }
}
