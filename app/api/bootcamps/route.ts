import { NextRequest, NextResponse } from 'next/server';
import { getAllBootcamps } from '../../../lib/db/bootcamp-catalog';
import { getBootcampRegistrationsContainer } from '@/lib/cosmos';

// Mark route as dynamic since it uses database access
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    // If an email is provided, return user bootcamp registrations (compat mode)
    if (email) {
      const normalized = email.trim().toLowerCase();
      try {
        const container = await getBootcampRegistrationsContainer();
        const querySpec = {
          query:
            `SELECT * FROM c 
             WHERE (IS_DEFINED(c.email) AND LOWER(c.email) = @email)
                OR (IS_DEFINED(c.userEmail) AND LOWER(c.userEmail) = @email)`,
          parameters: [{ name: '@email', value: normalized }],
        } as const;

        // If container is a mock, it still exposes items.query().fetchAll()
        const { resources } = await (container as any).items
          .query(querySpec)
          .fetchAll();

        // Return an array for compatibility with clients expecting a list
        return NextResponse.json(resources || []);
      } catch (dbErr) {
        console.error('Error fetching user bootcamps:', dbErr);
        // Maintain response shape compatibility: return an empty array on error
        return NextResponse.json([]);
      }
    }

    // Default: return bootcamp catalog
    const bootcamps = await getAllBootcamps();
    return NextResponse.json(bootcamps);
  } catch (error) {
    console.error('Error in /api/bootcamps:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bootcamps' },
      { status: 500 }
    );
  }
}