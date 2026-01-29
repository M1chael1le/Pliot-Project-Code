import { useMemo } from 'react';
import { mockUsers, getDirectReports, getAllSubordinates } from '@/lib/mock-data';
import { ADUser } from '@/types';

export function useStaffHierarchy(managerId: string) {
  const directReports = useMemo(() => getDirectReports(managerId), [managerId]);
  const allSubordinates = useMemo(() => getAllSubordinates(managerId), [managerId]);
  const allStaff = useMemo(() => mockUsers, []);

  return {
    directReports,
    allSubordinates,
    allStaff,
  };
}
