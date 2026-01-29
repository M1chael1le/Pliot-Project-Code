import { currentUser } from '@/lib/mock-data';
import { ADUser } from '@/types';

export function useCurrentUser(): ADUser {
  // In a real app, this would fetch the current user from authentication
  return currentUser;
}
