import { NextRequest, NextResponse } from 'next/server';
import { container } from '../../../../lib/azure/cosmos-config';

// Mark as dynamic since it accesses data
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Check for query parameters
    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    const email = searchParams.get('email');
    
    // Build the query based on parameters
    let querySpec;
    
    if (email) {
      querySpec = {
        query: "SELECT * FROM c WHERE LOWER(c.email) = @email",
        parameters: [{ name: '@email', value: email.toLowerCase() }]
      };
    } else {
      querySpec = {
        query: "SELECT * FROM c WHERE IS_DEFINED(c.email) ORDER BY c.createdAt DESC OFFSET 0 LIMIT @limit",
        parameters: [{ name: '@limit', value: limit }]
      };
    }
    
    // Execute the query
    const { resources: results } = await container.items.query(querySpec).fetchAll();
    
    // Check for schema issues
    const registrationStatus = results.map(reg => {
      const missingFields = [];
      
      if (!reg.type) missingFields.push('type');
      if (!reg.bootcampId) missingFields.push('bootcampId');
      if (!reg.userId) missingFields.push('userId');
      
      return {
        id: reg.id,
        email: reg.email,
        type: reg.type || 'undefined',
        bootcampId: reg.bootcampId || 'undefined',
        userId: reg.userId || 'undefined',
        isComplete: missingFields.length === 0,
        missingFields: missingFields.length > 0 ? missingFields : undefined
      };
    });
    
    // Summary statistics
    const stats = {
      total: registrationStatus.length,
      complete: registrationStatus.filter(r => r.isComplete).length,
      incomplete: registrationStatus.filter(r => !r.isComplete).length,
      missingType: registrationStatus.filter(r => r.missingFields?.includes('type')).length,
      missingBootcampId: registrationStatus.filter(r => r.missingFields?.includes('bootcampId')).length,
      missingUserId: registrationStatus.filter(r => r.missingFields?.includes('userId')).length,
    };

    return NextResponse.json({ 
      stats,
      registrations: registrationStatus
    });
  } catch (error: any) {
    console.error('Error in validate-registrations endpoint:', error);
    return NextResponse.json({ 
      error: 'Failed to validate registrations',
      message: error.message 
    }, { status: 500 });
  }
}