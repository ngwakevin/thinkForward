import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import Link from 'next/link';
import Image from 'next/image';
import AccountTabs from './AccountTabs';
import { cosmosService } from '../../lib/azure/cosmos-service';

// Ensure this page is always rendered dynamically so freshly saved profile data shows immediately
export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16 space-y-6">
        <h1 className="text-2xl font-semibold">Account Profile</h1>
        <p className="text-fg-muted">You need to sign in to view your profile.</p>
        <Link href="/auth/signin" className="inline-flex rounded-md bg-accent px-4 py-2 text-white hover:bg-accent/90">Sign in</Link>
      </main>
    );
  }

  // Direct DB read to avoid extra network hop
  let data: any = null;
  try {
    const sess: any = session.user;
    let user: any = null;
    
    // Highest priority: internal user id (added to session in auth callbacks)
    if (sess?.id) {
      user = await cosmosService.getUserById(sess.id);
    }
    
    // Next: email
    if (!user && session.user.email) {
      user = await cosmosService.getUserByEmail(session.user.email.toLowerCase());
    }
    
    // Fallback: Azure objectId via session.oid
    if (!user && (sess as any)?.oid) {
      // Need to implement a method to search by objectId if needed
      // For now we'll skip this since the email check should work for most cases
    }
    
    if (user) data = user;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    // Non-fatal; empty state will render
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 space-y-10">
      <Header initial={data} />
      {/* Using the new AccountTabs component for a more comprehensive profile management experience */}
      <AccountTabs 
        user={session.user}
        initialData={data ? { ...(data.profile || {}), ...data } : {}}
      />
    </main>
  );
}

function Header({ initial }: { initial: any }) {
  const fullName = [initial?.firstName, initial?.lastName].filter(Boolean).join(' ');
  const displayName = initial?.displayName || initial?.profile?.displayName;
  const hasAvatar = !!initial?.avatarUrl;
  const totalFields = 10;
  const filled = [displayName, fullName, initial?.bio, initial?.headline, initial?.location, initial?.timezone, initial?.skills, initial?.learningGoals, initial?.currentTitle, initial?.currentCompany].filter(Boolean).length;
  const pct = Math.round((filled / totalFields) * 100);
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-start gap-5">
          <div className="relative">
            {hasAvatar ? (
              <Image
                src={initial.avatarUrl}
                alt="User avatar"
                width={96}
                height={96}
                className="h-24 w-24 rounded-full object-cover border border-border bg-bg"
                unoptimized={initial.avatarUrl?.startsWith('http')}
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-border/40 flex items-center justify-center text-fg-muted text-xl font-semibold">
                {displayName?.[0]?.toUpperCase() || fullName?.[0]?.toUpperCase() || '?' }
              </div>
            )}
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex flex-wrap items-center gap-2">
              {fullName || displayName || 'Your Profile'}
              {displayName && fullName && displayName !== fullName && (
                <span className="text-sm text-fg-muted font-normal">(@{displayName.replace(/\s+/g,'').toLowerCase()})</span>
              )}
            </h1>
            {initial?.headline && (
              <p className="text-sm font-medium text-fg-muted/90">{initial.headline}</p>
            )}
            {initial?.bio && (
              <p className="text-sm max-w-xl text-fg-muted leading-relaxed">{initial.bio}</p>
            )}
            <div className="flex flex-wrap gap-3 pt-1 text-xs">
              <StatBadge label="Points" value={initial?.points ?? 0} />
              <StatBadge label="Streak" value={(initial?.streakDays ?? 0) + 'd'} />
              <StatBadge label="Badges" value={0} />
              <StatBadge label="Courses" value={0} />
            </div>
          </div>
        </div>
        <div className="min-w-[200px] space-y-3">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="uppercase tracking-wide text-fg-muted">Completion</span>
            <span className="text-fg-muted/80">{pct}%</span>
          </div>
            <div className="h-2 w-full rounded-full bg-border overflow-hidden">
              <div className="h-full bg-accent transition-all" style={{ width: pct + '%' }} />
            </div>
            <div className="flex flex-wrap gap-2 text-[11px] text-fg-muted/70">
              {!initial?.phoneNumber && <span className="px-2 py-0.5 rounded-full bg-warning/10 text-warning border border-warning/30">Add phone</span>}
              {!initial?.linkedinUrl && <span className="px-2 py-0.5 rounded-full bg-border text-fg-muted">+ LinkedIn</span>}
              {!initial?.skills && <span className="px-2 py-0.5 rounded-full bg-border text-fg-muted">+ Skills</span>}
            </div>
        </div>
      </div>
    </section>
  );
}

function StatBadge({ label, value }: { label: string; value: any }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-bg-alt px-2 py-1 text-[11px] font-medium text-fg-muted">
      <span className="text-fg/90 font-semibold">{value}</span>
      <span className="uppercase tracking-wide text-fg-muted/70">{label}</span>
    </span>
  );
}
