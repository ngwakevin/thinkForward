import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth';
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
    
    const profileData = await req.json();
    
    // Get the user ID from the session
    const sess: any = session.user;
    let userId = sess.id;
    
    // If no ID in session, try to find user by other means
    if (!userId) {
      let user: any = null;
      
      // Try email (most reliable method)
      if (session.user.email) {
        user = await cosmosService.getUserByEmail(session.user.email.toLowerCase());
      }
      
      if (user) {
        userId = user.id;
      } else {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
    }
    
    // Extract profile fields from the profile data
    const {
      displayName,
      bio,
      headline,
      avatarUrl,
      firstName,
      lastName,
      phoneNumber,
      location,
      timezone,
      preferredLanguage,
      currentCompany,
      currentTitle,
      linkedinUrl,
      githubUrl,
      portfolioUrl,
      showProfilePublic,
      showEmailPublic,
      receiveNotifications
    } = profileData;

    // Update user record with Cosmos DB
    await cosmosService.updateUser(userId, {
      firstName,
      lastName,
      phoneNumber,
      preferredLanguage,
      profile: {
        displayName,
        bio,
        headline,
        avatarUrl,
        location,
        timezone,
        currentCompany,
        currentTitle,
        linkedinUrl,
        githubUrl,
        portfolioUrl
        // Note: showProfilePublic, showEmailPublic, receiveNotifications are not in schema yet
      }
    });
    
    return NextResponse.json({ 
      success: true,
      message: 'Profile updated successfully' 
    });
  } catch (error) {
    console.error('Error in profile API (PATCH):', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
