import { NextResponse } from 'next/server';

// Simple diagnostic endpoint to check environment variables
export async function GET(request: Request) {
  // Check all environment variables related to authentication
  const envVars = {
    AZURE_AD_CLIENT_ID: process.env.AZURE_AD_CLIENT_ID || 'Not set',
    AZURE_AD_TENANT_ID: process.env.AZURE_AD_TENANT_ID || 'Not set',
    AZURE_AD_CLIENT_SECRET: process.env.AZURE_AD_CLIENT_SECRET ? 'Set (hidden)' : 'Not set',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'Not set',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set (hidden)' : 'Not set',
    NODE_ENV: process.env.NODE_ENV || 'Not set',
    // Include path to show where the app is running from
    APP_PATH: process.cwd(),
  };
  
  return NextResponse.json({
    status: 'ok',
    message: 'Diagnostic endpoint for checking environment variables',
    timestamp: new Date().toISOString(),
    environment: envVars,
  });
}
