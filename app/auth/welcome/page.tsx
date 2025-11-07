import Link from "next/link";

export const metadata = {
  title: "Welcome",
  description: "Your account was created successfully. Get started by completing your profile.",
};

export default function WelcomePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Welcome to Cloudegree</h1>
      <p className="mt-3 text-sm text-fg-muted">
        Your account is ready. You can jump into your dashboard or finish setting up your profile.
      </p>
      <div className="mt-8 flex items-center gap-3">
        <Link href="/profile" className="inline-flex items-center rounded-md bg-accent px-4 py-2 text-white shadow hover:opacity-95">
          Complete profile
        </Link>
        <Link href="/dashboard" className="inline-flex items-center rounded-md border px-4 py-2 hover:bg-muted/30">
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}
