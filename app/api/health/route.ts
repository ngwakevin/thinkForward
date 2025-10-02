import prisma from '../../../lib/prisma';

export async function GET() {
  try {
    // light touch to ensure client works; no-op query
    await prisma.$queryRaw`SELECT 1`;
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e?.message || 'DB error' }), { status: 500 });
  }
}
