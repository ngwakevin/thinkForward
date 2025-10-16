import { NextRequest, NextResponse } from 'next/server';
import { container } from '../../../../lib/azure/cosmos-config';

// This is a simple API endpoint that doesn't require authentication
// It's used to look up a bootcamp registration by its ID or email
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const registrationId = searchParams.get('id');
    const email = searchParams.get('email')?.toLowerCase();
    const userId = searchParams.get('userId');
    
    console.log('Bootcamp registration lookup request:', {
      registrationId,
      email,
      userId
    });
    
    if (!registrationId && !email && !userId) {
      return NextResponse.json(
        { error: 'Missing required parameter - either id, email, or userId must be provided' },
        { status: 400 }
      );
    }
    
    let registrations: any[] = [];
    
    // Query by registration ID
    if (registrationId) {
      const { resources: regById } = await container.items
        .query({
          query: "SELECT * FROM c WHERE c.id = @id",
          parameters: [{ name: '@id', value: registrationId }]
        })
        .fetchAll();
      
      console.log(`Found ${regById.length} registrations by ID`);
      registrations = regById;
    }
    
    // Query by email if no results yet
    if (registrations.length === 0 && email) {
      // First attempt with a very permissive query that just looks for bootcamp-related entries
      const { resources: emailResults } = await container.items
        .query({
          query: "SELECT * FROM c WHERE c.email = @email AND IS_DEFINED(c.bootcampId)",
          parameters: [{ name: '@email', value: email }]
        })
        .fetchAll();
      console.log(`Found ${emailResults.length} registrations by exact email match`);
      
      // For debugging: Check if any registrations exist with this email
      const { resources: totalWithEmail } = await container.items
        .query({
          query: "SELECT COUNT(1) as total FROM c WHERE c.email = @email",
          parameters: [{ name: '@email', value: email }]
        })
        .fetchAll();
      console.log(`Total items with email ${email}:`, totalWithEmail[0]?.total || 0);
      
      if (totalWithEmail[0]?.total > 0) {
        // If there are items with this email, examine one to understand its structure
        const { resources: sampleWithEmail } = await container.items
          .query({
            query: "SELECT TOP 1 * FROM c WHERE c.email = @email",
            parameters: [{ name: '@email', value: email }]
          })
          .fetchAll();
        
        if (sampleWithEmail.length > 0) {
          console.log('Sample item with this email:', sampleWithEmail[0]);
          console.log('Sample keys:', Object.keys(sampleWithEmail[0]));
          
          // If the sample item has bootcampId but our original query found nothing,
          // there might be a case issue with the email - try case-insensitive query
          if (sampleWithEmail[0].bootcampId && emailResults.length === 0) {
            const { resources: caseInsensitiveResults } = await container.items
              .query({
                query: "SELECT * FROM c WHERE LOWER(c.email) = @email AND IS_DEFINED(c.bootcampId)",
                parameters: [{ name: '@email', value: email.toLowerCase() }]
              })
              .fetchAll();
            console.log(`Found ${caseInsensitiveResults.length} registrations with case-insensitive email match`);
            
            if (caseInsensitiveResults.length > 0) {
              registrations = caseInsensitiveResults;
              return NextResponse.json({ registrations }, { status: 200 });
            }
          }
        }
      }
      
      registrations = emailResults;
    }
    
    // Query by userId if no results yet
    if (registrations.length === 0 && userId) {
      // Try with just userId and bootcampId condition
      const { resources: userIdResults } = await container.items
        .query({
          query: "SELECT * FROM c WHERE IS_DEFINED(c.bootcampId) AND c.userId = @userId",
          parameters: [{ name: '@userId', value: userId }]
        })
        .fetchAll();
      console.log(`Found ${userIdResults.length} registrations by userId`);
      
      if (userIdResults.length === 0) {
        // If we found nothing, try a broad scan for the userId
        const { resources: anyWithUserId } = await container.items
          .query({
            query: "SELECT * FROM c WHERE c.userId = @userId",
            parameters: [{ name: '@userId', value: userId }]
          })
          .fetchAll();
          
        console.log(`Found ${anyWithUserId.length} total items with userId ${userId}`);
        
        if (anyWithUserId.length > 0) {
          // Filter client-side to find anything bootcamp-related
          const bootcampRelated = anyWithUserId.filter(item => {
            return item.bootcampId || 
                  item.bootcampName || 
                  (item.type && item.type.includes('bootcamp')) ||
                  (item.paymentReference && item.paymentStatus);
          });
          
          console.log(`After filtering, found ${bootcampRelated.length} bootcamp-related items`);
          
          if (bootcampRelated.length > 0) {
            registrations = bootcampRelated;
            return NextResponse.json({ registrations }, { status: 200 });
          }
        }
      }
      
      registrations = userIdResults;
    }
    
    // Additional fallback for fuzzy email match
    if (registrations.length === 0 && email) {
      const { resources: fuzzyEmailResults } = await container.items
        .query({
          query: "SELECT * FROM c WHERE IS_DEFINED(c.bootcampId) AND CONTAINS(LOWER(c.email), @emailPart)",
          parameters: [{ name: '@emailPart', value: email.toLowerCase() }]
        })
        .fetchAll();
      console.log(`Found ${fuzzyEmailResults.length} registrations by fuzzy email match`);
      registrations = fuzzyEmailResults;
    }
    
    // As a last resort, if we have an email but no results, perform a deep search
    if (registrations.length === 0 && (email || userId)) {
      console.log('DEEP SEARCH: No registrations found with standard queries, attempting deeper search');
      
      const params: any[] = [];
      let queryConditions = "IS_DEFINED(c.bootcampId) AND (";
      
      if (email) {
        queryConditions += "CONTAINS(LOWER(c.email), @email)";
        params.push({ name: '@email', value: email.toLowerCase() });
      }
      
      if (userId) {
        if (email) queryConditions += " OR ";
        queryConditions += "c.userId = @userId";
        params.push({ name: '@userId', value: userId });
      }
      
      queryConditions += ")";
      
      const { resources: anyMatches } = await container.items
        .query({
          query: `SELECT * FROM c WHERE ${queryConditions}`,
          parameters: params
        })
        .fetchAll();
      
      console.log(`DEEP SEARCH: Found ${anyMatches.length} potential matches`);
      
      if (anyMatches.length > 0) {
        registrations = anyMatches;
      }
    }
    
    return NextResponse.json({ registrations }, { status: 200 });
  } catch (error) {
    console.error('Error looking up bootcamp registration:', error);
    return NextResponse.json(
      { error: 'Failed to look up bootcamp registration' },
      { status: 500 }
    );
  }
}