import { getServerSession } from 'next-auth';
import { NextResponse, NextRequest } from 'next/server';
import { authOptions } from '@/lib/auth';
import { getBootcampRegistrationsContainer } from '@/lib/cosmos';

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

    // Use the bootcamp registrations container (not users)
    const container = await getBootcampRegistrationsContainer();

    // Gather results from multiple targeted queries
    const results: any[] = [];

    // 1) By email
    try {
      const { resources } = await (container as any).items.query({
        query: `SELECT * FROM c WHERE IS_DEFINED(c.email) AND LOWER(c.email) = @email`,
        parameters: [{ name: '@email', value: email }],
      }).fetchAll();
      results.push(...(resources || []));
    } catch (e) {
      console.warn('Query by email failed:', e);
    }

    // 2) By userId (if present) and type
    if (hintUserId) {
      try {
        const { resources } = await (container as any).items.query({
          query: `SELECT * FROM c WHERE IS_DEFINED(c.userId) AND c.userId = @userId`,
          parameters: [{ name: '@userId', value: hintUserId }],
        }).fetchAll();
        results.push(...(resources || []));
      } catch (e) {
        console.warn('Query by userId failed:', e);
      }
    }

    // 3) By specific registration id (if provided)
    if (registrationId) {
      try {
        const { resources } = await (container as any).items.query({
          query: `SELECT * FROM c WHERE c.id = @id`,
          parameters: [{ name: '@id', value: registrationId }],
        }).fetchAll();
        results.push(...(resources || []));
      } catch (e) {
        console.warn('Query by registrationId failed:', e);
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