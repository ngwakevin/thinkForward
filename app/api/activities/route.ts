import prisma from '../../../lib/prisma';

export async function GET() {
  try {
    const activities = await prisma.activity.findMany({
      orderBy: { name: 'asc' },
      select: { slug: true, name: true, isActive: true },
    });
    return new Response(JSON.stringify({ ok: true, activities }), { status: 200, headers: { 'content-type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e?.message || 'DB error' }), { status: 500, headers: { 'content-type': 'application/json' } });
  }
}
