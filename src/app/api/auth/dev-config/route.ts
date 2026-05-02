import { NextResponse } from 'next/server';

export async function GET() {
  const devAuthBypass =
    process.env.STAGEPASS_DEV_AUTH_BYPASS === '1' && process.env.NODE_ENV === 'development';
  return NextResponse.json({ devAuthBypass });
}
