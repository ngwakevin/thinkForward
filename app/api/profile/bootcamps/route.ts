import { getServerSession } from 'next-auth';
import { NextResponse, NextRequest } from 'next/server';
import { authOptions } from '../../../../lib/auth';
import cosmosService from '../../../../lib/azure/cosmos-service';
import { container } from '../../../../lib/azure/cosmos-config';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the user ID from the session
    let userId: string | undefined;
    
    // First check if ID is in the session directly
    const sess = session.user as any;
    if (sess?.id) {
      userId = sess.id;
      console.log('Found user ID in session:', userId);
    } 
    // Check for ID in the session with type casting since NextAuth types don't include id
    else if ((session.user as any)?.id) {
      userId = (session.user as any).id;
      console.log('Found user ID in session.user.id:', userId);
    }
    // Finally fall back to email lookup
    else if (session.user?.email) {
      console.log('Looking up user by email:', session.user.email);
      const user = await cosmosService.getUserByEmail(session.user.email.toLowerCase());
      if (user) {
        userId = user.id;
        console.log('Found user ID by email lookup:', userId);
      }
    }

    if (!userId) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Query bootcamp registrations using user ID or email
    // First try with the type field that's now being added to registrations
    const { resources: registrationsWithType } = await container.items
      .query({
        query: "SELECT * FROM c WHERE c.type = 'bootcamp-registration' AND c.userId = @userId",
        parameters: [{ name: '@userId', value: userId }]
      })
      .fetchAll();
      
    // As a fallback for older registrations, also check records without a type but with bootcamp fields
    const { resources: legacyRegistrations } = await container.items
      .query({
        query: "SELECT * FROM c WHERE c.userId = @userId AND IS_DEFINED(c.bootcampId) AND IS_DEFINED(c.paymentReference)",
        parameters: [{ name: '@userId', value: userId }]
      })
      .fetchAll();
      
    // Additional fallback - try to find by email if userId didn't work
    let emailRegistrations: any[] = [];
    if (session.user?.email) {
      const { resources: emailResults } = await container.items
        .query({
          query: "SELECT * FROM c WHERE (c.type = 'bootcamp-registration' OR IS_DEFINED(c.bootcampId)) AND c.email = @email",
          parameters: [{ name: '@email', value: session.user.email.toLowerCase() }]
        })
        .fetchAll();
      emailRegistrations = emailResults;
      console.log(`Found ${emailRegistrations.length} registrations by email: ${session.user.email}`);
    }
      
    // Log query results for debugging
    console.log(`Found ${registrationsWithType.length} registrations with type='bootcamp-registration'`);
    console.log(`Found ${legacyRegistrations.length} legacy registrations without type field`);
    
    // Combine and deduplicate results by id
    const registrationMap = new Map();
    [...registrationsWithType, ...legacyRegistrations, ...emailRegistrations].forEach(reg => {
      registrationMap.set(reg.id, { 
        ...reg, 
        type: reg.type || 'bootcamp-registration',
        // Ensure userId is always set to current user's ID for consistency
        userId: reg.userId || userId
      });
    });
    
    const registrations = Array.from(registrationMap.values());
    console.log(`Total combined registrations: ${registrations.length}`);
    console.log(`- By type: ${registrationsWithType.length}`);
    console.log(`- Legacy: ${legacyRegistrations.length}`);
    console.log(`- By email: ${emailRegistrations.length}`);
    
    // Log the first registration for debugging if available
    if (registrations.length > 0) {
      console.log('Example registration:', JSON.stringify({
        id: registrations[0].id,
        userId: registrations[0].userId,
        bootcampId: registrations[0].bootcampId,
        bootcampName: registrations[0].bootcampName,
        type: registrations[0].type,
        paymentStatus: registrations[0].paymentStatus,
        email: registrations[0].email
      }));
    }

    return NextResponse.json({ registrations }, { status: 200 });
  } catch (error) {
    console.error('Error fetching bootcamp registrations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bootcamp registrations' },
      { status: 500 }
    );
  }
}