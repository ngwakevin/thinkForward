import { NextResponse } from 'next/server';

// Simple diagnostic endpoint to check environment variables
export async function GET(request: Request) {
  // Attempt to read environment variables directly when this endpoint is accessed
  const envVars = {
    AZURE_AD_CLIENT_ID: process.env.AZURE_AD_CLIENT_ID || 'Not set',
    AZURE_AD_TENANT_ID: process.env.AZURE_AD_TENANT_ID || 'Not set',
    AZURE_AD_CLIENT_SECRET: process.env.AZURE_AD_CLIENT_SECRET ? 'Set (hidden)' : 'Not set',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'Not set',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set (hidden)' : 'Not set',
    NODE_ENV: process.env.NODE_ENV || 'Not set',
    // Include path to show where the app is running from
    APP_PATH: process.cwd(),
    
    // Add all available process.env keys (without values for security)
    ENV_KEYS: Object.keys(process.env).sort(),
    
    // Runtime information
    RUNTIME_INFO: {
      timestamp: new Date().toISOString(),
      platform: process.platform,
      nodeVersion: process.version,
      pid: process.pid,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
    }
  };
  
  // Log the environment variables to help debug
  console.log('[diag] Environment variables check:', {
    AZURE_AD_CLIENT_ID: process.env.AZURE_AD_CLIENT_ID ? `Set (${process.env.AZURE_AD_CLIENT_ID.substring(0, 5)}...)` : 'Not set',
    AZURE_AD_CLIENT_SECRET: process.env.AZURE_AD_CLIENT_SECRET ? 'Set (hidden)' : 'Not set',
    AZURE_AD_TENANT_ID: process.env.AZURE_AD_TENANT_ID ? `Set (${process.env.AZURE_AD_TENANT_ID.substring(0, 5)}...)` : 'Not set',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'Not set',
    NODE_ENV: process.env.NODE_ENV || 'Not set',
  });
  
  return NextResponse.json({
    status: 'ok',
    message: 'Diagnostic endpoint for checking environment variables',
    timestamp: new Date().toISOString(),
    environment: envVars,
  });
}
