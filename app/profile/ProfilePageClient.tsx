"use client";

import { useState } from 'react';
import type { Session } from 'next-auth';
import ProfileView from './ProfileView';
import AccountTabs from './AccountTabs';
import Image from 'next/image';

interface ProfilePageClientProps {
  initialUserData: any;
  session: Session;
}

export default function ProfilePageClient({ initialUserData, session }: ProfilePageClientProps) {
  const [mode, setMode] = useState<'view' | 'edit'>('view');

  if (mode === 'edit') {
    // Original edit mode with AccountTabs
    const initial = { ...(initialUserData.profile || {}), ...initialUserData };
    const fullName = [initialUserData?.firstName, initialUserData?.lastName].filter(Boolean).join(' ');
    const displayName = initialUserData.profile?.displayName;
    const hasAvatar = !!initialUserData.profile?.avatarUrl;
    const totalFields = 10;
    const filled = [displayName, fullName, initialUserData.profile?.bio, initialUserData.profile?.headline, initialUserData.profile?.location, initialUserData.profile?.timezone, initialUserData.profile?.skills, initialUserData.profile?.learningGoals, initialUserData.profile?.currentTitle, initialUserData.profile?.currentCompany].filter(Boolean).length;
    const pct = Math.round((filled / totalFields) * 100);
    const fallbackName = session.user?.name || session.user?.email || 'Your Profile';

    return (
      <main className="mx-auto max-w-5xl px-6 py-10 space-y-10">
        {/* Header with toggle */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="relative">
                {hasAvatar ? (
                  <Image
                    src={initialUserData.profile.avatarUrl}
                    alt="User avatar"
                    width={96}
                    height={96}
                    className="h-24 w-24 rounded-full object-cover border border-border bg-bg"
                    unoptimized={initialUserData.profile.avatarUrl?.startsWith('http')}
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-border/40 flex items-center justify-center text-fg-muted text-xl font-semibold">
                    {displayName?.[0]?.toUpperCase() || fullName?.[0]?.toUpperCase() || fallbackName?.[0]?.toUpperCase() || '?'}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex flex-wrap items-center gap-2">
                    {fullName || displayName || fallbackName}
                    {displayName && fullName && displayName !== fullName && (
                      <span className="text-sm text-fg-muted font-normal">(@{displayName.replace(/\s+/g,'').toLowerCase()})</span>
                    )}
                  </h1>
                  <button
                    onClick={() => setMode('view')}
                    className="px-4 py-2 bg-accent text-bg font-semibold rounded-lg hover:bg-accent/90 transition-colors text-sm"
                  >
                    View Profile
                  </button>
                </div>
                {initialUserData.profile?.headline && (
                  <p className="text-sm font-medium text-fg-muted/90">{initialUserData.profile.headline}</p>
                )}
                {initialUserData.profile?.bio && (
                  <p className="text-sm max-w-xl text-fg-muted leading-relaxed">{initialUserData.profile.bio}</p>
                )}
                <div className="flex flex-wrap gap-3 pt-1 text-xs">
                  <StatBadge label="Points" value={initialUserData?.points ?? 0} />
                  <StatBadge label="Streak" value={(initialUserData?.streakDays ?? 0) + 'd'} />
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
                {!initialUserData?.phoneNumber && <span className="px-2 py-0.5 rounded-full bg-warning/10 text-warning border border-warning/30">Add phone</span>}
                {!initialUserData.profile?.linkedinUrl && <span className="px-2 py-0.5 rounded-full bg-border text-fg-muted">+ LinkedIn</span>}
                {!initialUserData.profile?.skills && <span className="px-2 py-0.5 rounded-full bg-border text-fg-muted">+ Skills</span>}
              </div>
            </div>
          </div>
        </section>

        <AccountTabs user={session.user as any} initialData={initial} />
      </main>
    );
  }

  // View mode with new Designlab-inspired design
  return (
    <div className="relative">
      {/* Edit button floating at top */}
      <div className="fixed top-20 right-6 z-50">
        <button
          onClick={() => setMode('edit')}
          className="px-6 py-3 bg-accent text-bg font-bold rounded-lg hover:bg-accent/90 transition-colors uppercase tracking-wide text-sm shadow-lg shadow-accent/30"
        >
          Edit Profile ✏️
        </button>
      </div>
      <ProfileView initialUserData={initialUserData} session={session} />
    </div>
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
