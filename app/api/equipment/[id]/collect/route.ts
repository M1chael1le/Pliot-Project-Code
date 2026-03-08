import { NextRequest, NextResponse } from 'next/server';
import {
  findEquipment,
  updateEquipment,
  addCollectionRecord,
  addITAlert,
  addActivityLogEntry,
  findUser,
  nextId,
} from '../../../_store';
import { CollectEquipmentBody } from '@/types/api';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body: CollectEquipmentBody = await request.json();

  if (!body.managerId) {
    return NextResponse.json({ error: 'managerId is required' }, { status: 400 });
  }

  const eq = findEquipment(id);
  if (!eq) {
    return NextResponse.json({ error: 'Equipment not found' }, { status: 404 });
  }

  if (eq.status === 'returned') {
    return NextResponse.json({ error: 'Equipment is already returned' }, { status: 400 });
  }

  const user = findUser(eq.assignedToUserId);
  const userName = user?.displayName || 'Unknown';
  const typeLabel = eq.type.charAt(0).toUpperCase() + eq.type.slice(1);
  const now = new Date().toISOString();

  // Update equipment status
  const updated = updateEquipment(id, { status: 'returned' })!;

  // Create collection record
  addCollectionRecord({
    id: nextId('col'),
    equipmentId: eq.id,
    userId: eq.assignedToUserId,
    collectedByManagerId: body.managerId,
    collectionDate: now,
    itNotified: true,
  });

  // Create IT alert
  const alert = {
    id: nextId('alert'),
    type: 'collection' as const,
    message: `Equipment collected: ${typeLabel} (${eq.assetTag}) from ${userName}`,
    equipmentId: eq.id,
    userId: eq.assignedToUserId,
    createdAt: now,
    read: false,
  };
  addITAlert(alert);

  // Create activity log entry
  addActivityLogEntry({
    id: nextId('act'),
    type: 'collection',
    description: `${typeLabel} (${eq.assetTag}) collected from ${userName}`,
    userId: eq.assignedToUserId,
    equipmentId: eq.id,
    timestamp: now,
    performedBy: body.managerId,
  });

  return NextResponse.json({ data: { equipment: updated, alert } });
}
