import { useAuth } from '@/context/AuthContext';
import { User } from 'firebase/auth';

export function useCurrentUser(): User {
  const { currentUser } = useAuth();

  if (!currentUser) {
    throw new Error('useCurrentUser must be used when authenticated');
  }

  return currentUser;
}
