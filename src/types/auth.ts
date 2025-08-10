export interface User {
  id: number;
  email: string;
  username: string;
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface AuthStatus {
  authEnabled: boolean;
  message: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  authEnabled: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  changePassword: (passwords: ChangePasswordRequest) => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}
