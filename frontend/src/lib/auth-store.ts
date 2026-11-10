// Authentication has been completely removed from the application
// This file provides dummy implementations for compatibility

// User interface (kept for compatibility)
export interface User {
  id: string;
  username: string;
  email: string;
  created_at: string;
}

// Auth store state interface (kept for compatibility)
interface AuthState {
  // State
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions (dummy implementations)
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Utility functions (dummy implementations)
  getToken: () => string | null;
  isTokenValid: () => boolean;
  refreshAuth: () => void;
}

// Dummy auth store that always returns unauthenticated state
export const useAuthStore = (): AuthState => ({
  // Always unauthenticated
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: false,
  error: null,

  // Dummy actions that do nothing
  login: () => {},
  logout: () => {},
  setUser: () => {},
  setLoading: () => {},
  setError: () => {},
  clearError: () => {},
  getToken: () => null,
  isTokenValid: () => false,
  refreshAuth: () => {},
});

// Export types for use in components
export type { AuthState };
