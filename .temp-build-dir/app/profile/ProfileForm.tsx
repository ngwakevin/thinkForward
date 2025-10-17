"use client";
import { useState, useEffect, useMemo } from 'react';
import { CopyButton } from '../../components/ui/CopyButton';
import { useSession } from 'next-auth/react';

export default function ProfileForm({ initial }: { initial: any }) {
  // Profile fields
  const [displayName, setDisplayName] = useState<string>(initial?.displayName || '');
  const [bio, setBio] = useState<string>(initial?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState<string>(initial?.avatarUrl || '');
  const [headline, setHeadline] = useState<string>(initial?.headline || '');
  // User contact & personal
  const [phoneNumber, setPhoneNumber] = useState<string>(initial?.phoneNumber || '');
  const [firstName, setFirstName] = useState<string>(initial?.firstName || '');
  const [lastName, setLastName] = useState<string>(initial?.lastName || '');
  // Custom attributes
  const [loyaltyNumber, setLoyaltyNumber] = useState<string>(initial?.loyaltyNumber || '');
  const [preferredLanguage, setPreferredLanguage] = useState<string>(initial?.preferredLanguage || '');
  const [customerTier, setCustomerTier] = useState<string>(initial?.customerTier || '');
  // Contact & basic
  const [location, setLocation] = useState<string>(initial?.location || '');
  const [timezone, setTimezone] = useState<string>(initial?.timezone || '');
  const [githubUrl, setGithubUrl] = useState<string>(initial?.githubUrl || '');
  const [linkedinUrl, setLinkedinUrl] = useState<string>(initial?.linkedinUrl || '');
  const [portfolioUrl, setPortfolioUrl] = useState<string>(initial?.portfolioUrl || '');
  // Learning / interests
  const [learningGoals, setLearningGoals] = useState<string>(initial?.learningGoals || '');
  const [skillsRaw, setSkillsRaw] = useState<string>(() => {
    if (Array.isArray(initial?.skills)) return initial.skills.join(', ');
    if (typeof initial?.skills === 'string') {
      try { const arr = JSON.parse(initial.skills); if (Array.isArray(arr)) return arr.join(', '); } catch {}
    }
    return '';
  });
  // Professional background
  const [currentTitle, setCurrentTitle] = useState<string>(initial?.currentTitle || '');
  const [currentCompany, setCurrentCompany] = useState<string>(initial?.currentCompany || '');
  const [educationRaw, setEducationRaw] = useState<string>(() => initial?.education ? safeParseList(initial.education).join('\n') : '');
  const [experienceRaw, setExperienceRaw] = useState<string>(() => initial?.experience ? safeParseList(initial.experience).join('\n') : '');
  // Preferences & privacy
  const [showProfilePublic, setShowProfilePublic] = useState<boolean>(!!initial?.showProfilePublic);
  // Per-section messages / pending flags
  const [sectionStatus, setSectionStatus] = useState<Record<string, { pending: boolean; msg: string }>>({});
  const { update } = useSession();

  // Auto-suggest display name if empty and names provided
  useEffect(() => {
    if (!displayName && (firstName || lastName)) {
      const composed = [firstName, lastName].filter(Boolean).join(' ');
      setDisplayName(composed);
    }
  }, [firstName, lastName]);

  // Completion metric (same keys as header; defensive duplication for client-only updates)
  const completion = useMemo(() => {
    const total = 6;
    const done = [displayName, firstName, lastName, phoneNumber, loyaltyNumber, preferredLanguage].filter(Boolean).length;
    return { total, done, pct: Math.round((done / total) * 100) };
  }, [displayName, firstName, lastName, phoneNumber, loyaltyNumber, preferredLanguage]);

  // Keep an original snapshot to evaluate dirtiness per section (updated after each successful save)
  const [original, setOriginal] = useState<any>(() => ({
    displayName, bio, avatarUrl, headline, phoneNumber, firstName, lastName, loyaltyNumber, preferredLanguage, customerTier,
    location, timezone, githubUrl, linkedinUrl, portfolioUrl, learningGoals, skills: skillsRaw, currentTitle, currentCompany,
    educationRaw, experienceRaw, showProfilePublic
  }));

  const markStatus = (key: string, next: Partial<{ pending: boolean; msg: string }>) => {
    setSectionStatus(s => ({ ...s, [key]: { pending: s[key]?.pending ?? false, msg: s[key]?.msg ?? '', ...next } }));
  };

  // Centralized current value map (avoid eval, safer for minification/strict runtime)
  const currentValues = () => ({
    displayName,
    bio,
    avatarUrl,
    headline,
    phoneNumber,
    firstName,
    lastName,
    loyaltyNumber,
    preferredLanguage,
    customerTier,
    location,
    timezone,
    githubUrl,
    linkedinUrl,
    portfolioUrl,
    learningGoals,
    skills: skillsRaw,
    currentTitle,
    currentCompany,
    education: educationRaw,
    experience: experienceRaw,
    showProfilePublic,
  });

  const sectionDirty = (fields: string[]) => {
    const curr = currentValues();
    return fields.some(f => {
      const key = f === 'education' ? 'educationRaw' : f === 'experience' ? 'experienceRaw' : f;
      return original[key] !== (curr as any)[f];
    });
  };

  const saveSection = async (key: string, fields: string[]) => {
    if (!sectionDirty(fields)) return;
    markStatus(key, { pending: true, msg: '' });
    const body: Record<string, any> = {};
    for (const f of fields) {
      switch (f) {
        case 'displayName': body.displayName = displayName || undefined; break;
        case 'bio': body.bio = bio || undefined; break;
        case 'avatarUrl': body.avatarUrl = avatarUrl || undefined; break;
        case 'headline': body.headline = headline || undefined; break;
        case 'phoneNumber': body.phoneNumber = phoneNumber || undefined; break;
        case 'firstName': body.firstName = firstName || undefined; break;
        case 'lastName': body.lastName = lastName || undefined; break;
        case 'loyaltyNumber': body.loyaltyNumber = loyaltyNumber || undefined; break;
        case 'preferredLanguage': body.preferredLanguage = preferredLanguage || undefined; break;
        case 'customerTier': body.customerTier = customerTier || undefined; break;
        case 'location': body.location = location || undefined; break;
        case 'timezone': body.timezone = timezone || undefined; break;
        case 'githubUrl': body.githubUrl = githubUrl || undefined; break;
        case 'linkedinUrl': body.linkedinUrl = linkedinUrl || undefined; break;
        case 'portfolioUrl': body.portfolioUrl = portfolioUrl || undefined; break;
        case 'learningGoals': body.learningGoals = learningGoals || undefined; break;
        case 'skills': body.skills = serializeList(skillsRaw); break;
        case 'currentTitle': body.currentTitle = currentTitle || undefined; break;
        case 'currentCompany': body.currentCompany = currentCompany || undefined; break;
        case 'education': body.education = serializeMultiline(educationRaw); break;
        case 'experience': body.experience = serializeMultiline(experienceRaw); break;
        case 'showProfilePublic': body.showProfilePublic = showProfilePublic; break;
      }
    }
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
      });
      if (res.ok) {
        // Optional: re-fetch canonical profile state to avoid drift (e.g., server transforms, defaults)
        let fresh: any = null;
        try {
          const fres = await fetch('/api/profile', { cache: 'no-store' });
          if (fres.ok) fresh = await fres.json();
        } catch {}
        // update original snapshot for these fields
        setOriginal((orig: any) => {
          const updated = { ...orig };
          const curr = currentValues();
          for (const f of fields) {
            if (f === 'skills') updated.skills = curr.skills;
            else if (f === 'education') updated.educationRaw = curr.education;
            else if (f === 'experience') updated.experienceRaw = curr.experience;
            else updated[f] = (curr as any)[f];
          }
          if (fresh?.profile) {
            // Sync any fields we didn't just save but server may have changed
            const p = fresh.profile;
            const syncMap: Record<string, any> = {
              displayName: p.displayName,
              bio: p.bio,
              avatarUrl: p.avatarUrl,
              headline: p.headline,
              location: p.location,
              timezone: p.timezone,
              githubUrl: p.githubUrl,
              linkedinUrl: p.linkedinUrl,
              portfolioUrl: p.portfolioUrl,
              learningGoals: p.learningGoals,
              skills: Array.isArray(p.skills) ? p.skills.join(', ') : p.skills,
              currentTitle: p.currentTitle,
              currentCompany: p.currentCompany,
              educationRaw: p.education ? safeParseList(p.education).join('\n') : updated.educationRaw,
              experienceRaw: p.experience ? safeParseList(p.experience).join('\n') : updated.experienceRaw,
              showProfilePublic: p.showProfilePublic,
            };
            Object.assign(updated, Object.fromEntries(Object.entries(syncMap).filter(([,v]) => v !== undefined)));
          }
          return updated;
        });
        markStatus(key, { pending: false, msg: 'Saved' });
        try { await update(); } catch {}
      } else {
        let errTxt = 'Failed';
        try { const j = await res.json(); if (j?.error) errTxt = j.error; } catch {}
        markStatus(key, { pending: false, msg: errTxt });
      }
    } catch {
      markStatus(key, { pending: false, msg: 'Network error' });
    }
  };

  return (
    <div className="space-y-8">
      {/* Core Identity */}
      <CollapsibleCard id="core" title="Core Identity" description="Immutable identifiers and sign-in metadata." defaultOpen>
        <div className="grid gap-6 md:grid-cols-3">
          <ReadOnlyWithCopy label="Object ID" value={initial?.objectId} />
          <ReadOnlyWithCopy label="Account ID" value={(initial?.providerAccountId || initial?.id)} fallback="—" />
          <ReadOnlyField label="Sign-in Identity" value={initial?.signInIdentity || initial?.email || '—'} />
        </div>
        <div className="grid gap-6 md:grid-cols-5 pt-2">
          <ReadOnlyField label="Created" value={initial?.createdAt ? formatDate(initial.createdAt) : '—'} />
          <ReadOnlyField label="Last Sign-in" value={initial?.lastSignInAt ? formatDate(initial.lastSignInAt) : '—'} />
          <ReadOnlyField label="Email Verified" value={initial?.emailVerifiedAt ? formatDate(initial.emailVerifiedAt) : 'No'} />
          <ReadOnlyField label="Phone Verified" value={initial?.phoneVerifiedAt ? formatDate(initial.phoneVerifiedAt) : 'No'} />
          <ReadOnlyField label="Provider" value={(initial?.provider || '—').toUpperCase()} />
        </div>
      </CollapsibleCard>

      {/* Summary */}
  <CollapsibleCard id="summary" title="Profile Summary" description="Public-facing overview." dirty={sectionDirty(['firstName','lastName','displayName','headline','location','timezone','avatarUrl','githubUrl','linkedinUrl','portfolioUrl','preferredLanguage','customerTier','bio'])} onSave={() => saveSection('summary',['firstName','lastName','displayName','headline','location','timezone','avatarUrl','githubUrl','linkedinUrl','portfolioUrl','preferredLanguage','customerTier','bio'])} status={sectionStatus['summary']}>
        <div className="grid gap-6 md:grid-cols-3">
          <Field label="First Name" value={firstName} onChange={setFirstName} placeholder="Ada" requiredIndicator />
          <Field label="Last Name" value={lastName} onChange={setLastName} placeholder="Lovelace" requiredIndicator />
          <Field label="Display Name" value={displayName} onChange={setDisplayName} placeholder="Preferred name" hint={(!initial?.displayName && (firstName||lastName)) ? 'Auto-suggested' : undefined} />
        </div>
        <div className="grid gap-6 md:grid-cols-3 pt-4">
          <Field label="Headline" value={headline} onChange={setHeadline} placeholder="Software Developer | Lifelong Learner" />
          <Field label="Location" value={location} onChange={setLocation} placeholder="Lagos, Nigeria" />
          <Field label="Timezone" value={timezone} onChange={setTimezone} placeholder="Africa/Lagos" />
        </div>
        <div className="grid gap-6 md:grid-cols-3 pt-4">
          <Field label="Avatar URL" value={avatarUrl} onChange={setAvatarUrl} placeholder="https://..." />
          <Field label="GitHub URL" value={githubUrl} onChange={setGithubUrl} placeholder="https://github.com/username" />
          <Field label="LinkedIn URL" value={linkedinUrl} onChange={setLinkedinUrl} placeholder="https://linkedin.com/in/..." />
        </div>
        <div className="grid gap-6 md:grid-cols-3 pt-4">
          <Field label="Portfolio URL" value={portfolioUrl} onChange={setPortfolioUrl} placeholder="https://portfolio.example" />
          <Field label="Preferred Language" value={preferredLanguage} onChange={setPreferredLanguage} placeholder="en" />
          <Field label="Customer Tier" value={customerTier} onChange={setCustomerTier} placeholder="gold" />
        </div>
        <div className="pt-4 space-y-2">
          <label className="block text-sm font-medium">Bio</label>
          <textarea value={bio} onChange={e=>setBio(e.target.value)} rows={4} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40" placeholder="Short introduction" />
        </div>
      </CollapsibleCard>

      {/* Learning Goals & Interests */}
      <CollapsibleCard id="learning" title="Learning Goals & Interests" description="Describe what you're working toward and tag your skills." dirty={sectionDirty(['learningGoals','skills'])} onSave={() => saveSection('learning',['learningGoals','skills'])} status={sectionStatus['learning']}>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Learning Goals</label>
          <textarea value={learningGoals} onChange={e=>setLearningGoals(e.target.value)} rows={4} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40" placeholder="e.g. Master full-stack development, improve system design" />
        </div>
        <div className="pt-4 space-y-2">
            <label className="block text-sm font-medium">Skills / Interests</label>
            <input value={skillsRaw} onChange={e=>setSkillsRaw(e.target.value)} placeholder="Comma-separated: JavaScript, Leadership, Data Analytics" className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40" />
            <p className="text-[11px] text-fg-muted/70">Stored as tags; use commas to separate. Example: React, Node.js, Mentoring</p>
        </div>
      </CollapsibleCard>

      {/* Progress & Achievements */}
      <CollapsibleCard id="progress" title="Progress & Achievements" description="Overview of your learning journey." defaultOpen>
        <div className="grid gap-6 md:grid-cols-4">
          <ReadOnlyField label="Points" value={(initial?.points ?? 0).toString()} />
          <ReadOnlyField label="Streak Days" value={(initial?.streakDays ?? 0).toString()} />
          <ReadOnlyField label="Courses Completed" value={'0'} />
          <ReadOnlyField label="Badges" value={'0'} />
        </div>
        <div className="pt-4 text-xs text-fg-muted">Detailed course and badge tracking coming soon.</div>
      </CollapsibleCard>

      {/* Professional Background */}
      <CollapsibleCard id="background" title="Professional Background" description="Share your current role and past experience." dirty={sectionDirty(['currentTitle','currentCompany','education','experience'])} onSave={() => saveSection('background',['currentTitle','currentCompany','education','experience'])} status={sectionStatus['background']}>
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Current Title" value={currentTitle} onChange={setCurrentTitle} placeholder="Full-Stack Developer" />
          <Field label="Current Company" value={currentCompany} onChange={setCurrentCompany} placeholder="Acme Corp" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 pt-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Education (one per line)</label>
            <textarea value={educationRaw} onChange={e=>setEducationRaw(e.target.value)} rows={4} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40" placeholder="BSc Computer Science - XYZ University\nCloud Certification - Provider" />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Experience (one role per line)</label>
            <textarea value={experienceRaw} onChange={e=>setExperienceRaw(e.target.value)} rows={4} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40" placeholder="Software Engineer - ABC (2022–Present)\nIntern - DEF (2021)" />
          </div>
        </div>
      </CollapsibleCard>

      {/* Contact & Security */}
      <CollapsibleCard id="contact" title="Contact & Security" description="Ways we can reach you and secure access." dirty={sectionDirty(['phoneNumber','loyaltyNumber'])} onSave={() => saveSection('contact',['phoneNumber','loyaltyNumber'])} status={sectionStatus['contact']}>
        <div className="grid gap-6 md:grid-cols-3">
          <ReadOnlyField label="Email" value={initial?.email || '—'} />
          <Field label="Phone Number" value={phoneNumber} onChange={setPhoneNumber} placeholder="+1 555 123 4567" hint={!phoneNumber ? 'Helps with account recovery' : undefined} />
          <Field label="Loyalty #" value={loyaltyNumber} onChange={setLoyaltyNumber} placeholder="ABC123" />
        </div>
      </CollapsibleCard>

      {/* Privacy & Preferences */}
      <CollapsibleCard id="privacy" title="Privacy & Preferences" description="Control how your profile appears to others." dirty={sectionDirty(['showProfilePublic'])} onSave={() => saveSection('privacy',['showProfilePublic'])} status={sectionStatus['privacy']}>
        <div className="flex items-center gap-3 py-2">
          <input id="publicProfile" type="checkbox" checked={showProfilePublic} onChange={e=>setShowProfilePublic(e.target.checked)} className="h-4 w-4 rounded border-border text-accent focus:ring-accent" />
          <label htmlFor="publicProfile" className="text-sm font-medium">Make my profile discoverable</label>
        </div>
        <p className="text-[11px] text-fg-muted/70">Public discoverability will enable others to view a limited professional summary (no private contact data).</p>
      </CollapsibleCard>
    </div>
  );
}

