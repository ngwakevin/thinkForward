import { NextRequest, NextResponse } from 'next/server';
import { container } from '../../../../lib/azure/cosmos-config';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { BootcampRegistration } from '../../../../lib/db/bootcamps';

// Mark as dynamic since it accesses data
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Simple security check for fix operations
    const shouldFix = req.nextUrl.searchParams.get('fix') === 'true';
    
    if (shouldFix) {
      // Verify the user is authorized to make fixes (admin check)
      const session = await getServerSession(authOptions);
      if (!session?.user?.email) {
        return NextResponse.json({ error: 'Authentication required for fix operations' }, { status: 401 });
      }
      
      const allowedAdmins = ['kngwa@cloudegree.com', 'admin@thinkforward.academy'];
      if (!allowedAdmins.includes(session.user.email)) {
        return NextResponse.json({ error: 'Admin privileges required for fix operations' }, { status: 403 });
      }
    }
    
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
    
    // Track fixed registrations
    let fixedCount = 0;
    const fixedIds: string[] = [];
    const failures: Array<{id: string; error: string}> = [];
    
    // Check for schema issues and fix if requested
    const registrationStatus = await Promise.all(results.map(async (reg) => {
      const missingFields = [];
      let needsFixing = false;
      
      // Detect missing fields
      if (!reg.type) {
        missingFields.push('type');
        reg.type = 'bootcamp-registration';
        needsFixing = true;
      }
      
      if (!reg.bootcampId && reg.track) {
        missingFields.push('bootcampId');
        reg.bootcampId = reg.track;
        needsFixing = true;
      } else if (!reg.bootcampId) {
        missingFields.push('bootcampId');
        reg.bootcampId = 'cloud-foundation';
        needsFixing = true;
      }
      
      if (!reg.userId) {
        missingFields.push('userId');
        // We can't auto-fix missing userId without more context
      }
      
      // Fix if requested and needed
      let fixed = false;
      if (shouldFix && needsFixing) {
        try {
          // Make sure we're not missing any required fields in the schema
          const updatedReg: Partial<BootcampRegistration> = {
            ...reg,
            type: reg.type || 'bootcamp-registration',
            bootcampId: reg.bootcampId || reg.track || 'cloud-foundation',
            updatedAt: new Date().toISOString()
          };
          
          // Only attempt to update if we have an ID
          if (reg.id) {
            await container.items.upsert(updatedReg);
            fixed = true;
            fixedCount++;
            fixedIds.push(reg.id);
          }
        } catch (err) {
          console.error(`Failed to fix registration ${reg.id}:`, err);
          failures.push({ id: reg.id, error: (err as Error).message });
          fixed = false;
        }
      }
      
      return {
        id: reg.id,
        email: reg.email,
        type: reg.type || 'undefined',
        bootcampId: reg.bootcampId || 'undefined',
        userId: reg.userId || 'undefined',
        track: reg.track || 'undefined',
        isComplete: missingFields.length === 0,
        missingFields: missingFields.length > 0 ? missingFields : undefined,
        fixed: fixed
      };
    }));
    
    // Summary statistics
    const stats = {
      total: registrationStatus.length,
      complete: registrationStatus.filter(r => r.isComplete).length,
      incomplete: registrationStatus.filter(r => !r.isComplete).length,
      missingType: registrationStatus.filter(r => r.missingFields?.includes('type')).length,
      missingBootcampId: registrationStatus.filter(r => r.missingFields?.includes('bootcampId')).length,
      missingUserId: registrationStatus.filter(r => r.missingFields?.includes('userId')).length,
      fixed: fixedCount,
    };

    return NextResponse.json({ 
      stats,
      registrations: registrationStatus,
      fix: shouldFix ? {
        count: fixedCount,
        ids: fixedIds,
        failures
      } : undefined
    });
  } catch (error: any) {
    console.error('Error in validate-registrations endpoint:', error);
    return NextResponse.json({ 
      error: 'Failed to validate registrations',
      message: error.message 
    }, { status: 500 });
  }
}