import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth';
import prisma from '../../../lib/prisma';
import { cosmosService } from '../../../lib/azure/cosmos-service';

// Minimal version for build testing
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Simple return for now
    return NextResponse.json({ user: { id: 'test-id', email: 'test@example.com' } });
  } catch (error) {
    console.error('Error in profile API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in profile API (PATCH):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
