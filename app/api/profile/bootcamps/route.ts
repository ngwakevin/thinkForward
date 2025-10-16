import { getServerSession } from 'next-auth';
import { NextResponse, NextRequest } from 'next/server';
import { authOptions } from '../../../../lib/auth';
import { container } from '../../../../lib/azure/cosmos-config';

export async function GET(req: NextRequest) {
  try {
    // Get user session first
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'User email not found in session' }, { status: 401 });
    }

    // Normalize the email from session
    const email = session.user.email.trim().toLowerCase();
    
    console.log('Fetching bootcamp registrations for:', email);

    // Check for optional query parameters
    const searchParams = req.nextUrl.searchParams;
    const registrationId = searchParams.get('registrationId');
    const userId = (session.user as any)?.id;

    // Construct the query
    const querySpec = {
      query: `
        SELECT * FROM c
        WHERE LOWER(c.email) = @email AND 
        (c.type = 'bootcamp-registration' OR IS_DEFINED(c.bootcampId))
      `,
      parameters: [{ name: '@email', value: email }]
    };

    try {
      // Execute the query
      const { resources: results } = await container.items.query(querySpec).fetchAll();
      
      console.log(`Found ${results.length} registrations for email ${email}`);
      
      // If we have a userId and found no results by email, try with userId
      let userIdResults: any[] = [];
      if (userId && results.length === 0) {
        console.log(`No results with email, trying userId: ${userId}`);
        const userIdQuerySpec = {
          query: `
            SELECT * FROM c
            WHERE c.userId = @userId AND 
            (c.type = 'bootcamp-registration' OR IS_DEFINED(c.bootcampId))
          `,
          parameters: [{ name: '@userId', value: userId }]
        };
        
        const { resources } = await container.items.query(userIdQuerySpec).fetchAll();
        userIdResults = resources;
        console.log(`Found ${userIdResults.length} registrations by userId`);
      }
      
      // If registration ID was provided, look it up directly
      let idResults: any[] = [];
      if (registrationId) {
        console.log(`Looking up specific registration: ${registrationId}`);
        const idQuerySpec = {
          query: "SELECT * FROM c WHERE c.id = @id",
          parameters: [{ name: '@id', value: registrationId }]
        };
        
        const { resources } = await container.items.query(idQuerySpec).fetchAll();
        idResults = resources;
        console.log(`Found ${idResults.length} registrations by ID`);
      }
      
      // Combine all results, preferring email matches first
      const allResults = [...results, ...userIdResults, ...idResults];
      
      // Deduplicate by ID and add missing properties
      const registrationMap = new Map();
      allResults.forEach(reg => {
        registrationMap.set(reg.id, {
          ...reg,
          // Ensure the type field exists
          type: reg.type || 'bootcamp-registration',
          // Ensure email is set
          email: reg.email || email,
          // Ensure userId is set
          userId: reg.userId || userId || `user-${reg.id}`
        });
      });
      
      // Convert Map back to array
      const registrations = Array.from(registrationMap.values());
      
      // Log result summary
      if (registrations.length > 0) {
        console.log(`Returning ${registrations.length} total registrations`);
        console.log('Sample registration:', JSON.stringify({
          id: registrations[0].id,
          type: registrations[0].type,
          email: registrations[0].email,
          bootcampId: registrations[0].bootcampId,
          bootcampName: registrations[0].bootcampName
        }, null, 2));
      } else {
        console.log('No registrations found for user');
      }

      return NextResponse.json({ registrations });
    } catch (err) {
      console.error('Error querying Cosmos DB:', err);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in bootcamp registrations endpoint:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

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
      // Query for exact email match - with broader criteria
      const { resources: emailResults } = await container.items
        .query({
          query: "SELECT * FROM c WHERE c.email = @email AND IS_DEFINED(c.bootcampId)",
          parameters: [{ name: '@email', value: userEmail }]
        })
        .fetchAll();
      emailRegistrations = emailResults;
      console.log(`Found ${emailRegistrations.length} registrations by email match: ${userEmail}`);
      
      // If no results, try with CONTAINS for case-insensitive matching
      if (emailRegistrations.length === 0) {
        const { resources: fuzzyEmailResults } = await container.items
          .query({
            query: "SELECT * FROM c WHERE IS_DEFINED(c.bootcampId) AND CONTAINS(LOWER(c.email), @emailPart)",
            parameters: [{ name: '@emailPart', value: userEmail.toLowerCase() }]
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
            query: "SELECT * FROM c WHERE IS_DEFINED(c.bootcampId) AND CONTAINS(LOWER(c.email), @domain)",
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
      
      // If there are registrations, retrieve one sample to examine its structure
      if (exactEmailCount[0]?.total > 0) {
        const { resources: sampleReg } = await container.items
          .query({
            query: "SELECT TOP 1 * FROM c WHERE c.email = @email",
            parameters: [{ name: '@email', value: session.user.email.toLowerCase() }]
          })
          .fetchAll();
          
        if (sampleReg.length > 0) {
          console.log('SAMPLE REGISTRATION STRUCTURE:', JSON.stringify(sampleReg[0], null, 2));
          console.log('SAMPLE REGISTRATION KEYS:', Object.keys(sampleReg[0]));
        }
      }
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
    
    // EMERGENCY FALLBACK: If we still don't have registrations but know they exist, try a direct lookup
    let directEmailRegistrations: any[] = [];
    if (userEmail && (emailRegistrations.length === 0 && legacyRegistrations.length === 0 && registrationsWithType.length === 0)) {
      console.log('*** EMERGENCY FALLBACK: No registrations found with standard queries, trying direct lookup ***');
      
      // Try with an extremely simple query
      const { resources: directResults } = await container.items
        .query({
          query: "SELECT * FROM c WHERE c.email = @email",
          parameters: [{ name: '@email', value: userEmail.toLowerCase() }]
        })
        .fetchAll();
      
      // Filter client-side for bootcamp-related entries
      directEmailRegistrations = directResults.filter(item => {
        return item.bootcampId || 
               item.bootcampName || 
               (item.type && item.type.includes('bootcamp')) ||
               (item.paymentReference && item.paymentStatus);
      });
      
      console.log(`EMERGENCY DIRECT LOOKUP: Found ${directResults.length} total items, ${directEmailRegistrations.length} look bootcamp-related`);
      
      // If we found items, log the first one for debugging
      if (directEmailRegistrations.length > 0) {
        console.log('EMERGENCY DIRECT LOOKUP EXAMPLE:', JSON.stringify(directEmailRegistrations[0], null, 2));
      }
    }
    
    // Combine and deduplicate results by id
    const registrationMap = new Map();
    [...registrationsWithType, ...legacyRegistrations, ...emailRegistrations, ...specificRegistration, ...directEmailRegistrations].forEach(reg => {
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