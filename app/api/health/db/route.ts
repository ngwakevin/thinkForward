import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const start = Date.now();
  try {
    // Lightweight query; SQL Server uses SELECT 1 for connectivity
    await prisma.$queryRaw`SELECT 1`;
    const ms = Date.now() - start;
    return NextResponse.json({ ok: true, ms });
  } catch (error: any) {
    const code = error?.code || error?.meta?.code;
    return NextResponse.json({ ok: false, error: error?.message || 'DB error', code }, { status: 500 });
  }
}
