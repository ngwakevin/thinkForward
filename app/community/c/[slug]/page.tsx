import Link from 'next/link';
import prisma from '../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return <div className="max-w-3xl mx-auto py-10">Please <Link className="text-accent underline" href="/auth/signin">sign in</Link>.</div>;
  const category = await (prisma as any).category.findUnique({ where: { slug: params.slug } });
  if (!category) return <div className="max-w-3xl mx-auto py-10">Category not found</div>;
  const threads = await (prisma as any).thread.findMany({ where: { categoryId: category.id }, orderBy: { createdAt: 'desc' } });
  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">{category.name}</h1>
          {category.description && <p className="text-fg-muted">{category.description}</p>}
        </div>
        <Link href="/community" className="text-sm text-accent">← Back</Link>
      </div>
      <form action={async (formData: FormData) => {
        'use server';
        const title = String(formData.get('title') || '');
        const content = String(formData.get('content') || '');
        if (!title || !content) return;
        const userId = (session.user as any)?.id as string | undefined;
        if (!userId) return;
        await (prisma as any).thread.create({ data: { categoryId: category.id, userId, title, content } });
      }} className="rounded-xl border border-border/60 p-4 space-y-3">
        <input name="title" placeholder="Start a new thread…" className="w-full rounded-md border border-border/60 bg-transparent px-3 py-2" />
        <textarea name="content" placeholder="Describe your question or topic" className="w-full rounded-md border border-border/60 bg-transparent px-3 py-2 h-28" />
        <button type="submit" className="rounded-full bg-accent px-4 py-2 text-white text-sm">Create Thread</button>
      </form>
      <div className="divide-y divide-border/60 rounded-xl border border-border/60">
        {(threads as any[]).map((t: any) => (
          <Link key={t.id} href={`/community/t/${t.id}` as any} className="block p-4 hover:bg-bg-alt/60">
            <div className="font-medium">{t.title}</div>
            <div className="text-sm text-fg-muted line-clamp-2">{t.content}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
