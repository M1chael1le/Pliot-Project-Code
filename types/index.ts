// User role for authentication
export type UserRole = 'manager' | 'it';

// User/Employee type (Active Directory User)
export interface ADUser {
  id: string;
  displayName: string;
  email: string;
  department: string;
  title: string;
  managerId: string | null;
  directReports: string[];
}

// Equipment types
export type EquipmentType =
  | 'laptop'
  | 'desktop'
  | 'monitor'
  | 'keyboard'
  | 'mouse'
  | 'headset'
  | 'phone'
  | 'tablet'
  | 'other';

export type EquipmentStatus = 'assigned' | 'pending' | 'returned';

export interface Equipment {
  id: string;
  assetTag: string;
  type: EquipmentType;
  make: string;
  model: string;
  assignedToUserId: string;
  status: EquipmentStatus;
}

// Collection record for tracking equipment returns
export interface CollectionRecord {
  id: string;
  equipmentId: string;
  userId: string;
  collectedByManagerId: string;
  collectionDate: string;
  itNotified: boolean;
}

// Activity log entry
export interface ActivityLogEntry {
  id: string;
  type: 'status_change' | 'collection' | 'assignment' | 'alert';
  description: string;
  userId: string;
  equipmentId?: string;
  timestamp: string;
  performedBy: string;
}

// Alert for IT notifications
export interface ITAlert {
  id: string;
  type: 'collection' | 'pending_return' | 'overdue';
  message: string;
  equipmentId: string;
  userId: string;
  createdAt: string;
  read: boolean;
}

// Dashboard stats
export interface DashboardStats {
  totalStaff: number;
  pendingReturns: number;
  activeAlerts: number;
  collectedThisWeek: number;
}

// Equipment type display labels
export const EQUIPMENT_TYPE_LABELS: Record<EquipmentType, string> = {
  laptop: 'Laptop',
  desktop: 'Desktop',
  monitor: 'Monitor',
  keyboard: 'Keyboard',
  mouse: 'Mouse',
  headset: 'Headset',
  phone: 'Phone',
  tablet: 'Tablet',
  other: 'Other',
};

// Status display labels and colors
export const STATUS_CONFIG: Record<EquipmentStatus, { label: string; color: string }> = {
  assigned: { label: 'Assigned', color: 'blue' },
  pending: { label: 'Pending', color: 'yellow' },
  returned: { label: 'Returned', color: 'green' },
};
