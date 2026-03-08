import { Equipment, CollectionRecord, ActivityLogEntry, ITAlert, ADUser } from '@/types';
import { adminDb } from '@/lib/firebase-admin';

let idCounter = Date.now();

export function nextId(prefix: string): string {
  return `${prefix}-${++idCounter}`;
}

// Equipment
export async function getEquipment(): Promise<Equipment[]> {
  const snapshot = await adminDb.collection('equipment').get();
  return snapshot.docs.map((doc) => doc.data() as Equipment);
}

export async function findEquipment(id: string): Promise<Equipment | undefined> {
  const doc = await adminDb.collection('equipment').doc(id).get();
  return doc.exists ? (doc.data() as Equipment) : undefined;
}

export async function updateEquipment(id: string, updates: Partial<Equipment>): Promise<Equipment | undefined> {
  const ref = adminDb.collection('equipment').doc(id);
  const doc = await ref.get();
  if (!doc.exists) return undefined;
  await ref.update(updates);
  const updated = await ref.get();
  return updated.data() as Equipment;
}

// Collection Records
export async function getCollectionRecords(): Promise<CollectionRecord[]> {
  const snapshot = await adminDb.collection('collectionRecords').get();
  return snapshot.docs.map((doc) => doc.data() as CollectionRecord);
}

export async function addCollectionRecord(record: CollectionRecord): Promise<void> {
  await adminDb.collection('collectionRecords').doc(record.id).set(record);
}

// Activity Log
export async function getActivityLog(): Promise<ActivityLogEntry[]> {
  const snapshot = await adminDb.collection('activityLog').get();
  return snapshot.docs.map((doc) => doc.data() as ActivityLogEntry);
}

export async function addActivityLogEntry(entry: ActivityLogEntry): Promise<void> {
  await adminDb.collection('activityLog').doc(entry.id).set(entry);
}

// IT Alerts
export async function getITAlerts(): Promise<ITAlert[]> {
  const snapshot = await adminDb.collection('itAlerts').get();
  return snapshot.docs.map((doc) => doc.data() as ITAlert);
}

export async function findAlert(id: string): Promise<ITAlert | undefined> {
  const doc = await adminDb.collection('itAlerts').doc(id).get();
  return doc.exists ? (doc.data() as ITAlert) : undefined;
}

export async function addITAlert(alert: ITAlert): Promise<void> {
  await adminDb.collection('itAlerts').doc(alert.id).set(alert);
}

export async function updateAlert(id: string, updates: Partial<ITAlert>): Promise<ITAlert | undefined> {
  const ref = adminDb.collection('itAlerts').doc(id);
  const doc = await ref.get();
  if (!doc.exists) return undefined;
  await ref.update(updates);
  const updated = await ref.get();
  return updated.data() as ITAlert;
}

// Users
export async function getUsers(): Promise<ADUser[]> {
  const snapshot = await adminDb.collection('users').get();
  return snapshot.docs.map((doc) => doc.data() as ADUser);
}

export async function findUser(id: string): Promise<ADUser | undefined> {
  const doc = await adminDb.collection('users').doc(id).get();
  return doc.exists ? (doc.data() as ADUser) : undefined;
}
