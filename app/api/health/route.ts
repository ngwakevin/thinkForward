import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

// Enhanced health endpoint giving app + DB status & latency.
export async function GET() {
  const start = Date.now();
  let dbOk = false;
  let dbLatency: number | null = null;
  let dbError: string | null = null;
  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbOk = true;
    dbLatency = Date.now() - dbStart;
  } catch (e: any) {
    dbError = e?.message || 'DB error';
  }

  const body = {
    ok: true,
    uptimeSeconds: process.uptime(),
    node: process.version,
    commit: process.env.GITHUB_SHA || null,
    buildSha: process.env.BUILD_SHA || process.env.GITHUB_SHA || null,
    timestamp: new Date().toISOString(),
    db: { ok: dbOk, latencyMs: dbLatency, error: dbError },
    elapsedMs: Date.now() - start
  };

  return NextResponse.json(body, { status: dbOk ? 200 : 503 });
}
