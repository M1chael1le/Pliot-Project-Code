import { useMemo } from 'react';
import { useEquipment } from '@/context/EquipmentContext';
import { ADUser } from '@/types';

export function useStaffHierarchy(managerId: string) {
  const { users } = useEquipment();

  const directReports = useMemo(
    () => users.filter((u) => u.managerId === managerId),
    [users, managerId]
  );

  const allSubordinates = useMemo(() => {
    const result: ADUser[] = [];
    const findSubs = (id: string) => {
      const reports = users.filter((u) => u.managerId === id);
      for (const r of reports) {
        result.push(r);
        findSubs(r.id);
      }
    };
    findSubs(managerId);
    return result;
  }, [users, managerId]);

  return {
    directReports,
    allSubordinates,
    allStaff: users,
  };
}
