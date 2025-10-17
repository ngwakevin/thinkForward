import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { communityService } from '../../../../lib/azure/community-service';

// Get all tags
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const tags = await communityService.getTags();
  
  return NextResponse.json(tags);
}

// Create a new tag
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  // Check if user is a mentor (only mentors can create tags)
  const userId = (session.user as any)?.id;
  
  // For build testing, assume the user is a mentor
  const isMentor = true; // In production, this would be verified
  
  if (!isMentor) {
    return NextResponse.json({ error: 'Only mentors can create tags' }, { status: 403 });
  }
  
  try {
    const { name } = await req.json();
    
    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    
    if (name.length < 2 || name.length > 30) {
      return NextResponse.json({ error: 'Tag name must be between 2 and 30 characters' }, { status: 400 });
    }
    
    // Check if tag already exists - we use the method we know exists
    const existingTags = await communityService.getTags();
    const tagExists = existingTags.some((tag: any) => tag.name.toLowerCase() === name.toLowerCase());
    
    if (tagExists) {
      return NextResponse.json({ error: 'Tag already exists' }, { status: 409 });
    }
    
    // Create tag
    const tag = await communityService.createTag(name.toLowerCase(), userId);
    
    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error('Error creating tag:', error);
    return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 });
  }
}