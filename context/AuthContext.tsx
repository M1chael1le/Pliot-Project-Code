'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { ADUser, UserRole } from '@/types';
import { mockUsers } from '@/lib/mock-data';

interface AuthState {
  currentUser: ADUser | null;
  role: UserRole | null;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'auth_state';

interface StoredAuthState {
  userId: string;
  role: UserRole;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<ADUser | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        const state: StoredAuthState = JSON.parse(stored);
        const user = mockUsers.find((u) => u.id === state.userId);
        if (user) {
          setCurrentUser(user);
          setRole(state.role);
        }
      } catch (e) {
        console.error('Failed to load auth state from localStorage:', e);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (email: string, password: string, role: UserRole): Promise<boolean> => {
      // Find user by email (case-insensitive)
      const user = mockUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (!user) {
        return false;
      }

      // Mock auth: any password is accepted
      setCurrentUser(user);
      setRole(role);

      // Save to localStorage
      const authState: StoredAuthState = {
        userId: user.id,
        role,
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));

      return true;
    },
    []
  );

  const logout = useCallback(() => {
    setCurrentUser(null);
    setRole(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  const isAuthenticated = currentUser !== null && role !== null;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