function CollapsibleCard({ id, title, description, children, dirty, onSave, status, defaultOpen }: {
  id: string; title: string; description?: string; children: React.ReactNode; dirty?: boolean; onSave?: () => void; status?: { pending: boolean; msg: string }; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState<boolean>(!!defaultOpen);
  return (
    <section
      data-open={open ? 'true' : 'false'}
      className="group relative rounded-xl p-[1px] bg-gradient-to-br from-accent/25 via-border/40 to-transparent hover:from-accent/40 hover:via-border/60 transition-colors duration-300"
    >
      <div className="relative rounded-[11px] bg-gradient-to-b from-bg/95 to-bg-alt/60 backdrop-blur-sm border border-border/60 shadow-sm group-hover:shadow-md transition-shadow">
        <header
          className="flex items-start justify-between gap-4 p-5 cursor-pointer select-none"
          onClick={() => setOpen(o => !o)}
        >
          <div className="space-y-1 pr-2">
            <h2 className="text-[11px] font-semibold tracking-wider uppercase text-fg-muted flex items-center gap-2">
              <span
                className={`inline-flex h-5 w-5 items-center justify-center rounded-md bg-border/60 text-[10px] font-bold text-fg-muted/80 transition-transform duration-300 ${open ? 'rotate-90' : ''}`}
              >
                ▶
              </span>
              <span className="relative">
                {title}
                {dirty && (
                  <span
                    className="absolute -right-2 -top-2 h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_0_2px_rgba(0,0,0,0.25)] animate-pulse"
                    aria-label="Unsaved changes"
                  />
                )}
              </span>
            </h2>
            {description && (
              <p className="text-[11px] text-fg-muted/70 leading-relaxed max-w-2xl">
                {description}
              </p>
            )}
          </div>
          {onSave && (
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                disabled={!dirty || status?.pending}
                onClick={e => { e.stopPropagation(); onSave(); }}
                className="relative inline-flex items-center gap-2 rounded-md bg-accent/90 px-4 py-2 text-[11px] font-semibold tracking-wide text-white shadow-sm shadow-accent/30 ring-1 ring-accent/50 hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {status?.pending ? (
                  <span className="inline-flex items-center gap-2">
                    <Spinner size={14} /> Saving…
                  </span>
                ) : dirty ? (
                  <span className="inline-flex items-center gap-1"><CheckIcon /> Save</span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-white/80"><CheckIcon /> Saved</span>
                )}
              </button>
              {status?.msg && (
                <span
                  className={`text-[10px] font-medium tracking-wide ${status.msg === 'Saved' ? 'text-accent' : status.msg === 'Network error' ? 'text-warning' : 'text-fg-muted/70'}`}
                >
                  {status.msg}
                </span>
              )}
            </div>
          )}
        </header>
        <div
          className={`grid transition-[grid-template-rows] duration-400 ease-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
        >
          <div className="overflow-hidden">
            <div className="p-5 pt-0 space-y-5 animate-in fade-in slide-in-from-top-1 duration-300">
              {children}
            </div>
          </div>
        </div>
        {/* bottom subtle divider glow when open */}
        <div className={`pointer-events-none absolute inset-x-4 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} />
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8.5 6.5 12 13 4" />
    </svg>
  );
}

