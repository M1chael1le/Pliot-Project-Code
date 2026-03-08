import { NextRequest, NextResponse } from 'next/server';
import {
  findEquipment,
  updateEquipment,
  addITAlert,
  addActivityLogEntry,
  findUser,
  nextId,
} from '../../../_store';
import { UpdateStatusBody } from '@/types/api';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body: UpdateStatusBody = await request.json();

  if (!body.status || !body.managerId) {
    return NextResponse.json({ error: 'status and managerId are required' }, { status: 400 });
  }

  const eq = await findEquipment(id);
  if (!eq) {
    return NextResponse.json({ error: 'Equipment not found' }, { status: 404 });
  }

  const user = await findUser(eq.assignedToUserId);
  const userName = user?.displayName || 'Unknown';
  const typeLabel = eq.type.charAt(0).toUpperCase() + eq.type.slice(1);
  const oldStatus = eq.status;
  const now = new Date().toISOString();

  // Update equipment status
  const updated = (await updateEquipment(id, { status: body.status }))!;

  // Create activity log entry
  await addActivityLogEntry({
    id: nextId('act'),
    type: body.status === 'returned' ? 'collection' : 'status_change',
    description:
      body.status === 'returned'
        ? `${typeLabel} (${eq.assetTag}) collected from ${userName}`
        : `${typeLabel} status changed from ${oldStatus} to ${body.status}`,
    userId: eq.assignedToUserId,
    equipmentId: eq.id,
    timestamp: now,
    performedBy: body.managerId,
  });

  // Create pending_return alert if status is pending
  if (body.status === 'pending') {
    await addITAlert({
      id: nextId('alert'),
      type: 'pending_return',
      message: `Equipment pending return: ${typeLabel} (${eq.assetTag}) from ${userName}`,
      equipmentId: eq.id,
      userId: eq.assignedToUserId,
      createdAt: now,
      read: false,
    });
  }

  return NextResponse.json({ data: { equipment: updated } });
}
