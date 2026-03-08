import { NextResponse } from 'next/server';
import { getActivityLog } from '../_store';

export async function GET() {
  const log = getActivityLog().sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return NextResponse.json({ data: log });
}