function Spinner({ size = 16 }: { size?: number }) {
  return (
    <svg
      className="animate-spin text-white/80"
      style={{ width: size, height: size }}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" />
      <path className="opacity-90" d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  );
}

function Field({ label, value, onChange, placeholder, requiredIndicator, hint }: { label: string; value: string; onChange: (v: string)=>void; placeholder?: string; requiredIndicator?: boolean; hint?: string }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium flex items-center gap-1">
        {label}
        {requiredIndicator && <span className="text-xs font-semibold text-warning">*</span>}
      </label>
      <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40" />
      {hint && <p className="text-[11px] text-fg-muted/70 leading-tight">{hint}</p>}
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>
      <div className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg-muted/80 truncate">{value || '—'}</div>
    </div>
  );
}

function ReadOnlyWithCopy({ label, value, fallback }: { label: string; value?: string; fallback?: string }) {
  const val = value || '';
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium flex items-center justify-between gap-2">
        <span>{label}</span>
        {val && <CopyButton value={val} label="Copy" />}
      </label>
      <div className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg-muted/80 truncate">{val || fallback || '—'}</div>
    </div>
  );
}

function safeParseList(raw: string): string[] {
  try { const arr = JSON.parse(raw); if (Array.isArray(arr)) return arr.map(x=>String(x)); } catch {}
  return [];
}

function serializeList(raw: string): string | undefined {
  const list = raw.split(',').map(s=>s.trim()).filter(Boolean);
  if (!list.length) return undefined;
  return JSON.stringify(list);
}

function serializeMultiline(raw: string): string | undefined {
  const lines = raw.split(/\r?\n/).map(l=>l.trim()).filter(Boolean);
  if (!lines.length) return undefined;
  return JSON.stringify(lines);
}

function formatDate(d: string | Date) {
  try {
    const date = typeof d === 'string' ? new Date(d) : d;
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return '—';
  }
}
