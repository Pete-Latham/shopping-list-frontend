// Mock API for frontend-only development
import type {
  ShoppingList,
  ShoppingListItem,
  CreateShoppingListDto,
  UpdateShoppingListDto,
  CreateShoppingListItemDto,
  UpdateShoppingListItemDto,
} from '../types';

// Mock data storage (in-memory)
let mockLists: ShoppingList[] = [
  {
    id: 1,
    name: 'Weekly Groceries',
    description: 'Regular grocery shopping list',
    items: [
      {
        id: 1,
        name: 'Milk',
        quantity: 2,
        unit: 'liters',
        completed: false,
        notes: 'Whole milk preferred',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 2,
        name: 'Bread',
        quantity: 1,
        unit: 'loaf',
        completed: true,
        notes: 'Whole wheat',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 3,
        name: 'Eggs',
        quantity: 12,
        unit: 'pieces',
        completed: false,
        notes: 'Large eggs',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Party Supplies',
    description: 'Items needed for the weekend party',
    items: [
      {
        id: 4,
        name: 'Balloons',
        quantity: 20,
        unit: 'pieces',
        completed: false,
        notes: 'Mixed colors',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 5,
        name: 'Paper plates',
        quantity: 2,
        unit: 'packs',
        completed: true,
        notes: 'Disposable',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let nextId = 6; // For generating new IDs
let nextListId = 3;

// Helper to simulate network delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API implementation
export const mockShoppingListsApi = {
  // Get all shopping lists
  getAll: async (): Promise<ShoppingList[]> => {
    await delay(300);
    console.log('[MOCK API] Getting all shopping lists');
    return [...mockLists];
  },

  // Get a single shopping list by ID
  getById: async (id: number): Promise<ShoppingList> => {
    await delay(200);
    console.log(`[MOCK API] Getting shopping list ${id}`);
    const list = mockLists.find(l => l.id === id);
    if (!list) {
      throw new Error(`Shopping list ${id} not found`);
    }
    return { ...list };
  },

  // Create a new shopping list
  create: async (data: CreateShoppingListDto): Promise<ShoppingList> => {
    await delay(400);
    console.log('[MOCK API] Creating shopping list:', data);
    const newList: ShoppingList = {
      id: nextListId++,
      name: data.name,
      description: data.description,
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockLists.push(newList);
    return { ...newList };
  },

  // Update a shopping list
  update: async (id: number, data: UpdateShoppingListDto): Promise<ShoppingList> => {
    await delay(300);
    console.log(`[MOCK API] Updating shopping list ${id}:`, data);
    const listIndex = mockLists.findIndex(l => l.id === id);
    if (listIndex === -1) {
      throw new Error(`Shopping list ${id} not found`);
    }
    
    mockLists[listIndex] = {
      ...mockLists[listIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return { ...mockLists[listIndex] };
  },

  // Delete a shopping list
  delete: async (id: number): Promise<void> => {
    await delay(200);
    console.log(`[MOCK API] Deleting shopping list ${id}`);
    const listIndex = mockLists.findIndex(l => l.id === id);
    if (listIndex === -1) {
      throw new Error(`Shopping list ${id} not found`);
    }
    mockLists.splice(listIndex, 1);
  },

  // Add item to shopping list
  addItem: async (listId: number, data: CreateShoppingListItemDto): Promise<ShoppingListItem> => {
    await delay(300);
    console.log(`[MOCK API] Adding item to list ${listId}:`, data);
    const listIndex = mockLists.findIndex(l => l.id === listId);
    if (listIndex === -1) {
      throw new Error(`Shopping list ${listId} not found`);
    }

    const newItem: ShoppingListItem = {
      id: nextId++,
      name: data.name,
      quantity: data.quantity || 1,
      unit: data.unit,
      completed: false,
      notes: data.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockLists[listIndex].items.push(newItem);
    mockLists[listIndex].updatedAt = new Date().toISOString();
    
    return { ...newItem };
  },

  // Update an item in shopping list
  updateItem: async (listId: number, itemId: number, data: UpdateShoppingListItemDto): Promise<ShoppingListItem> => {
    await delay(200);
    console.log(`[MOCK API] Updating item ${itemId} in list ${listId}:`, data);
    const listIndex = mockLists.findIndex(l => l.id === listId);
    if (listIndex === -1) {
      throw new Error(`Shopping list ${listId} not found`);
    }

    const itemIndex = mockLists[listIndex].items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error(`Item ${itemId} not found in shopping list ${listId}`);
    }

    mockLists[listIndex].items[itemIndex] = {
      ...mockLists[listIndex].items[itemIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    mockLists[listIndex].updatedAt = new Date().toISOString();

    return { ...mockLists[listIndex].items[itemIndex] };
  },

  // Delete an item from shopping list
  deleteItem: async (listId: number, itemId: number): Promise<void> => {
    await delay(200);
    console.log(`[MOCK API] Deleting item ${itemId} from list ${listId}`);
    const listIndex = mockLists.findIndex(l => l.id === listId);
    if (listIndex === -1) {
      throw new Error(`Shopping list ${listId} not found`);
    }

    const itemIndex = mockLists[listIndex].items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error(`Item ${itemId} not found in shopping list ${listId}`);
    }

    mockLists[listIndex].items.splice(itemIndex, 1);
    mockLists[listIndex].updatedAt = new Date().toISOString();
  },
};
