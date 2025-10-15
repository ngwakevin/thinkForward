import { getServerSession } from 'next-auth';
import { NextResponse, NextRequest } from 'next/server';
import { authOptions } from '../../../../lib/auth';
import cosmosService from '../../../../lib/azure/cosmos-service';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the user ID from the session
    const sess: any = session.user;
    let userId = sess?.id;
    
    if (!userId && session.user.email) {
      // If the ID is not in the session, try to get the user by email
      const user = await cosmosService.getUserByEmail(session.user.email.toLowerCase());
      if (user) {
        userId = user.id;
      }
    }

    if (!userId) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Query bootcamp registrations using user ID
    // Using the container directly as we haven't found an existing function for this
    const { resources: registrations } = await cosmosService.container.items
      .query({
        query: "SELECT * FROM c WHERE c.type = 'bootcamp-registration' AND c.userId = @userId",
        parameters: [{ name: '@userId', value: userId }]
      })
      .fetchAll();

    return NextResponse.json({ registrations }, { status: 200 });
  } catch (error) {
    console.error('Error fetching bootcamp registrations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bootcamp registrations' },
      { status: 500 }
    );
  }
}