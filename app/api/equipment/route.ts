import { NextRequest, NextResponse } from 'next/server';
import { getEquipment, getUsers } from '../_store';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const userId = searchParams.get('userId');
  const status = searchParams.get('status');
  const managerId = searchParams.get('managerId');

  let result = await getEquipment();

  if (userId) {
    result = result.filter((e) => e.assignedToUserId === userId);
  }

  if (status) {
    result = result.filter((e) => e.status === status);
  }

  if (managerId) {
    const users = await getUsers();
    const directReportIds = users
      .filter((u) => u.managerId === managerId)
      .map((u) => u.id);
    result = result.filter((e) => directReportIds.includes(e.assignedToUserId));
  }

  return NextResponse.json({ data: result });
}
