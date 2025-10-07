import { NextResponse } from 'next/server';

export async function GET() {
  // Basic health check that confirms the API is running
  return NextResponse.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    uptime: process.uptime(),
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'
  });
}
