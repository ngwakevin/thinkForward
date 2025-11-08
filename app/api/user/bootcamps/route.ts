import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  enrollInBootcamp,
  updateBootcampProgress,
  completeBootcamp,
  updateBootcampStatus,
  unenrollFromBootcamp,
  getUserBootcamps,
  getBootcampsByStatus,
  updateBootcampDetails,
} from '@/lib/azure/bootcamp-service';
import { Bootcamp } from '@/lib/azure/cosmos-service';

/**
 * GET /api/user/bootcamps
 * Get all enrolled bootcamps for the authenticated user
 * Query params: ?status=in-progress (optional)
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let bootcamps;
    if (status && ['enrolled', 'in-progress', 'completed', 'upcoming'].includes(status)) {
      bootcamps = await getBootcampsByStatus(userId, status as any);
    } else {
      bootcamps = await getUserBootcamps(userId);
    }

    return NextResponse.json({ bootcamps });
  } catch (error) {
    console.error('Error fetching user bootcamps:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/user/bootcamps
 * Enroll in a new bootcamp
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 400 });
    }

    const bootcampData: Bootcamp = await req.json();

    // Validate required fields
    if (!bootcampData.id || !bootcampData.title || !bootcampData.startDate || !bootcampData.endDate) {
      return NextResponse.json(
        { error: 'Missing required fields: id, title, startDate, endDate' },
        { status: 400 }
      );
    }

    const success = await enrollInBootcamp(userId, bootcampData);

    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Successfully enrolled in bootcamp',
        bootcamp: bootcampData 
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to enroll in bootcamp' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error enrolling in bootcamp:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PATCH /api/user/bootcamps
 * Update bootcamp progress, status, or details
 */
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 400 });
    }

    const body = await req.json();
    const { bootcampId, action, ...data } = body;

    if (!bootcampId) {
      return NextResponse.json({ error: 'bootcampId is required' }, { status: 400 });
    }

    let success = false;

    switch (action) {
      case 'update-progress':
        if (typeof data.progress !== 'number') {
          return NextResponse.json({ error: 'progress is required' }, { status: 400 });
        }
        success = await updateBootcampProgress(
          userId, 
          bootcampId, 
          data.progress, 
          data.updateStatus || false
        );
        break;

      case 'complete':
        success = await completeBootcamp(
          userId, 
          bootcampId, 
          data.issueCertificate !== false
        );
        break;

      case 'update-status':
        if (!data.status) {
          return NextResponse.json({ error: 'status is required' }, { status: 400 });
        }
        success = await updateBootcampStatus(userId, bootcampId, data.status);
        break;

      case 'update-details':
        success = await updateBootcampDetails(userId, bootcampId, data);
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Bootcamp updated successfully' 
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to update bootcamp' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error updating bootcamp:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/user/bootcamps?bootcampId=xxx
 * Unenroll from a bootcamp
 */
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const bootcampId = searchParams.get('bootcampId');

    if (!bootcampId) {
      return NextResponse.json({ error: 'bootcampId is required' }, { status: 400 });
    }

    const success = await unenrollFromBootcamp(userId, bootcampId);

    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Successfully unenrolled from bootcamp' 
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to unenroll from bootcamp' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error unenrolling from bootcamp:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
