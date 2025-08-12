import { authClient } from './authClient';
import type {
  ShoppingList,
  ShoppingListItem,
  CreateShoppingListDto,
  UpdateShoppingListDto,
  CreateShoppingListItemDto,
  UpdateShoppingListItemDto,
} from '../types';
import { mockShoppingListsApi } from './mock';
import { frontendConfig, type FrontendConfig } from '../config/frontend.config';

// Configuration will be loaded from backend or fall back to environment variables
let API_CONFIG: FrontendConfig | null = null;

// Initialize configuration from backend
const initializeConfig = async () => {
  if (!API_CONFIG) {
    try {
      API_CONFIG = await frontendConfig.getConfig();
      // console.log('[API CLIENT] Configuration loaded:', {
      //   apiUrl: API_CONFIG.apiUrl,
      //   mockApi: API_CONFIG.enableMockApi
      // });
    } catch (error) {
      // console.error('[API CLIENT] Failed to load configuration, using defaults:', error);
      // Fallback to default configuration
      API_CONFIG = {
        apiUrl: import.meta.env.VITE_API_URL ?? '/api',
        enableMockApi: import.meta.env.VITE_USE_MOCK_API === 'true'
      };
    }
  }
  return API_CONFIG;
};

// Get current configuration (async)
const getConfig = async () => {
  return await initializeConfig();
};

// Use the enhanced authClient with automatic token refresh
const apiClient = authClient;

// Request interceptor for debugging
// apiClient.interceptors.request.use((config) => {
//   console.log('[API CLIENT] Making request:', config.method?.toUpperCase(), config.url, 'Full URL:', config.baseURL + config.url);
//   return config;
// });

// Helper function: use mock only if explicitly requested, otherwise use real API
const withMockFallback = async <T>(realApiFn: () => Promise<T>, mockApiFn: () => Promise<T>): Promise<T> => {
  const config = await getConfig();
  
  if (config.enableMockApi) {
    // ('[API] Using mock data (enableMockApi=true)');
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
