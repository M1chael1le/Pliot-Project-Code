import { Equipment, EquipmentType, EquipmentStatus, CollectionRecord, ActivityLogEntry, ITAlert } from '@/types';

// Equipment makes and models
const equipmentCatalog: Record<EquipmentType, { make: string; model: string }[]> = {
  laptop: [
    { make: 'Dell', model: 'Latitude 5540' },
    { make: 'Dell', model: 'Latitude 7440' },
    { make: 'Lenovo', model: 'ThinkPad T14' },
    { make: 'HP', model: 'EliteBook 840' },
    { make: 'Apple', model: 'MacBook Pro 14"' },
  ],
  desktop: [
    { make: 'Dell', model: 'OptiPlex 7090' },
    { make: 'HP', model: 'ProDesk 400' },
    { make: 'Lenovo', model: 'ThinkCentre M90q' },
  ],
  monitor: [
    { make: 'Dell', model: 'P2722H 27"' },
    { make: 'LG', model: '27UK850-W' },
    { make: 'HP', model: 'E24 G4' },
    { make: 'Samsung', model: 'S27R650' },
  ],
  keyboard: [
    { make: 'Logitech', model: 'K780' },
    { make: 'Microsoft', model: 'Ergonomic' },
    { make: 'Dell', model: 'KB216' },
  ],
  mouse: [
    { make: 'Logitech', model: 'MX Master 3' },
    { make: 'Microsoft', model: 'Precision' },
    { make: 'Dell', model: 'MS116' },
  ],
  headset: [
    { make: 'Jabra', model: 'Evolve2 75' },
    { make: 'Poly', model: 'Voyager Focus 2' },
    { make: 'Logitech', model: 'Zone Wireless' },
  ],
  phone: [
    { make: 'Cisco', model: 'IP Phone 8845' },
    { make: 'Polycom', model: 'VVX 450' },
    { make: 'Yealink', model: 'T46U' },
  ],
  tablet: [
    { make: 'Apple', model: 'iPad Pro 11"' },
    { make: 'Samsung', model: 'Galaxy Tab S8' },
    { make: 'Microsoft', model: 'Surface Pro 9' },
  ],
  other: [
    { make: 'Various', model: 'Docking Station' },
    { make: 'Various', model: 'Webcam' },
    { make: 'Various', model: 'USB Hub' },
  ],
};

