import Link from 'next/link';

export const metadata = { title: 'Activities' };

async function getActivities() {
  // On the server, undici's fetch requires an absolute URL. If env vars are not set, build a sensible local default.
  const base = process.env.NEXT_PUBLIC_BASE_URL
    || process.env.NEXTAUTH_URL
    || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3006');
  let url = `${base.replace(/\/$/, '')}/api/activities`;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return { ok: false, activities: [] };
    return res.json();
  } catch (e) {
    console.error('[activities] fetch failed', { url, error: (e as Error).message });
    return { ok: false, activities: [] };
  }
}

export default async function ActivitiesPage() {
  const { ok, activities } = await getActivities();
  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Seeded Activities</h1>
      {!ok && <p className="text-red-600">Failed to load activities.</p>}
      <ul className="space-y-2">
        {activities?.map((a: any) => (
          <li key={a.slug} className="border rounded px-3 py-2 flex items-center justify-between">
            <span>
              <span className="font-medium">{a.name}</span>
              <span className="ml-2 text-sm text-gray-500">({a.slug})</span>
            </span>
            <span className={`text-xs ${a.isActive ? 'text-green-600' : 'text-gray-400'}`}>{a.isActive ? 'active' : 'inactive'}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <Link href="/">Back home</Link>
      </div>
    </div>
  );
}
