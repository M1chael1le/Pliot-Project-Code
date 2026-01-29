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
} from '@/types';
import {
  mockEquipment,
  mockCollectionRecords,
  mockActivityLog,
  mockITAlerts,
  mockUsers,
  getUserById,
} from '@/lib/mock-data';
import { useAuth } from './AuthContext';

interface EquipmentContextType {
  // Data
  equipment: Equipment[];
  visibleEquipment: Equipment[];
  collectionRecords: CollectionRecord[];
  activityLog: ActivityLogEntry[];
  alerts: ITAlert[];
  stats: DashboardStats;

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

const STORAGE_KEY = 'equipment_manager_state';

interface StoredState {
  equipment: Equipment[];
  collectionRecords: CollectionRecord[];
  activityLog: ActivityLogEntry[];
  alerts: ITAlert[];
}

export function EquipmentProvider({ children }: { children: ReactNode }) {
  const { currentUser, role } = useAuth();
  const [equipment, setEquipment] = useState<Equipment[]>(mockEquipment);
  const [collectionRecords, setCollectionRecords] = useState<CollectionRecord[]>(
    mockCollectionRecords
  );
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>(mockActivityLog);
  const [alerts, setAlerts] = useState<ITAlert[]>(mockITAlerts);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const state: StoredState = JSON.parse(stored);
        setEquipment(state.equipment);
        setCollectionRecords(state.collectionRecords);
        setActivityLog(state.activityLog);
        setAlerts(state.alerts);
      } catch (e) {
        console.error('Failed to load state from localStorage:', e);
      }
    }
  }, []);

  // Save to localStorage on state change
  useEffect(() => {
    const state: StoredState = {
      equipment,
      collectionRecords,
      activityLog,
      alerts,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [equipment, collectionRecords, activityLog, alerts]);

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
      ? mockUsers.map(u => u.id)
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
  }, [visibleEquipment, alerts, collectionRecords, role, currentUser]);

  const updateEquipmentStatus = useCallback(
    (equipmentId: string, newStatus: EquipmentStatus, managerId: string) => {
      const eq = equipment.find((e) => e.id === equipmentId);
      if (!eq) return;

      const user = getUserById(eq.assignedToUserId);
      const oldStatus = eq.status;

      // Update equipment
      setEquipment((prev) =>
        prev.map((e) => (e.id === equipmentId ? { ...e, status: newStatus } : e))
      );

      // Create activity log entry
      const activityEntry: ActivityLogEntry = {
        id: `act-${Date.now()}`,
        type: newStatus === 'returned' ? 'collection' : 'status_change',
        description:
          newStatus === 'returned'
            ? `${eq.type.charAt(0).toUpperCase() + eq.type.slice(1)} (${eq.assetTag}) collected from ${user?.displayName || 'Unknown'}`
            : `${eq.type.charAt(0).toUpperCase() + eq.type.slice(1)} status changed from ${oldStatus} to ${newStatus}`,
        userId: eq.assignedToUserId,
        equipmentId: eq.id,
        timestamp: new Date().toISOString(),
        performedBy: managerId,
      };
      setActivityLog((prev) => [activityEntry, ...prev]);

      // If status changed to 'returned', create collection record and IT alert
      if (newStatus === 'returned') {
        const collectionRecord: CollectionRecord = {
          id: `col-${Date.now()}`,
          equipmentId: eq.id,
          userId: eq.assignedToUserId,
          collectedByManagerId: managerId,
          collectionDate: new Date().toISOString(),
          itNotified: true,
        };
        setCollectionRecords((prev) => [...prev, collectionRecord]);

        const alert: ITAlert = {
          id: `alert-${Date.now()}`,
          type: 'collection',
          message: `Equipment collected: ${eq.type.charAt(0).toUpperCase() + eq.type.slice(1)} (${eq.assetTag}) from ${user?.displayName || 'Unknown'}`,
          equipmentId: eq.id,
          userId: eq.assignedToUserId,
          createdAt: new Date().toISOString(),
          read: false,
        };
        setAlerts((prev) => [alert, ...prev]);
      }

      // If status changed to 'pending', create pending return alert
      if (newStatus === 'pending') {
        const alert: ITAlert = {
          id: `alert-${Date.now()}`,
          type: 'pending_return',
          message: `Equipment pending return: ${eq.type.charAt(0).toUpperCase() + eq.type.slice(1)} (${eq.assetTag}) from ${user?.displayName || 'Unknown'}`,
          equipmentId: eq.id,
          userId: eq.assignedToUserId,
          createdAt: new Date().toISOString(),
          read: false,
        };
        setAlerts((prev) => [alert, ...prev]);
      }
    },
    [equipment]
  );

  const updateEquipmentType = useCallback(
    (equipmentId: string, newType: EquipmentType) => {
      setEquipment((prev) =>
        prev.map((e) => (e.id === equipmentId ? { ...e, type: newType } : e))
      );
    },
    []
  );

  const markAlertAsRead = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, read: true } : a))
    );
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