function generateAssetTag(): string {
  const prefix = 'SHF';
  const number = Math.floor(Math.random() * 90000) + 10000;
  return `${prefix}-${number}`;
}

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Generate 50+ equipment items
export const mockEquipment: Equipment[] = [
  // User 001 - CEO
  { id: 'eq-001', assetTag: 'SHF-10001', type: 'laptop', make: 'Apple', model: 'MacBook Pro 14"', assignedToUserId: 'user-001', status: 'assigned' },
  { id: 'eq-002', assetTag: 'SHF-10002', type: 'monitor', make: 'LG', model: '27UK850-W', assignedToUserId: 'user-001', status: 'assigned' },
  { id: 'eq-003', assetTag: 'SHF-10003', type: 'phone', make: 'Cisco', model: 'IP Phone 8845', assignedToUserId: 'user-001', status: 'assigned' },

  // User 002 - IT Director
  { id: 'eq-004', assetTag: 'SHF-10004', type: 'laptop', make: 'Dell', model: 'Latitude 7440', assignedToUserId: 'user-002', status: 'assigned' },
  { id: 'eq-005', assetTag: 'SHF-10005', type: 'monitor', make: 'Dell', model: 'P2722H 27"', assignedToUserId: 'user-002', status: 'assigned' },
  { id: 'eq-006', assetTag: 'SHF-10006', type: 'monitor', make: 'Dell', model: 'P2722H 27"', assignedToUserId: 'user-002', status: 'assigned' },

  // User 003 - HR Director
  { id: 'eq-007', assetTag: 'SHF-10007', type: 'laptop', make: 'HP', model: 'EliteBook 840', assignedToUserId: 'user-003', status: 'assigned' },
  { id: 'eq-008', assetTag: 'SHF-10008', type: 'monitor', make: 'HP', model: 'E24 G4', assignedToUserId: 'user-003', status: 'assigned' },

  // User 004 - Operations Director
  { id: 'eq-009', assetTag: 'SHF-10009', type: 'laptop', make: 'Dell', model: 'Latitude 5540', assignedToUserId: 'user-004', status: 'assigned' },
  { id: 'eq-010', assetTag: 'SHF-10010', type: 'monitor', make: 'Samsung', model: 'S27R650', assignedToUserId: 'user-004', status: 'assigned' },
  { id: 'eq-011', assetTag: 'SHF-10011', type: 'tablet', make: 'Apple', model: 'iPad Pro 11"', assignedToUserId: 'user-004', status: 'assigned' },

  // User 005 - Systems Admin
  { id: 'eq-012', assetTag: 'SHF-10012', type: 'laptop', make: 'Lenovo', model: 'ThinkPad T14', assignedToUserId: 'user-005', status: 'assigned' },
  { id: 'eq-013', assetTag: 'SHF-10013', type: 'monitor', make: 'Dell', model: 'P2722H 27"', assignedToUserId: 'user-005', status: 'assigned' },
  { id: 'eq-014', assetTag: 'SHF-10014', type: 'monitor', make: 'Dell', model: 'P2722H 27"', assignedToUserId: 'user-005', status: 'assigned' },
  { id: 'eq-015', assetTag: 'SHF-10015', type: 'keyboard', make: 'Logitech', model: 'K780', assignedToUserId: 'user-005', status: 'assigned' },

  // User 006 - Network Engineer
  { id: 'eq-016', assetTag: 'SHF-10016', type: 'laptop', make: 'Dell', model: 'Latitude 7440', assignedToUserId: 'user-006', status: 'assigned' },
  { id: 'eq-017', assetTag: 'SHF-10017', type: 'phone', make: 'Polycom', model: 'VVX 450', assignedToUserId: 'user-006', status: 'pending' },

  // User 007 - Help Desk
  { id: 'eq-018', assetTag: 'SHF-10018', type: 'desktop', make: 'Dell', model: 'OptiPlex 7090', assignedToUserId: 'user-007', status: 'assigned' },
  { id: 'eq-019', assetTag: 'SHF-10019', type: 'monitor', make: 'HP', model: 'E24 G4', assignedToUserId: 'user-007', status: 'assigned' },
  { id: 'eq-020', assetTag: 'SHF-10020', type: 'headset', make: 'Jabra', model: 'Evolve2 75', assignedToUserId: 'user-007', status: 'assigned' },

  // User 008 - HR Specialist
  { id: 'eq-021', assetTag: 'SHF-10021', type: 'laptop', make: 'HP', model: 'EliteBook 840', assignedToUserId: 'user-008', status: 'assigned' },
  { id: 'eq-022', assetTag: 'SHF-10022', type: 'monitor', make: 'HP', model: 'E24 G4', assignedToUserId: 'user-008', status: 'pending' },

  // User 009 - Recruiter
  { id: 'eq-023', assetTag: 'SHF-10023', type: 'laptop', make: 'Dell', model: 'Latitude 5540', assignedToUserId: 'user-009', status: 'assigned' },
  { id: 'eq-024', assetTag: 'SHF-10024', type: 'headset', make: 'Poly', model: 'Voyager Focus 2', assignedToUserId: 'user-009', status: 'assigned' },

  // User 010 - Operations Manager
  { id: 'eq-025', assetTag: 'SHF-10025', type: 'laptop', make: 'Dell', model: 'Latitude 5540', assignedToUserId: 'user-010', status: 'assigned' },
  { id: 'eq-026', assetTag: 'SHF-10026', type: 'monitor', make: 'Dell', model: 'P2722H 27"', assignedToUserId: 'user-010', status: 'assigned' },
  { id: 'eq-027', assetTag: 'SHF-10027', type: 'tablet', make: 'Samsung', model: 'Galaxy Tab S8', assignedToUserId: 'user-010', status: 'pending' },

  // User 011 - Facilities Manager
  { id: 'eq-028', assetTag: 'SHF-10028', type: 'laptop', make: 'Lenovo', model: 'ThinkPad T14', assignedToUserId: 'user-011', status: 'assigned' },
  { id: 'eq-029', assetTag: 'SHF-10029', type: 'phone', make: 'Yealink', model: 'T46U', assignedToUserId: 'user-011', status: 'assigned' },

  // User 012 - QA Manager
  { id: 'eq-030', assetTag: 'SHF-10030', type: 'laptop', make: 'HP', model: 'EliteBook 840', assignedToUserId: 'user-012', status: 'assigned' },
  { id: 'eq-031', assetTag: 'SHF-10031', type: 'monitor', make: 'Samsung', model: 'S27R650', assignedToUserId: 'user-012', status: 'assigned' },

  // User 013 - Operations Coordinator
  { id: 'eq-032', assetTag: 'SHF-10032', type: 'desktop', make: 'HP', model: 'ProDesk 400', assignedToUserId: 'user-013', status: 'assigned' },
  { id: 'eq-033', assetTag: 'SHF-10033', type: 'monitor', make: 'HP', model: 'E24 G4', assignedToUserId: 'user-013', status: 'assigned' },
  { id: 'eq-034', assetTag: 'SHF-10034', type: 'keyboard', make: 'Microsoft', model: 'Ergonomic', assignedToUserId: 'user-013', status: 'pending' },

  // User 014 - Logistics Specialist
  { id: 'eq-035', assetTag: 'SHF-10035', type: 'laptop', make: 'Dell', model: 'Latitude 5540', assignedToUserId: 'user-014', status: 'assigned' },
  { id: 'eq-036', assetTag: 'SHF-10036', type: 'tablet', make: 'Apple', model: 'iPad Pro 11"', assignedToUserId: 'user-014', status: 'assigned' },

  // User 015 - Inventory Analyst
  { id: 'eq-037', assetTag: 'SHF-10037', type: 'desktop', make: 'Lenovo', model: 'ThinkCentre M90q', assignedToUserId: 'user-015', status: 'assigned' },
  { id: 'eq-038', assetTag: 'SHF-10038', type: 'monitor', make: 'LG', model: '27UK850-W', assignedToUserId: 'user-015', status: 'assigned' },

  // User 016 - Maintenance Technician
  { id: 'eq-039', assetTag: 'SHF-10039', type: 'tablet', make: 'Samsung', model: 'Galaxy Tab S8', assignedToUserId: 'user-016', status: 'assigned' },
  { id: 'eq-040', assetTag: 'SHF-10040', type: 'phone', make: 'Cisco', model: 'IP Phone 8845', assignedToUserId: 'user-016', status: 'pending' },

  // User 017 - Safety Coordinator
  { id: 'eq-041', assetTag: 'SHF-10041', type: 'laptop', make: 'HP', model: 'EliteBook 840', assignedToUserId: 'user-017', status: 'assigned' },
  { id: 'eq-042', assetTag: 'SHF-10042', type: 'tablet', make: 'Microsoft', model: 'Surface Pro 9', assignedToUserId: 'user-017', status: 'assigned' },

  // User 018 - QA Analyst
  { id: 'eq-043', assetTag: 'SHF-10043', type: 'laptop', make: 'Dell', model: 'Latitude 7440', assignedToUserId: 'user-018', status: 'assigned' },
  { id: 'eq-044', assetTag: 'SHF-10044', type: 'monitor', make: 'Dell', model: 'P2722H 27"', assignedToUserId: 'user-018', status: 'assigned' },

  // User 019 - Compliance Specialist
  { id: 'eq-045', assetTag: 'SHF-10045', type: 'laptop', make: 'Lenovo', model: 'ThinkPad T14', assignedToUserId: 'user-019', status: 'assigned' },
  { id: 'eq-046', assetTag: 'SHF-10046', type: 'headset', make: 'Logitech', model: 'Zone Wireless', assignedToUserId: 'user-019', status: 'pending' },

  // User 020 - Accountant
  { id: 'eq-047', assetTag: 'SHF-10047', type: 'desktop', make: 'Dell', model: 'OptiPlex 7090', assignedToUserId: 'user-020', status: 'assigned' },
  { id: 'eq-048', assetTag: 'SHF-10048', type: 'monitor', make: 'Dell', model: 'P2722H 27"', assignedToUserId: 'user-020', status: 'assigned' },
  { id: 'eq-049', assetTag: 'SHF-10049', type: 'monitor', make: 'Dell', model: 'P2722H 27"', assignedToUserId: 'user-020', status: 'assigned' },

  // User 021 - Financial Analyst
  { id: 'eq-050', assetTag: 'SHF-10050', type: 'laptop', make: 'Dell', model: 'Latitude 5540', assignedToUserId: 'user-021', status: 'assigned' },
  { id: 'eq-051', assetTag: 'SHF-10051', type: 'monitor', make: 'LG', model: '27UK850-W', assignedToUserId: 'user-021', status: 'assigned' },

  // User 022 - Marketing Coordinator
  { id: 'eq-052', assetTag: 'SHF-10052', type: 'laptop', make: 'Apple', model: 'MacBook Pro 14"', assignedToUserId: 'user-022', status: 'assigned' },
  { id: 'eq-053', assetTag: 'SHF-10053', type: 'tablet', make: 'Apple', model: 'iPad Pro 11"', assignedToUserId: 'user-022', status: 'assigned' },

  // User 023 - Case Manager
  { id: 'eq-054', assetTag: 'SHF-10054', type: 'laptop', make: 'HP', model: 'EliteBook 840', assignedToUserId: 'user-023', status: 'assigned' },
  { id: 'eq-055', assetTag: 'SHF-10055', type: 'headset', make: 'Jabra', model: 'Evolve2 75', assignedToUserId: 'user-023', status: 'assigned' },

  // User 024 - Program Coordinator
  { id: 'eq-056', assetTag: 'SHF-10056', type: 'laptop', make: 'Dell', model: 'Latitude 5540', assignedToUserId: 'user-024', status: 'assigned' },
  { id: 'eq-057', assetTag: 'SHF-10057', type: 'phone', make: 'Polycom', model: 'VVX 450', assignedToUserId: 'user-024', status: 'assigned' },

  // User 025 - Support Specialist
  { id: 'eq-058', assetTag: 'SHF-10058', type: 'desktop', make: 'HP', model: 'ProDesk 400', assignedToUserId: 'user-025', status: 'assigned' },
  { id: 'eq-059', assetTag: 'SHF-10059', type: 'monitor', make: 'HP', model: 'E24 G4', assignedToUserId: 'user-025', status: 'assigned' },
  { id: 'eq-060', assetTag: 'SHF-10060', type: 'headset', make: 'Poly', model: 'Voyager Focus 2', assignedToUserId: 'user-025', status: 'pending' },
];

