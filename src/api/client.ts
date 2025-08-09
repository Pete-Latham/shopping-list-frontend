import axios from 'axios';
import type {
  ShoppingList,
  ShoppingListItem,
  CreateShoppingListDto,
  UpdateShoppingListDto,
  CreateShoppingListItemDto,
  UpdateShoppingListItemDto,
} from '../types';
import { mockShoppingListsApi } from './mock';

// Use proxy in development, allow override with environment variable
// If VITE_API_URL is not set, use '/api' which will be proxied by Vite
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Only use mock API when explicitly requested with VITE_USE_MOCK_API=true
// This prevents masking backend connection issues with automatic fallback
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

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

// Helper function: use mock only if explicitly requested, otherwise use real API
const withMockFallback = async <T>(realApiFn: () => Promise<T>, mockApiFn: () => Promise<T>): Promise<T> => {
  if (USE_MOCK_API) {
    console.log('[API] Using mock data (VITE_USE_MOCK_API=true)');
    // Set global flag for DevBanner
    if (typeof window !== 'undefined') {
      window.__DEV_API_MODE__ = 'mock';
    }
    return await mockApiFn();
  } else {
    try {
      const result = await realApiFn();
      // Set global flag for DevBanner
      if (typeof window !== 'undefined') {
        window.__DEV_API_MODE__ = 'real';
      }
      return result;
    } catch (error) {
      console.error('[API] Backend API request failed:', error);
      // Set global flag for DevBanner to show error state
      if (typeof window !== 'undefined') {
        window.__DEV_API_MODE__ = 'error';
      }
      // Re-throw the error instead of falling back to mock
      throw error;
    }
  }
};

// Shopping Lists API (mock only when explicitly requested)
export const shoppingListsApi = {
  // Get all shopping lists
  getAll: (): Promise<ShoppingList[]> =>
    withMockFallback(
      () => apiClient.get('/shopping-lists').then(res => res.data),
      () => mockShoppingListsApi.getAll()
    ),

  // Get a single shopping list by ID
  getById: (id: number): Promise<ShoppingList> =>
    withMockFallback(
      () => apiClient.get(`/shopping-lists/${id}`).then(res => res.data),
      () => mockShoppingListsApi.getById(id)
    ),

  // Create a new shopping list
  create: (data: CreateShoppingListDto): Promise<ShoppingList> =>
    withMockFallback(
      () => apiClient.post('/shopping-lists', data).then(res => res.data),
      () => mockShoppingListsApi.create(data)
    ),

  // Update a shopping list
  update: (id: number, data: UpdateShoppingListDto): Promise<ShoppingList> =>
    withMockFallback(
      () => apiClient.patch(`/shopping-lists/${id}`, data).then(res => res.data),
      () => mockShoppingListsApi.update(id, data)
    ),

  // Delete a shopping list
  delete: (id: number): Promise<void> =>
    withMockFallback(
      () => apiClient.delete(`/shopping-lists/${id}`).then(res => res.data),
      () => mockShoppingListsApi.delete(id)
    ),

  // Add item to shopping list
  addItem: (listId: number, data: CreateShoppingListItemDto): Promise<ShoppingListItem> =>
    withMockFallback(
      () => apiClient.post(`/shopping-lists/${listId}/items`, data).then(res => res.data),
      () => mockShoppingListsApi.addItem(listId, data)
    ),

  // Update an item in shopping list
  updateItem: (listId: number, itemId: number, data: UpdateShoppingListItemDto): Promise<ShoppingListItem> =>
    withMockFallback(
      () => apiClient.patch(`/shopping-lists/${listId}/items/${itemId}`, data).then(res => res.data),
      () => mockShoppingListsApi.updateItem(listId, itemId, data)
    ),

  // Delete an item from shopping list
  deleteItem: (listId: number, itemId: number): Promise<void> =>
    withMockFallback(
      () => apiClient.delete(`/shopping-lists/${listId}/items/${itemId}`).then(res => res.data),
      () => mockShoppingListsApi.deleteItem(listId, itemId)
    ),

  // Get item suggestions for autocomplete
  getItemSuggestions: (query?: string): Promise<string[]> =>
    withMockFallback(
      () => apiClient.get('/items/suggestions', { params: { q: query } }).then(res => res.data),
      () => mockShoppingListsApi.getItemSuggestions(query)
    ),
};

// Health check
export const healthApi = {
  check: () => apiClient.get('/health').then(res => res.data),
};
