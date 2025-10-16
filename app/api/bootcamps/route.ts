import { NextRequest, NextResponse } from 'next/server';
import { getAllBootcamps } from '../../../lib/db/bootcamp-catalog';

// Mark route as dynamic since it uses database access
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const bootcamps = await getAllBootcamps();
    return NextResponse.json(bootcamps);
  } catch (error) {
    console.error('Error fetching bootcamps:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bootcamps' },
      { status: 500 }
    );
  }
}