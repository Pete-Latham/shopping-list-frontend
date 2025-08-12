import axios from 'axios';
import type {
  LoginRequest,
  RegisterRequest,
  ChangePasswordRequest,
  RefreshTokenRequest,
  LoginResponse,
  RefreshTokenResponse,
  User,
  AuthStatus,
} from '../types/auth';

// Use the same base URL as the main API client
const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

const authClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 3000, // 3 second timeout for all requests
});

// Request interceptor to add auth token (except for login/register)
authClient.interceptors.request.use((config) => {
  // Don't add auth header for login, register, or status endpoints
  const noAuthEndpoints = ['/auth/login', '/auth/register', '/auth/status'];
  const isNoAuthEndpoint = noAuthEndpoints.some(endpoint => 
    config.url?.includes(endpoint)
  );
  
  if (!isNoAuthEndpoint) {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor to handle auth errors
authClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data on 401 responses
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_refresh_token');
      localStorage.removeItem('auth_user');
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  // Check authentication status
  getStatus: (): Promise<AuthStatus> =>
    authClient.get('/auth/status').then(res => res.data),

  // Register new user
  register: (userData: RegisterRequest): Promise<User> =>
    authClient.post('/auth/register', userData).then(res => res.data),

  // Login user
  login: (credentials: LoginRequest): Promise<LoginResponse> =>
    authClient.post('/auth/login', credentials).then(res => res.data),

  // Get user profile
  getProfile: (): Promise<User> =>
    authClient.get('/auth/profile').then(res => res.data),

  // Change password
  changePassword: (passwords: ChangePasswordRequest): Promise<{ message: string }> =>
    authClient.post('/auth/change-password', passwords).then(res => res.data),

  // Refresh tokens
  refreshTokens: (refreshData: RefreshTokenRequest): Promise<RefreshTokenResponse> =>
    authClient.post('/auth/refresh', refreshData).then(res => res.data),

  // Logout
  logout: (): Promise<{ message: string }> =>
    authClient.post('/auth/logout').then(res => res.data),
};
