import { NextRequest, NextResponse } from 'next/server';
import { getUsers } from '../_store';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const managerId = searchParams.get('managerId');

  let result = await getUsers();

  if (managerId) {
    result = result.filter((u) => u.managerId === managerId);
  }

  return NextResponse.json({ data: result });
}
