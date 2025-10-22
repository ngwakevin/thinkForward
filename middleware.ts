import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export default withAuth(
  function middleware(req: NextRequest) {
    // Optional: custom logic for redirect after login
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // user is authorized if token exists
    },
    pages: {
      signIn: "/login", // redirect here if not authenticated
    },
  }
);

// Define which paths are protected
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/bootcamps/:path*",
    "/profile/:path*",
    "/products/:path*",
    "/roadmaps/:path*",
    "/solutions/:path*",
    "/support/:path*",
  ],
};