// Initial collection records
export const mockCollectionRecords: CollectionRecord[] = [
  {
    id: 'col-001',
    equipmentId: 'eq-099',
    userId: 'user-099',
    collectedByManagerId: 'user-004',
    collectionDate: '2026-01-20T14:30:00Z',
    itNotified: true,
  },
  {
    id: 'col-002',
    equipmentId: 'eq-098',
    userId: 'user-098',
    collectedByManagerId: 'user-003',
    collectionDate: '2026-01-22T10:15:00Z',
    itNotified: true,
  },
];

// Initial activity log
export const mockActivityLog: ActivityLogEntry[] = [
  {
    id: 'act-001',
    type: 'collection',
    description: 'Laptop collected from former employee',
    userId: 'user-099',
    equipmentId: 'eq-099',
    timestamp: '2026-01-20T14:30:00Z',
    performedBy: 'user-004',
  },
  {
    id: 'act-002',
    type: 'status_change',
    description: 'Monitor status changed to Pending',
    userId: 'user-008',
    equipmentId: 'eq-022',
    timestamp: '2026-01-21T09:00:00Z',
    performedBy: 'user-003',
  },
  {
    id: 'act-003',
    type: 'collection',
    description: 'Desktop collected from former employee',
    userId: 'user-098',
    equipmentId: 'eq-098',
    timestamp: '2026-01-22T10:15:00Z',
    performedBy: 'user-003',
  },
  {
    id: 'act-004',
    type: 'alert',
    description: 'IT notified about equipment return',
    userId: 'user-098',
    equipmentId: 'eq-098',
    timestamp: '2026-01-22T10:16:00Z',
    performedBy: 'system',
  },
  {
    id: 'act-005',
    type: 'status_change',
    description: 'Tablet status changed to Pending',
    userId: 'user-010',
    equipmentId: 'eq-027',
    timestamp: '2026-01-23T11:30:00Z',
    performedBy: 'user-004',
  },
];

