import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";

export default async function AutoLoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    // Redirect on server-side for zero flicker
    redirect("/dashboard");
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-lg">Redirecting to sign-in...</p>
    </div>
  );
}
