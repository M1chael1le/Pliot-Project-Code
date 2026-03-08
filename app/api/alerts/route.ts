import { NextRequest, NextResponse } from 'next/server';
import { getITAlerts } from '../_store';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const read = searchParams.get('read');

  let result = getITAlerts();

  if (read === 'true') {
    result = result.filter((a) => a.read);
  } else if (read === 'false') {
    result = result.filter((a) => !a.read);
  }

  return NextResponse.json({ data: result });
}
