import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/auth';
import { cosmosService } from '../../../../lib/azure/cosmos-service';

// Get presigned URL for avatar upload or handle direct uploads
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse form data (if using direct upload)
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only images are allowed' }, { status: 400 });
    }

    // Check file size (limit to 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 2MB limit' }, { status: 400 });
    }

    // For demo purposes - generate a mock URL
    // In a real implementation, upload to blob storage or S3
    const timestamp = Date.now();
    
    // Get user ID from session (handled below if not directly available)
    const sessUser: any = session.user;
    const sessionUserId = sessUser?.id || 'user';
    const mockUrl = `https://thinkforward-avatars.azurewebsites.net/uploads/${sessionUserId}/avatar-${timestamp}.${file.name.split('.').pop()}`;

    // TODO: In production, implement actual file upload to blob storage

    // Update the user profile with the new avatar URL
    let userId = sessUser?.id;
    
    // If no ID in session, try to find user
    if (!userId) {
      let user: any = null;
      
      // Try to find user by email
      if (session.user.email) {
        user = await cosmosService.getUserByEmail(session.user.email.toLowerCase());
      }
      
      if (user) {
        userId = user.id;
      } else {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
    }

    // Update user's profile with the new avatar URL
    await cosmosService.updateUser(userId, { 
      profile: { avatarUrl: mockUrl } 
    });

    return NextResponse.json({
      success: true,
      url: mockUrl,
      message: 'Avatar uploaded successfully'
    });
  } catch (error) {
    console.error('Error in avatar upload API:', error);
    return NextResponse.json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}