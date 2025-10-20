import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ success: false, message: "Missing token" }, { status: 400 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    console.log("[verify-token] decoded:", decoded);

    return NextResponse.json({ success: true, user: decoded });
  } catch (error) {
    console.error("[verify-token] Invalid token:", error);
    return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
  }
}