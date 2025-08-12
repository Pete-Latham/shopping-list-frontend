import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';
import { shoppingListKeys } from './useShoppingLists';

// WebSocket event types for reference
// interface WebSocketEvents {
//   'list-created': (data: any) => void;
//   'list-updated': (data: any) => void;
//   'list-deleted': (data: { listId: number }) => void;
//   'item-added': (data: { listId: number; item: any }) => void;
//   'item-updated': (data: { listId: number; item: any }) => void;
//   'item-deleted': (data: { listId: number; itemId: number }) => void;
//   'user-joined': (data: { userId: number; listId: number }) => void;
//   'user-left': (data: { userId: number; listId: number }) => void;
// }

export const useShoppingListWebSocket = (listId?: number) => {
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);
  const { isAuthenticated, token } = useAuth();

  // Get the backend URL - adjust for containerized environment
  const getBackendUrl = () => {

    // Check if we have explicit WebSocket URL
    if (import.meta.env.VITE_WS_URL) {
      return import.meta.env.VITE_WS_URL;
    }

    // In development (including devcontainers):
    // - Browser connects to localhost:3000 (port-forwarded backend devcontainer)
    // - Frontend container talks to backend-dev service name internally (not used for WebSocket)
    if (import.meta.env.DEV) {
      return 'http://localhost:3000';
    }

    // In production, check if we have an absolute API URL
    let backendUrl = import.meta.env.VITE_API_URL;
    if (backendUrl && !backendUrl.startsWith('/')) {
      // Remove /api suffix if present
      backendUrl = backendUrl.replace(/\/api$/, '');
      return backendUrl;
    }

    // Final fallback for production
    return 'http://localhost:3000';
  };

  const connectSocket = useCallback(() => {
    // Don't connect if user is not authenticated
    if (!isAuthenticated) {
      // console.log('WebSocket: User not authenticated, skipping connection');
      return null;
    }

    if (socketRef.current?.connected) {
      return socketRef.current;
    }

    // Use token from auth context first, then fallback to localStorage
    const authToken = token || localStorage.getItem('auth_token') || localStorage.getItem('token');
    if (!authToken) {
      console.warn('No authentication token found for WebSocket connection. Available keys:', Object.keys(localStorage));
      return null;
    }

    const backendUrl = getBackendUrl();
    // Create socket connection with authentication to the shopping-lists namespace
    const socket = io(`${backendUrl}/shopping-lists`, {
      auth: {
        token: authToken
      },
      transports: ['polling', 'websocket'], // Try polling first, then websocket
      timeout: 20000, // Increase timeout for container networking
      retries: 5,
      forceNew: true, // Force new connection
    });

    // socket.on('connect', () => {
    //   console.log('🔗 WebSocket connected');
    // });

    // socket.on('disconnect', (reason) => {
    //   console.log('🔌 WebSocket disconnected:', reason);
    // });

    // socket.on('connect_error', (error) => {
    //   console.error('❌ WebSocket connection error:', error);
    // });

    // Set up event listeners for shopping list updates
    const setupEventListeners = () => {
      // List events
      socket.on('list-created', () => {
        // console.log('List created:', data);
        queryClient.invalidateQueries({ queryKey: shoppingListKeys.lists() });
      });

      socket.on('list-updated', (data) => {
        // console.log('List updated:', data);
        queryClient.invalidateQueries({ queryKey: shoppingListKeys.lists() });
        queryClient.invalidateQueries({ queryKey: shoppingListKeys.list(data.listId) });
      });

      socket.on('list-deleted', (data) => {
        // console.log('List deleted:', data);
        queryClient.invalidateQueries({ queryKey: shoppingListKeys.lists() });
        queryClient.removeQueries({ queryKey: shoppingListKeys.list(data.listId) });
      });

      // Item events
      socket.on('item-added', (data) => {
        // console.log('Item added:', data);
        queryClient.invalidateQueries({ queryKey: shoppingListKeys.list(data.listId) });
      });

      socket.on('item-updated', (data) => {
        // console.log('Item updated:', data);
        queryClient.invalidateQueries({ queryKey: shoppingListKeys.list(data.listId) });
      });

      socket.on('item-deleted', (data) => {
        // console.log('Item deleted:', data);
        queryClient.invalidateQueries({ queryKey: shoppingListKeys.list(data.listId) });
      });

      // User presence events
      // socket.on('user-joined', (data) => {
      //   console.log('User joined list:', data);
      //   // You could show a toast notification here
      // });

      // socket.on('user-left', (data) => {
      //   console.log('User left list:', data);
      //   // You could show a toast notification here
      // });
    };

    setupEventListeners();
    socketRef.current = socket;
    return socket;
  }, [queryClient, isAuthenticated, token]);

  const joinList = useCallback((targetListId: number) => {
    const socket = socketRef.current;
    if (socket?.connected) {
      // console.log(`🔗 Joining room for list ${targetListId}`);
      socket.emit('join-list', { listId: targetListId });
    } else {
      console.warn(`❌ Cannot join list ${targetListId} - socket not connected`);
    }
  }, []);

  const leaveList = useCallback((targetListId: number) => {
    const socket = socketRef.current;
    if (socket?.connected) {
      // console.log(`🚪 Leaving room for list ${targetListId}`);
      socket.emit('leave-list', { listId: targetListId });
    }
  }, []);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);

  // Handle authentication state changes
  useEffect(() => {
    if (!isAuthenticated && socketRef.current) {
      // User logged out, disconnect WebSocket
      // console.log('WebSocket: User logged out, disconnecting');
      disconnect();
    } else if (isAuthenticated && !socketRef.current?.connected) {
      // User logged in, connect WebSocket
      // console.log('WebSocket: User logged in, connecting');
      connectSocket();
    }
  }, [isAuthenticated, connectSocket, disconnect]);

  // Auto-connect when the hook is used
  useEffect(() => {
    if (isAuthenticated) {
      connectSocket();
    }

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [connectSocket, disconnect, isAuthenticated]);

  // Auto-join/leave lists when listId changes
  useEffect(() => {
    if (listId && socketRef.current?.connected) {
      joinList(listId);

      // Leave when component unmounts or listId changes
      return () => {
        leaveList(listId);
      };
    }
  }, [listId, joinList, leaveList]);

  // Auto-join current list when socket connects
  useEffect(() => {
    const socket = socketRef.current;
    if (socket) {
      const handleConnect = () => {
        if (listId) {
          joinList(listId);
        }
      };

      // If already connected, join immediately
      if (socket.connected && listId) {
        joinList(listId);
      }

      // Listen for future connections
      socket.on('connect', handleConnect);

      return () => {
        socket.off('connect', handleConnect);
      };
    }
  }, [listId, joinList]);

  return {
    socket: socketRef.current,
    isConnected: socketRef.current?.connected || false,
    connect: connectSocket,
    disconnect,
    joinList,
    leaveList,
  };
};
