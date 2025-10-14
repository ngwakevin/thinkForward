import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { communityService } from '../../../../lib/azure/community-service';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const categories = await communityService.getCategories();
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const { name, description } = body || {};
  if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 });
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  // Use communityService to create a category
  const category = await communityService.createCategory({
    name,
    description,
    slug,
    createdById: (session.user as any)?.id
  });
  return NextResponse.json(category, { status: 201 });
}
