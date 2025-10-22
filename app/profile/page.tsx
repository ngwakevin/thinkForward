import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    // Redirect if no session
    return (
      <meta httpEquiv="refresh" content="0; url=/login" />
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome, {session.user?.name}</h1>
      <p>Email: {session.user?.email}</p>
    </div>
  );
}