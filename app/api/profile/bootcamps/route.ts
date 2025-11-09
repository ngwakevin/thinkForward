import { getServerSession } from 'next-auth';
import { NextResponse, NextRequest } from 'next/server';
import { authOptions } from '@/lib/auth';
import { getBootcampRegistrationsContainer } from '@/lib/cosmos';
import { getBootcampRegistrationsByUserId, getBootcampRegistrationsByEmail } from '@/lib/db/bootcamps';

// Mark route as dynamic since it uses server session and headers
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Get user session first
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const baseEmail = session.user.email?.trim().toLowerCase();
    if (!baseEmail) {
      return NextResponse.json({ error: 'User email not found in session' }, { status: 401 });
    }

    // Optional query params to aid immediate post-registration discovery
    const searchParams = req.nextUrl.searchParams;
    const registrationId = searchParams.get('registrationId');
    // Allow client to pass email/userId hints (will be validated by session)
    const hintEmail = searchParams.get('email')?.trim().toLowerCase();
    const hintUserId = searchParams.get('userId')?.trim() || (session.user as any)?.id || '';

    const email = hintEmail || baseEmail;

    const results: any[] = [];

    // Helper-backed lookups ensure we hit Cosmos or memory fallback consistently
    if (hintUserId) {
      results.push(...(await getBootcampRegistrationsByUserId(hintUserId)));
    } else if ((session.user as any)?.id) {
      results.push(...(await getBootcampRegistrationsByUserId((session.user as any).id)));
    }

    if (email) {
      results.push(...(await getBootcampRegistrationsByEmail(email)));
    }

    const container = await getBootcampRegistrationsContainer();

    // Optional targeted lookup by registration id if it's not already included
    if (registrationId) {
      const exists = results.some((reg) => reg.id === registrationId);
      if (!exists) {
        try {
          const { resources } = await (container as any).items
            .query({
              query: `SELECT * FROM c WHERE c.id = @id`,
              parameters: [{ name: '@id', value: registrationId }],
            })
            .fetchAll();
          results.push(...(resources || []));
        } catch (e) {
          console.warn('Query by registrationId failed:', e);
        }
      }
    }

    // Deduplicate and normalize
    const map = new Map<string, any>();
    for (const reg of results) {
      const id = reg.id || `${reg.bootcampId}-${reg.email || email}`;
      map.set(id, {
        ...reg,
        id,
        type: reg.type || 'bootcamp-registration',
        email: (reg.email || email || '').toLowerCase(),
        userId: reg.userId || hintUserId || `user-${id}`,
        bootcampId: reg.bootcampId || reg.track || 'cloud-foundation',
        bootcampName:
          reg.bootcampName ||
          (reg.bootcampId
            ? `${reg.bootcampId}`.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
            : 'Cloud Foundation'),
        paymentStatus: reg.paymentStatus || 'Pending',
        completionStatus: reg.completionStatus || 'Not Started',
        createdAt: reg.createdAt || new Date().toISOString(),
        updatedAt: reg.updatedAt || new Date().toISOString(),
      });
    }

    const registrations = Array.from(map.values());
    return NextResponse.json({ registrations });
  } catch (error) {
    console.error('Error in bootcamp registrations endpoint:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
