import Link from 'next/link';

export const metadata = { title: 'Protected' };

export default async function ProtectedPage() {
  // Auth is currently disabled. This page will be re-guarded once auth is reintroduced.
  const hasSession = false;

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-bold mb-4">Protected</h1>
      {hasSession ? (
        <p>You&apos;re signed in. This page is just for a quick smoke check.</p>
      ) : (
        <p>
          Authentication is currently disabled. When it&apos;s re-enabled, this page will require sign-in.
          For now, you can go to <Link href="/auth/signin" className="underline">Sign in</Link>.
        </p>
      )}
    </div>
  );
}
