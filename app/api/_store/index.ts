import { Equipment, CollectionRecord, ActivityLogEntry, ITAlert, ADUser } from '@/types';
import { mockEquipment, mockCollectionRecords, mockActivityLog, mockITAlerts } from '@/lib/mock-data/equipment';
import { mockUsers } from '@/lib/mock-data/users';

// Mutable in-memory copies of mock data
let equipment: Equipment[] = [...mockEquipment];
let collectionRecords: CollectionRecord[] = [...mockCollectionRecords];
let activityLog: ActivityLogEntry[] = [...mockActivityLog];
let itAlerts: ITAlert[] = [...mockITAlerts];
const users: ADUser[] = [...mockUsers];

let idCounter = Date.now();

export function nextId(prefix: string): string {
  return `${prefix}-${++idCounter}`;
}

// Equipment
export function getEquipment(): Equipment[] {
  return equipment;
}

export function findEquipment(id: string): Equipment | undefined {
  return equipment.find((e) => e.id === id);
}

export function updateEquipment(id: string, updates: Partial<Equipment>): Equipment | undefined {
  const idx = equipment.findIndex((e) => e.id === id);
  if (idx === -1) return undefined;
  equipment[idx] = { ...equipment[idx], ...updates };
  return equipment[idx];
}

// Collection Records
export function getCollectionRecords(): CollectionRecord[] {
  return collectionRecords;
}

export function addCollectionRecord(record: CollectionRecord): void {
  collectionRecords.push(record);
}

// Activity Log
export function getActivityLog(): ActivityLogEntry[] {
  return activityLog;
}

export function addActivityLogEntry(entry: ActivityLogEntry): void {
  activityLog.unshift(entry);
}

// IT Alerts
export function getITAlerts(): ITAlert[] {
  return itAlerts;
}

export function findAlert(id: string): ITAlert | undefined {
  return itAlerts.find((a) => a.id === id);
}

export function addITAlert(alert: ITAlert): void {
  itAlerts.unshift(alert);
}

export function updateAlert(id: string, updates: Partial<ITAlert>): ITAlert | undefined {
  const idx = itAlerts.findIndex((a) => a.id === id);
  if (idx === -1) return undefined;
  itAlerts[idx] = { ...itAlerts[idx], ...updates };
  return itAlerts[idx];
}

// Users
export function getUsers(): ADUser[] {
  return users;
}

export function findUser(id: string): ADUser | undefined {
  return users.find((u) => u.id === id);
}
