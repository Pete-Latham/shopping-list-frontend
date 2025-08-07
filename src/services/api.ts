import axios from 'axios';
import type {
  ShoppingList,
  ShoppingListItem,
  CreateShoppingListDto,
  CreateShoppingListItemDto,
  UpdateShoppingListDto,
  UpdateShoppingListItemDto,
} from '../types';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Shopping Lists API
export const shoppingListsApi = {
  // Get all shopping lists
  getAll: (): Promise<ShoppingList[]> =>
    api.get('/shopping-lists').then(response => response.data),

  // Get a single shopping list
  getById: (id: number): Promise<ShoppingList> =>
    api.get(`/shopping-lists/${id}`).then(response => response.data),

  // Create a new shopping list
  create: (data: CreateShoppingListDto): Promise<ShoppingList> =>
    api.post('/shopping-lists', data).then(response => response.data),

  // Update a shopping list
  update: (id: number, data: UpdateShoppingListDto): Promise<ShoppingList> =>
    api.patch(`/shopping-lists/${id}`, data).then(response => response.data),

  // Delete a shopping list
  delete: (id: number): Promise<void> =>
    api.delete(`/shopping-lists/${id}`).then(() => undefined),

  // Add item to shopping list
  addItem: (listId: number, data: CreateShoppingListItemDto): Promise<ShoppingListItem> =>
    api.post(`/shopping-lists/${listId}/items`, data).then(response => response.data),

  // Update shopping list item
  updateItem: (
    listId: number,
    itemId: number,
    data: UpdateShoppingListItemDto
  ): Promise<ShoppingListItem> =>
    api.patch(`/shopping-lists/${listId}/items/${itemId}`, data).then(response => response.data),

  // Delete shopping list item
  deleteItem: (listId: number, itemId: number): Promise<void> =>
    api.delete(`/shopping-lists/${listId}/items/${itemId}`).then(() => undefined),
};

export default api;
