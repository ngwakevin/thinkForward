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

    // Check URL parameters (for cases where the session might not have all data yet)
    const searchParams = req.nextUrl.searchParams;
    const emailParam = searchParams.get('email')?.toLowerCase();
    const registrationId = searchParams.get('registrationId');
    const userIdParam = searchParams.get('userId');
    
    // Log all available parameters and headers for debugging
    console.log('Search parameters:', {
      email: emailParam,
      registrationId,
      userId: userIdParam,
      headers: {
        cookie: req.headers.get('cookie') ? 'exists' : 'missing',
        authorization: req.headers.get('authorization') ? 'exists' : 'missing'
      },
      session: session ? 'exists' : 'missing'
    });

    // Get the user ID from all possible sources
    let userId: string | undefined;
    let userEmail: string | undefined;
    
    // First check if ID is in the session directly
    const sess = session?.user as any;
    if (sess?.id) {
      userId = sess.id;
      console.log('Found user ID in session:', userId);
    } 
    // Check for ID in the session with type casting since NextAuth types don't include id
    else if ((session?.user as any)?.id) {
      userId = (session.user as any).id;
      console.log('Found user ID in session.user.id:', userId);
    }
    // Check URL param
    else if (userIdParam) {
      userId = userIdParam;
      console.log('Found user ID in URL parameter:', userId);
    }
    
    // Set email from all possible sources
    userEmail = session?.user?.email?.toLowerCase() || emailParam;
    console.log('Using email for lookup:', userEmail);
    
    // Print session data for debugging
    console.log('Session data:', {
      hasUser: !!session?.user,
      email: session?.user?.email,
      name: session?.user?.name,
      expires: session?.expires
    });
    
    // Look up user by email if we don't have a userId
    if (!userId && userEmail) {
      console.log('Looking up user by email:', userEmail);
      const user = await cosmosService.getUserByEmail(userEmail);
      if (user) {
        userId = user.id;
        console.log('Found user ID by email lookup:', userId);
      }
    }

    if (!userId) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Log the user details for debugging
    console.log('Fetching bootcamp registrations for user:', {
      userId,
      email: session.user?.email,
      name: session.user?.name
    });

    // Query bootcamp registrations using user ID or email
    // First try with the type field that's now being added to registrations
    const { resources: registrationsWithType } = await container.items
      .query({
        query: "SELECT * FROM c WHERE c.type = 'bootcamp-registration' AND c.userId = @userId",
        parameters: [{ name: '@userId', value: userId }]
      })
      .fetchAll();
    
    console.log('Registrations with type field query result:', registrationsWithType.length);
      
    // As a fallback for older registrations, also check records without a type but with bootcamp fields
    const { resources: legacyRegistrations } = await container.items
      .query({
        query: "SELECT * FROM c WHERE c.userId = @userId AND IS_DEFINED(c.bootcampId) AND IS_DEFINED(c.paymentReference)",
        parameters: [{ name: '@userId', value: userId }]
      })
      .fetchAll();
    
    console.log('Legacy registrations query result:', legacyRegistrations.length);
      
    // Additional fallback - try to find by email (always try this even if we have userId)
    let emailRegistrations: any[] = [];
    if (userEmail) {
      // Query for exact email match
      const { resources: emailResults } = await container.items
        .query({
          query: "SELECT * FROM c WHERE (c.type = 'bootcamp-registration' OR IS_DEFINED(c.bootcampId)) AND c.email = @email",
          parameters: [{ name: '@email', value: userEmail }]
        })
        .fetchAll();
      emailRegistrations = emailResults;
      console.log(`Found ${emailRegistrations.length} registrations by email match: ${userEmail}`);
      
      // If no results, try with CONTAINS for case-insensitive matching
      if (emailRegistrations.length === 0) {
        const { resources: fuzzyEmailResults } = await container.items
          .query({
            query: "SELECT * FROM c WHERE (c.type = 'bootcamp-registration' OR IS_DEFINED(c.bootcampId)) AND CONTAINS(LOWER(c.email), @emailPart)",
            parameters: [{ name: '@emailPart', value: userEmail }]
          })
          .fetchAll();
        emailRegistrations = fuzzyEmailResults;
        console.log(`Found ${emailRegistrations.length} registrations by fuzzy email match: ${userEmail}`);
      }
      
      // If still no results, do a very broad search for the email domain
      if (emailRegistrations.length === 0 && userEmail.includes('@')) {
        const emailDomain = userEmail.split('@')[1];
        const { resources: domainResults } = await container.items
          .query({
            query: "SELECT * FROM c WHERE (c.type = 'bootcamp-registration' OR IS_DEFINED(c.bootcampId)) AND CONTAINS(LOWER(c.email), @domain)",
            parameters: [{ name: '@domain', value: '@' + emailDomain }]
          })
          .fetchAll();
        console.log(`Found ${domainResults.length} registrations by email domain: @${emailDomain}`);
        
        // Only use domain results if there are a reasonable number (less than 10)
        if (domainResults.length > 0 && domainResults.length < 10) {
          emailRegistrations = domainResults;
        }
      }
    }
      
    // Log query results for debugging
    console.log(`Found ${registrationsWithType.length} registrations with type='bootcamp-registration'`);
    console.log(`Found ${legacyRegistrations.length} legacy registrations without type field`);
    
    // For debugging: Check if any bootcamp registrations exist at all in the system
    const { resources: anyRegistrations } = await container.items
      .query({
        query: "SELECT COUNT(1) as total FROM c WHERE c.type = 'bootcamp-registration' OR IS_DEFINED(c.bootcampId)",
      })
      .fetchAll();
    console.log('Total bootcamp registrations in database:', anyRegistrations[0]?.total || 0);
    
    // For debugging: Check if any registrations exist with this user's exact email
    if (session.user?.email) {
      const { resources: exactEmailCount } = await container.items
        .query({
          query: "SELECT COUNT(1) as total FROM c WHERE c.email = @email",
          parameters: [{ name: '@email', value: session.user.email.toLowerCase() }]
        })
        .fetchAll();
      console.log(`Total registrations with email ${session.user.email}:`, exactEmailCount[0]?.total || 0);
    }
    
    // If registrationId was provided, look it up directly
    let specificRegistration: any[] = [];
    if (registrationId) {
      console.log(`Looking up specific registration by ID: ${registrationId}`);
      const { resources: regById } = await container.items
        .query({
          query: "SELECT * FROM c WHERE c.id = @id",
          parameters: [{ name: '@id', value: registrationId }]
        })
        .fetchAll();
      
      console.log(`Found ${regById.length} registrations by ID`);
      specificRegistration = regById;
    }
    
    // Combine and deduplicate results by id
    const registrationMap = new Map();
    [...registrationsWithType, ...legacyRegistrations, ...emailRegistrations, ...specificRegistration].forEach(reg => {
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