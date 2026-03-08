'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { UserRole } from '@/types';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { signInWithGoogle, syncUserToFirestore } from '@/services/authService';

interface AuthState {
  currentUser: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  isLoading: boolean;
  login: (role: UserRole) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);

        // Fetch their associated role from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setRole(data.role as UserRole);
          } else {
            // Fallback if they haven't synced yet
            setRole('manager');
          }
        } catch (error) {
          console.error("Error fetching user role", error);
        }
      } else {
        setCurrentUser(null);
        setRole(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback(
    async (selectedRole: UserRole): Promise<boolean> => {
      try {
        setIsLoading(true);
        const user = await signInWithGoogle();
        await syncUserToFirestore(user, selectedRole);

        // State is technically updated by the onAuthStateChanged listener above, 
        // but we can fast-track the role here
        setRole(selectedRole);
        return true;
      } catch (error) {
        console.error("Login failed:", error);
        setIsLoading(false);
        return false;
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
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
