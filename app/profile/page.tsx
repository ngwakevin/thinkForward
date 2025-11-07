import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { cosmosService } from '@/lib/azure/cosmos-service';
import ProfilePageClient from './ProfilePageClient';

// Ensure fresh data after updates
export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/login');
  }

  // Fetch initial user data from Cosmos DB (best effort)
  let userData: any = {};
  try {
    const sess: any = session.user;
    let user: any = null;
    if (sess?.id) {
      user = await cosmosService.getUserById(sess.id);
    }
    if (!user && session.user.email) {
      user = await cosmosService.getUserByEmail(session.user.email.toLowerCase());
    }
    if (user) {
      userData = { 
        ...user,
        profile: user.profile || {},
      };
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    // Non-fatal; page will render with session-only info
  }

  return <ProfilePageClient initialUserData={userData} session={session} />;
}
