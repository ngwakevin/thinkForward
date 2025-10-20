import { NextResponse } from "next/server";
import { verifyJwt } from "@/lib/jwt";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ success: false, message: "Missing token" }, { status: 400 });
    }

    const decoded = verifyJwt(token);
    if (!decoded) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }
    
    console.log("[verify-token] decoded:", decoded);

    return NextResponse.json({ success: true, user: decoded });
  } catch (error) {
    console.error("[verify-token] Invalid token:", error);
    return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
  }
}