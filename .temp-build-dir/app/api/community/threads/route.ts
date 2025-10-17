import { NextResponse } from 'next/server';
import { communityService } from '../../../../lib/azure/community-service';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  let searchParams = new URLSearchParams();
  try {
    if (req.url && req.url.trim() !== '') {
      searchParams = new URL(req.url).searchParams;
    }
  } catch (e) {
    console.warn('Failed to parse URL in threads API:', req.url);
  }
  
  // Extract query parameters
  const categoryId = searchParams.get('categoryId') || undefined;
  const q = searchParams.get('q') || undefined;
  const sortType = searchParams.get('sort') || 'recent';
  const limit = parseInt(searchParams.get('limit') || '50', 10);
  
  // Determine sort configuration
  let sortBy = 'createdAt';
  let sortOrder = 'desc' as 'asc' | 'desc';
  
  switch (sortType) {
    case 'trending':
      sortBy = 'viewCount';
      sortOrder = 'desc';
      break;
    case 'top':
      sortBy = 'postCount'; // We'll need to handle this differently
      sortOrder = 'desc';
      break;
    case 'recent':
    default:
      sortBy = 'createdAt';
      sortOrder = 'desc';
  }

  // Get threads using our Cosmos DB service
  const rawThreads = await communityService.getThreads({
    categoryId: categoryId || undefined,
    search: q || undefined,
    limit,
    sortBy,
    sortOrder
  });
  
  // Enhance threads with user, category, and posts information
  const enhancedThreads = await Promise.all(rawThreads.map(async (thread) => {
    const { cosmosService } = await import('../../../../lib/azure/cosmos-service');
    const user = await cosmosService.getUserById(thread.authorId);
    const category = await communityService.getCategoryBySlug(thread.categoryId);
    const posts = await communityService.getPostsByThreadId(thread.id);
    const tags = await communityService.getTagsByThreadId(thread.id);
    
    return {
      ...thread,
      user: {
        id: user?.id,
        name: user?.name,
        profile: {
          displayName: user?.profile?.displayName || user?.name,
          avatarUrl: user?.profile?.avatarUrl
        }
      },
      category,
      posts: posts.map(p => ({ id: p.id })),
      tags: tags.map(tag => ({ 
        tag: { 
          id: tag.id, 
          name: tag.name 
        } 
      })),
      _count: {
        posts: posts.length
      }
    };
  }));
  
  return NextResponse.json(enhancedThreads);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!session.user?.email) return NextResponse.json({ error: 'User email not found' }, { status: 400 });
  
  // Get user ID from email
  const { cosmosService } = await import('../../../../lib/azure/cosmos-service');
  const user = await cosmosService.getUserByEmail(session.user.email);
  if (!user?.id) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  
  const authorId = user.id;
  
  try {
    const { categoryId, title, content, tags = [] } = await req.json();
    
    if (!categoryId) return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    if (!content) return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    
    // First check if category exists
    const category = await communityService.getCategoryBySlug(categoryId);
    if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    
    // Create thread
    const thread = await communityService.createThread({ 
      title, 
      content, 
      authorId, 
      categoryId: category.id, 
      isSticky: false, 
      isClosed: false 
    });
    
    // Add tags if provided
    if (tags && tags.length > 0) {
      const tagIds = [];
      
      for (const tagName of tags) {
        // Find or create tag
        let tag = await communityService.getTagByName(tagName);
        
        if (!tag) {
          tag = await communityService.createTag(tagName, authorId);
        }
        
        tagIds.push(tag.id);
      }
      
      // Create thread-tag relationships
      if (tagIds.length > 0) {
        await communityService.setThreadTags(thread.id, tagIds);
      }
    }
    
    return NextResponse.json({ thread: { ...thread, tags } });
  } catch (error) {
    console.error('Error creating thread:', error);
    return NextResponse.json({ error: 'Failed to create thread' }, { status: 500 });
  }
}