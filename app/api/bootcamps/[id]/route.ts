import { NextRequest, NextResponse } from 'next/server';
import { getBootcampById } from '../../../../lib/db/bootcamp-catalog';

// Mark route as dynamic since it uses database access
export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bootcampId = params.id;
    
    if (!bootcampId) {
      return NextResponse.json(
        { error: 'Bootcamp ID is required' },
        { status: 400 }
      );
    }
    
    const bootcamp = await getBootcampById(bootcampId);
    
    if (!bootcamp) {
      return NextResponse.json(
        { error: 'Bootcamp not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(bootcamp);
  } catch (error) {
    console.error(`Error fetching bootcamp:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch bootcamp' },
      { status: 500 }
    );
  }
}