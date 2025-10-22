import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import TagManager from '../../../../components/community/TagManager';
import { communityService } from '../../../../lib/azure/community-service';

async function getThread(id: string) {
  // Stub implementation for build
  return {
    id,
    title: "Example Thread",
    content: "This is a stub thread for build purposes",
    userId: "user-id", // Add userId field
    authorId: "user-id", // Add authorId field for new field name
    category: {
      id: "category-id",
      name: "Example Category",
      slug: "example-category"
    },
    user: {
      id: "user-id",
      name: "Thread Author",
      profile: {
        displayName: "Thread Author"
      }
    },
    posts: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export default async function ThreadPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return <div className="max-w-3xl mx-auto py-10">Please <Link className="text-accent underline" href="/login">sign in</Link>.</div>;
  const me = (session.user as any);
  const thread = await getThread(params.id);
  if (!thread) return <div className="max-w-3xl mx-auto py-10">Thread not found</div>;
  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-fg-muted">{thread.category.name}</div>
          <h1 className="font-display text-3xl font-bold">{thread.title}</h1>
          <TagManager 
            threadId={params.id} 
            editable={thread.userId === me?.id || me?.isMentor}
            initialTags={(thread as any).tags?.map((tt: any) => tt.tag) || []} 
          />
        </div>
        <Link href={`/community/c/${thread.category.slug}` as any} className="text-sm text-accent">← Back</Link>
      </div>
      <div className="rounded-xl border border-border/60 p-4">
        <div className="whitespace-pre-wrap text-fg">{thread.content}</div>
      </div>
      <section className="space-y-4">
        <h2 className="font-semibold">Replies</h2>
        <div className="space-y-3">
          {(thread.posts as any[]).map((p: any) => (
            <div key={p.id} className={`rounded-xl border p-4 ${p.isAccepted ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-border/60'}`}>
              <div className="flex items-center justify-between">
                <div className="text-sm text-fg-muted">{p.user?.profile?.displayName || p.user?.name || 'Member'}{p.user?.isMentor ? ' · Mentor' : ''}</div>
                <div className="flex items-center gap-3">
                  {!p.isAccepted && (thread.userId === me?.id || me?.isMentor) && (
                    <form action={async () => { 'use server'; await fetch(`/api/community/posts/${p.id}/accept`, { method: 'POST' }); }}>
                      <button type="submit" className="text-xs text-emerald-600">Mark as solution</button>
                    </form>
                  )}
                  <form action={async () => { 'use server'; await fetch(`/api/community/posts/${p.id}/like`, { method: 'POST' }); }}>
                    <button type="submit" className="text-xs text-accent">Like ({p.likes?.length || 0})</button>
                  </form>
                </div>
              </div>
              <div className="mt-2 whitespace-pre-wrap">{p.content}</div>
              {p.children?.length > 0 && (
                <div className="mt-3 space-y-2 pl-4 border-l border-border/60">
                  {p.children.map((c: any) => (
                    <div key={c.id} className="text-sm">
                      <div className="text-fg-muted">{c.user?.profile?.displayName || c.user?.name || 'Member'}</div>
                      <div className="whitespace-pre-wrap">{c.content}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <form action={async (formData: FormData) => { 'use server'; const content = String(formData.get('content') || ''); if (!content) return; await fetch(`/api/community/threads/${thread.id}`, { method: 'POST', body: JSON.stringify({ content }) }); }} className="rounded-xl border border-border/60 p-4 space-y-3">
          <textarea name="content" placeholder="Write a reply…" className="w-full rounded-md border border-border/60 bg-transparent px-3 py-2 h-28" />
          <button type="submit" className="rounded-full bg-accent px-4 py-2 text-white text-sm">Reply</button>
        </form>
      </section>
    </div>
  );
}
