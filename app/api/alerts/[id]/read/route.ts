import { NextRequest, NextResponse } from 'next/server';
import { updateAlert } from '../../../_store';

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const updated = await updateAlert(id, { read: true });
  if (!updated) {
    return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
  }

  return NextResponse.json({ data: updated });
}
