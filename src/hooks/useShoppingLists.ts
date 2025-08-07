import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { shoppingListsApi } from '../api/client';
import type {
  CreateShoppingListDto,
  UpdateShoppingListDto,
  CreateShoppingListItemDto,
  UpdateShoppingListItemDto,
} from '../types';

// Query keys
export const shoppingListKeys = {
  all: ['shopping-lists'] as const,
  lists: () => [...shoppingListKeys.all, 'list'] as const,
  list: (id: number) => [...shoppingListKeys.lists(), id] as const,
};

// Get all shopping lists
export const useShoppingLists = () => {
  return useQuery({
    queryKey: shoppingListKeys.lists(),
    queryFn: shoppingListsApi.getAll,
  });
};

// Get a single shopping list
export const useShoppingList = (id: number) => {
  return useQuery({
    queryKey: shoppingListKeys.list(id),
    queryFn: () => shoppingListsApi.getById(id),
    enabled: !!id,
  });
};

// Create shopping list
export const useCreateShoppingList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateShoppingListDto) => shoppingListsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shoppingListKeys.lists() });
    },
  });
};

// Update shopping list
export const useUpdateShoppingList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateShoppingListDto }) =>
      shoppingListsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: shoppingListKeys.lists() });
      queryClient.invalidateQueries({ queryKey: shoppingListKeys.list(variables.id) });
    },
  });
};

// Delete shopping list
export const useDeleteShoppingList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => shoppingListsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shoppingListKeys.lists() });
    },
  });
};

// Add item to shopping list
export const useAddShoppingListItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listId, data }: { listId: number; data: CreateShoppingListItemDto }) =>
      shoppingListsApi.addItem(listId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: shoppingListKeys.list(variables.listId) });
    },
  });
};

// Update shopping list item
export const useUpdateShoppingListItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listId, itemId, data }: { listId: number; itemId: number; data: UpdateShoppingListItemDto }) =>
      shoppingListsApi.updateItem(listId, itemId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: shoppingListKeys.list(variables.listId) });
    },
  });
};

// Delete shopping list item
export const useDeleteShoppingListItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listId, itemId }: { listId: number; itemId: number }) =>
      shoppingListsApi.deleteItem(listId, itemId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: shoppingListKeys.list(variables.listId) });
    },
  });
};
