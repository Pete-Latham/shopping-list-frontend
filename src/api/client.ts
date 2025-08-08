import axios from 'axios';
import type {
  ShoppingList,
  ShoppingListItem,
  CreateShoppingListDto,
  UpdateShoppingListDto,
  CreateShoppingListItemDto,
  UpdateShoppingListItemDto,
} from '../types';

// Use proxy in development, allow override with environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
// apiClient.interceptors.request.use((config) => {
//   console.log('[API CLIENT] Making request:', config.method?.toUpperCase(), config.url, 'Full URL:', config.baseURL + config.url);
//   return config;
// });

// Shopping Lists API
export const shoppingListsApi = {
  // Get all shopping lists
  getAll: (): Promise<ShoppingList[]> =>
    apiClient.get('/shopping-lists').then(res => res.data),

  // Get a single shopping list by ID
  getById: (id: number): Promise<ShoppingList> =>
    apiClient.get(`/shopping-lists/${id}`).then(res => res.data),

  // Create a new shopping list
  create: (data: CreateShoppingListDto): Promise<ShoppingList> =>
    apiClient.post('/shopping-lists', data).then(res => res.data),

  // Update a shopping list
  update: (id: number, data: UpdateShoppingListDto): Promise<ShoppingList> =>
    apiClient.patch(`/shopping-lists/${id}`, data).then(res => res.data),

  // Delete a shopping list
  delete: (id: number): Promise<void> =>
    apiClient.delete(`/shopping-lists/${id}`).then(res => res.data),

  // Add item to shopping list
  addItem: (listId: number, data: CreateShoppingListItemDto): Promise<ShoppingListItem> =>
    apiClient.post(`/shopping-lists/${listId}/items`, data).then(res => res.data),

  // Update an item in shopping list
  updateItem: (listId: number, itemId: number, data: UpdateShoppingListItemDto): Promise<ShoppingListItem> =>
    apiClient.patch(`/shopping-lists/${listId}/items/${itemId}`, data).then(res => res.data),

  // Delete an item from shopping list
  deleteItem: (listId: number, itemId: number): Promise<void> =>
    apiClient.delete(`/shopping-lists/${listId}/items/${itemId}`).then(res => res.data),
};

// Health check
export const healthApi = {
  check: () => apiClient.get('/health').then(res => res.data),
};
