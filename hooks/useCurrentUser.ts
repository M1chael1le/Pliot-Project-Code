import { useAuth } from '@/context/AuthContext';
import { ADUser } from '@/types';

export function useCurrentUser(): ADUser {
  const { currentUser } = useAuth();

  if (!currentUser) {
    throw new Error('useCurrentUser must be used when authenticated');
  }

  return currentUser;
}
