import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../../lib/auth';
import { communityService } from '../../../../../../lib/azure/community-service';
import { cosmosService } from '../../../../../../lib/azure/cosmos-service';

// Get tags for a thread
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const tags = await communityService.getTagsByThreadId(params.id);
  
  return NextResponse.json(tags);
}

// Add tags to a thread
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any)?.id;
  
  // Get thread to check ownership
  const thread = await communityService.getThreadById(params.id);
  
  if (!thread) {
    return NextResponse.json({ error: 'Thread not found' }, { status: 404 });
  }
  
  // Only thread owner or mentors can add tags
  const user = await cosmosService.getUserById(userId);
  
  if (thread.authorId !== userId && !user?.isMentor) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  try {
    const { tagIds } = await req.json();
    
    if (!tagIds || !Array.isArray(tagIds)) {
      return NextResponse.json({ error: 'Tag IDs are required' }, { status: 400 });
    }
    
    if (tagIds.length > 5) {
      return NextResponse.json({ error: 'Maximum 5 tags allowed' }, { status: 400 });
    }
    
    // Update thread tags
    await communityService.setThreadTags(params.id, tagIds);
    
    // Return updated thread with tags
    const updatedTags = await communityService.getTagsByThreadId(params.id);
    
    return NextResponse.json(updatedTags);
  } catch (error) {
    console.error('Error adding tags to thread:', error);
    return NextResponse.json({ error: 'Failed to add tags' }, { status: 500 });
  }
}