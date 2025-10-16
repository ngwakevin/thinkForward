import { getServerSession } from 'next-auth';
import { NextResponse, NextRequest } from 'next/server';
import { authOptions } from '../../../../lib/auth';
import { container } from '../../../../lib/azure/cosmos-config';

// Mark route as dynamic since it uses server session and headers
export const dynamic = 'force-dynamic';

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

    // First, try a broader query without any filters to see what's in the container
    const debugQuerySpec = {
      query: `SELECT * FROM c WHERE CONTAINS(LOWER(c.email), @emailPart) OR (IS_DEFINED(c.userId) AND c.userId = @userId)`,
      parameters: [
        { name: '@emailPart', value: email.split('@')[0].toLowerCase() },
        { name: '@userId', value: userId || '' }
      ]
    };

    try {
      // Execute the debug query
      const { resources: debugResults } = await container.items.query(debugQuerySpec).fetchAll();
      
      console.log(`DEBUG: Found ${debugResults.length} potential matching records`);
      debugResults.forEach((item, index) => {
        console.log(`DEBUG: Item ${index + 1}:`, 
          `id: ${item.id}`,
          `type: ${item.type || 'undefined'}`, 
          `email: ${item.email || 'undefined'}`, 
          `userId: ${item.userId || 'undefined'}`,
          `bootcampId: ${item.bootcampId || 'undefined'}`
        );
      });
      
      // Now perform the normal query but with more flexible conditions
      const querySpec = {
        query: `
          SELECT * FROM c
          WHERE LOWER(c.email) = @email 
          OR (IS_DEFINED(c.type) AND c.type = 'bootcamp-registration')
          OR (IS_DEFINED(c.bootcampId) AND IS_DEFINED(c.email) AND LOWER(c.email) = @email)
        `,
        parameters: [{ name: '@email', value: email }]
      };

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
            WHERE c.userId = @userId 
            OR (IS_DEFINED(c.type) AND c.type = 'bootcamp-registration' AND IS_DEFINED(c.userId) AND c.userId = @userId)
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