import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import Link from 'next/link';
import Image from 'next/image';
import { communityService } from '../../../../lib/azure/community-service';

export default async function CommunityProfilePage({ params }: { params: { userId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <div className="max-w-3xl mx-auto py-10">
        <h1 className="font-display text-3xl font-bold">Community Profile</h1>
        <p className="mt-2 text-fg-muted">Please sign in to access this page.</p>
  <Link className="mt-4 inline-block text-accent underline" href="/login">Sign in</Link>
      </div>
    );
  }

  // Fetch user details with profile - stub implementation for build
  const user = { 
    id: params.userId,
    name: "User Display Name",
    email: "user@example.com",
    isMentor: false,
    profile: {
      displayName: "User Display Name",
      bio: "This is a placeholder bio",
      avatarUrl: null,
      skills: JSON.stringify(["JavaScript", "TypeScript", "React"])
    }
  };

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto py-10">
        <h1 className="font-display text-3xl font-bold">User not found</h1>
        <p className="mt-2 text-fg-muted">This user does not exist or has been removed.</p>
        <Link className="mt-4 inline-block text-accent underline" href="/community">Return to Community</Link>
      </div>
    );
  }

  // Get user's threads - stub implementation for build
  const threads: any[] = [];

  // Get user's latest posts - stub implementation for build
  const posts: any[] = [];

  // Get count of accepted solutions - stub implementation for build
  const acceptedPostsCount = 0;

  const displayName = user.profile?.displayName || user.name || 'Community Member';
  
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-start">
        <div>
          <Link href="/community" className="text-sm text-accent mb-4 inline-block">
            ← Back to Community
          </Link>
          <h1 className="font-display text-3xl font-bold">{displayName}</h1>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User profile card */}
        <div className="md:col-span-1">
          <div className="rounded-xl border border-border/60 p-6 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-bg-alt flex items-center justify-center">
                {user.profile?.avatarUrl ? (
                  <Image
                    src={user.profile.avatarUrl}
                    alt={displayName}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="text-2xl font-semibold text-fg-muted">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <div className="font-semibold">{displayName}</div>
                <div className="text-sm text-fg-muted">
                  {user.isMentor && <span className="text-emerald-500 font-medium">Mentor</span>}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border/60">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-xl font-semibold">{threads.length}</div>
                  <div className="text-xs text-fg-muted">Threads</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-semibold">{acceptedPostsCount}</div>
                  <div className="text-xs text-fg-muted">Solutions</div>
                </div>
              </div>
            </div>

            {user.profile?.bio && (
              <div className="pt-4 border-t border-border/60">
                <div className="text-sm text-fg">
                  {user.profile.bio}
                </div>
              </div>
            )}
            
            {user.profile?.skills && (
              <div className="pt-4 border-t border-border/60">
                <h3 className="text-sm font-semibold mb-2">Skills</h3>
                <div className="flex flex-wrap gap-1">
                  {JSON.parse(user.profile.skills).map((skill: string, index: number) => (
                    <span 
                      key={index}
                      className="px-2 py-1 text-xs rounded-full bg-bg-alt text-fg-muted"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Activity column */}
        <div className="md:col-span-2 space-y-6">
          {/* Threads section */}
          <section>
            <h2 className="font-semibold mb-3">Recent Threads</h2>
            {threads.length > 0 ? (
              <div className="divide-y divide-border/60 rounded-xl border border-border/60">
                {threads.map((thread: any) => (
                  <Link 
                    key={thread.id} 
                    href={`/community/t/${thread.id}`}
                    className="block p-4 hover:bg-bg-alt/60"
                  >
                    <div className="flex justify-between">
                      <div className="text-sm text-fg-muted">{thread.category.name}</div>
                      <div className="text-xs text-fg-muted">
                        {new Date(thread.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="font-medium">{thread.title}</div>
                    <div className="mt-1 text-xs text-fg-muted">
                      {thread._count.posts} {thread._count.posts === 1 ? 'reply' : 'replies'}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-border/60 p-4 text-center">
                <p className="text-fg-muted">No threads created yet.</p>
              </div>
            )}
          </section>

          {/* Posts section */}
          <section>
            <h2 className="font-semibold mb-3">Recent Replies</h2>
            {posts.length > 0 ? (
              <div className="divide-y divide-border/60 rounded-xl border border-border/60">
                {posts.map((post: any) => (
                  <div key={post.id} className="p-4">
                    <div className="flex justify-between">
                      <div className="text-sm text-fg-muted">
                        In <Link href={`/community/t/${post.thread.id}`} className="text-accent hover:underline">
                          {post.thread.title}
                        </Link>
                      </div>
                      <div className="text-xs text-fg-muted">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="mt-2 text-sm whitespace-pre-line line-clamp-2">{post.content}</div>
                    <div className="mt-2 text-xs text-fg-muted">
                      {post.isAccepted && (
                        <span className="text-emerald-500 font-medium">✓ Solution</span>
                      )}
                      {post.likes.length > 0 && (
                        <span className="ml-2">❤️ {post.likes.length}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-border/60 p-4 text-center">
                <p className="text-fg-muted">No replies yet.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}