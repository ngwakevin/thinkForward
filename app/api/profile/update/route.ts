import { NextRequest, NextResponse } from 'next/server';
import { withAuthApiSecurity } from '../../../../lib/api-security';
import { logSecurityEvent, SecurityEventType, SecurityEventSeverity } from '../../../../lib/security-audit';
import { getRequestMetadata } from '../../../../lib/security-audit';

/**
 * Protected API route for user profile updates
 * Demonstrates using the security wrapper for an authenticated API route
 */
async function handler(req: NextRequest) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }
  
  try {
    // Extract request metadata for security logging
    const { ipAddress, userAgent } = getRequestMetadata(req);
    
    // Get user from session (this would be implemented based on your auth method)
    const userId = 'user-id'; // Replace with actual user ID from session
    
    // Parse request body
    const data = await req.json();
    
    // Process profile update (placeholder for actual implementation)
    const updatedProfile = { 
      ...data,
      updatedAt: new Date()
    };
    
    // Log the profile update event
    await logSecurityEvent({
      userId,
      eventType: SecurityEventType.PROFILE_UPDATE,
      eventDetails: 'User profile updated',
      ipAddress,
      userAgent,
      severity: SecurityEventSeverity.INFO,
      metadata: { fields: Object.keys(data) },
    });
    
    // Return success response
    return NextResponse.json({ 
      success: true,
      message: 'Profile updated successfully',
      profile: updatedProfile
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

// Export the handler wrapped with security middleware
export const POST = withAuthApiSecurity(handler);