// Initial IT alerts
export const mockITAlerts: ITAlert[] = [
  {
    id: 'alert-001',
    type: 'collection',
    message: 'Equipment collected: Laptop (SHF-10099) from former employee',
    equipmentId: 'eq-099',
    userId: 'user-099',
    createdAt: '2026-01-20T14:31:00Z',
    read: true,
  },
  {
    id: 'alert-002',
    type: 'pending_return',
    message: 'Equipment pending return: Monitor (SHF-10022) from James Wilson',
    equipmentId: 'eq-022',
    userId: 'user-008',
    createdAt: '2026-01-21T09:01:00Z',
    read: false,
  },
  {
    id: 'alert-003',
    type: 'collection',
    message: 'Equipment collected: Desktop (SHF-10098) from former employee',
    equipmentId: 'eq-098',
    userId: 'user-098',
    createdAt: '2026-01-22T10:16:00Z',
    read: true,
  },
  {
    id: 'alert-004',
    type: 'pending_return',
    message: 'Equipment pending return: Tablet (SHF-10027) from Christopher Brown',
    equipmentId: 'eq-027',
    userId: 'user-010',
    createdAt: '2026-01-23T11:31:00Z',
    read: false,
  },
];

// Helper functions
export function getEquipmentById(id: string): Equipment | undefined {
  return mockEquipment.find(eq => eq.id === id);
}

export function getEquipmentByUserId(userId: string): Equipment[] {
  return mockEquipment.filter(eq => eq.assignedToUserId === userId);
}

export function getPendingEquipment(): Equipment[] {
  return mockEquipment.filter(eq => eq.status === 'pending');
}

export function getReturnedEquipment(): Equipment[] {
  return mockEquipment.filter(eq => eq.status === 'returned');
}
