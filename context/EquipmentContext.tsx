'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
  useMemo,
} from 'react';
import {
  Equipment,
  EquipmentStatus,
  EquipmentType,
  CollectionRecord,
  ActivityLogEntry,
  ITAlert,
  DashboardStats,
  ADUser,
} from '@/types';
import { useAuth } from './AuthContext';

interface EquipmentContextType {
  // Data
  equipment: Equipment[];
  visibleEquipment: Equipment[];
  collectionRecords: CollectionRecord[];
  activityLog: ActivityLogEntry[];
  alerts: ITAlert[];
  stats: DashboardStats;
  users: ADUser[];

  // Actions
  updateEquipmentStatus: (
    equipmentId: string,
    newStatus: EquipmentStatus,
    managerId: string
  ) => void;
  updateEquipmentType: (equipmentId: string, newType: EquipmentType) => void;
  markAlertAsRead: (alertId: string) => void;
  getEquipmentByUser: (userId: string) => Equipment[];
  getPendingEquipment: () => Equipment[];
}

const EquipmentContext = createContext<EquipmentContextType | undefined>(undefined);

export function useEquipment() {
  const context = useContext(EquipmentContext);
  if (!context) {
    throw new Error('useEquipment must be used within an EquipmentProvider');
  }
  return context;
}

export function EquipmentProvider({ children }: { children: ReactNode }) {
  const { currentUser, role } = useAuth();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [collectionRecords, setCollectionRecords] = useState<CollectionRecord[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
  const [alerts, setAlerts] = useState<ITAlert[]>([]);
  const [users, setUsers] = useState<ADUser[]>([]);

  // Fetch all data from API on mount
  useEffect(() => {
    Promise.all([
      fetch('/api/equipment').then((r) => r.json()),
      fetch('/api/staff').then((r) => r.json()),
      fetch('/api/activity').then((r) => r.json()),
      fetch('/api/alerts').then((r) => r.json()),
    ])
      .then(([eqData, staffData, actData, alertData]) => {
        setEquipment(eqData.data);
        setUsers(staffData.data);
        setActivityLog(actData.data);
        setAlerts(alertData.data);
      })
      .catch((err) => console.error('Failed to fetch data:', err));
  }, []);

  // Helper to find user by ID
  const getUserById = useCallback(
    (id: string): ADUser | undefined => {
      return users.find((u) => u.id === id);
    },
    [users]
  );

  // Compute visible equipment based on role
  const visibleEquipment = useMemo(() => {
    if (!currentUser || !role) {
      return [];
    }

    // IT role sees all equipment
    if (role === 'it') {
      return equipment;
    }

    // Manager role sees only direct reports' equipment
    const directReportIds = currentUser.directReports || [];
    return equipment.filter((eq) => directReportIds.includes(eq.assignedToUserId));
  }, [equipment, currentUser, role]);

  // Calculate dashboard stats based on visible equipment
  const stats: DashboardStats = useMemo(() => {
    const visibleUserIds = role === 'it'
      ? users.map(u => u.id)
      : (currentUser?.directReports || []);

    return {
      totalStaff: visibleUserIds.length,
      pendingReturns: visibleEquipment.filter((eq) => eq.status === 'pending').length,
      activeAlerts: alerts.filter((a) => !a.read).length,
      collectedThisWeek: collectionRecords.filter((cr) => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return new Date(cr.collectionDate) >= oneWeekAgo;
      }).length,
    };
  }, [visibleEquipment, alerts, collectionRecords, role, currentUser, users]);

  const updateEquipmentStatus = useCallback(
    (equipmentId: string, newStatus: EquipmentStatus, managerId: string) => {
      const eq = equipment.find((e) => e.id === equipmentId);
      if (!eq) return;

      if (newStatus === 'returned') {
        // Use the collect endpoint
        fetch(`/api/equipment/${equipmentId}/collect`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ managerId }),
        })
          .then((r) => r.json())
          .then((data) => {
            if (data.data) {
              setEquipment((prev) =>
                prev.map((e) => (e.id === equipmentId ? data.data.equipment : e))
              );
              if (data.data.alert) {
                setAlerts((prev) => [data.data.alert, ...prev]);
              }
              // Refresh activity log
              fetch('/api/activity')
                .then((r) => r.json())
                .then((d) => setActivityLog(d.data));
            }
          })
          .catch((err) => console.error('Failed to collect equipment:', err));
      } else {
        // Use the status endpoint
        fetch(`/api/equipment/${equipmentId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus, managerId }),
        })
          .then((r) => r.json())
          .then((data) => {
            if (data.data) {
              setEquipment((prev) =>
                prev.map((e) => (e.id === equipmentId ? data.data.equipment : e))
              );
              // Refresh alerts and activity log
              fetch('/api/alerts')
                .then((r) => r.json())
                .then((d) => setAlerts(d.data));
              fetch('/api/activity')
                .then((r) => r.json())
                .then((d) => setActivityLog(d.data));
            }
          })
          .catch((err) => console.error('Failed to update status:', err));
      }
    },
    [equipment]
  );

  const updateEquipmentType = useCallback(
    (equipmentId: string, newType: EquipmentType) => {
      // Update via API
      fetch(`/api/equipment/${equipmentId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: newType }),
      }).catch((err) => console.error('Failed to update type:', err));

      // Optimistic update
      setEquipment((prev) =>
        prev.map((e) => (e.id === equipmentId ? { ...e, type: newType } : e))
      );
    },
    []
  );

  const markAlertAsRead = useCallback((alertId: string) => {
    fetch(`/api/alerts/${alertId}/read`, { method: 'PATCH' })
      .then((r) => r.json())
      .then((data) => {
        if (data.data) {
          setAlerts((prev) =>
            prev.map((a) => (a.id === alertId ? { ...a, read: true } : a))
          );
        }
      })
      .catch((err) => console.error('Failed to mark alert as read:', err));
  }, []);

  const getEquipmentByUser = useCallback(
    (userId: string) => {
      return visibleEquipment.filter((eq) => eq.assignedToUserId === userId);
    },
    [visibleEquipment]
  );

  const getPendingEquipment = useCallback(() => {
    return visibleEquipment.filter((eq) => eq.status === 'pending');
  }, [visibleEquipment]);

  return (
    <EquipmentContext.Provider
      value={{
        equipment,
        visibleEquipment,
        collectionRecords,
        activityLog,
        alerts,
        stats,
        users,
        updateEquipmentStatus,
        updateEquipmentType,
        markAlertAsRead,
        getEquipmentByUser,
        getPendingEquipment,
      }}
    >
      {children}
    </EquipmentContext.Provider>
  );
}
