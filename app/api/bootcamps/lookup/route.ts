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
      // Query for exact email match
      const { resources: emailResults } = await container.items
        .query({
          query: "SELECT * FROM c WHERE (c.type = 'bootcamp-registration' OR IS_DEFINED(c.bootcampId)) AND c.email = @email",
          parameters: [{ name: '@email', value: email }]
        })
        .fetchAll();
      console.log(`Found ${emailResults.length} registrations by exact email match`);
      registrations = emailResults;
    }
    
    // Query by userId if no results yet
    if (registrations.length === 0 && userId) {
      const { resources: userIdResults } = await container.items
        .query({
          query: "SELECT * FROM c WHERE (c.type = 'bootcamp-registration' OR IS_DEFINED(c.bootcampId)) AND c.userId = @userId",
          parameters: [{ name: '@userId', value: userId }]
        })
        .fetchAll();
      console.log(`Found ${userIdResults.length} registrations by userId`);
      registrations = userIdResults;
    }
    
    // Additional fallback for fuzzy email match
    if (registrations.length === 0 && email) {
      const { resources: fuzzyEmailResults } = await container.items
        .query({
          query: "SELECT * FROM c WHERE (c.type = 'bootcamp-registration' OR IS_DEFINED(c.bootcampId)) AND CONTAINS(LOWER(c.email), @emailPart)",
          parameters: [{ name: '@emailPart', value: email }]
        })
        .fetchAll();
      console.log(`Found ${fuzzyEmailResults.length} registrations by fuzzy email match`);
      registrations = fuzzyEmailResults;
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