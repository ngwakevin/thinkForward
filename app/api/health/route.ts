import { NextRequest, NextResponse } from 'next/server';

// Mark route as dynamic since it uses request headers
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Enhanced health check with more diagnostic information
    const dependencies = {
      nextAuthUrl: process.env.NEXTAUTH_URL || null,
      nextAuthSecret: process.env.NEXTAUTH_SECRET ? "Set (hidden)" : null,
      cosmosEndpoint: process.env.COSMOS_ENDPOINT ? "Set (hidden)" : null,
      azureAdClientId: process.env.AZURE_AD_CLIENT_ID ? "Set (hidden)" : null,
      azureAdTenantId: process.env.AZURE_AD_TENANT_ID || null,
      nodeEnv: process.env.NODE_ENV || "development",
      hostname: request.headers.get("host") || "unknown",
    };

    return NextResponse.json({ 
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      uptime: process.uptime(),
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      node: process.version,
      memoryUsage: process.memoryUsage(),
      azure: {
        website: process.env.WEBSITE_SITE_NAME || null,
        instance: process.env.WEBSITE_INSTANCE_ID || null,
        scm: process.env.SCM_COMMAND_IDLE_TIMEOUT || null
      },
      dependencies
    });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
