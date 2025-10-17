# Next.js App Router with NextAuth on Azure App Service

This document provides a solution for deployment issues with Next.js App Router API routes (specifically NextAuth) on Azure App Service.

## Issue: Missing Module Error in Azure App Service

When deploying a Next.js application with App Router API routes to Azure App Service, you might encounter this error:

```
Error: Cannot find module 'next/dist/compiled/next-server/app-route.runtime.prod.js'
```

This occurs because the standalone Next.js build has issues with certain environment variable manipulations in API route handlers.

## Solution

Our fix implements several layers of compatibility improvements:

### 1. Simplified NextAuth Route Handler

We've simplified the route handler to avoid environment variable manipulations that could cause build issues:

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import '../../../../lib/build-config';
import { authOptions } from '../../../../lib/auth';

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

### 2. Environment Configuration in Auth Options

We've moved Azure environment detection to the auth options configuration:

```typescript
// lib/auth.ts
// Ensure NEXTAUTH_URL is set and properly configured for Azure App Service
if (typeof window === 'undefined') {
  // For Azure App Service, we need to ensure correct proxy handling
  if (process.env.WEBSITE_HOSTNAME) {
    process.env.NEXTAUTH_URL = `https://${process.env.WEBSITE_HOSTNAME}`;
  }
  // ... other environment handling
}
```

### 3. Dynamic Cookie Configuration

We've implemented dynamic cookie configuration based on the hosting environment:

```typescript
const isRunningInAzure = typeof process !== 'undefined' && !!process.env.WEBSITE_HOSTNAME;

const getCookiePrefix = () => {
  if (isRunningInAzure) {
    return "__Secure-";
  }
  return undefined; // Let NextAuth determine the prefix
};

// Applied to each cookie configuration
```

### 4. Middleware for Protocol Handling

We've enhanced the middleware to ensure Azure's reverse proxy correctly forwards protocol information:

```typescript
// middleware.ts
// Handle Azure App Service proxy headers for NextAuth compatibility
if (process.env.WEBSITE_HOSTNAME && !request.headers.get('x-forwarded-proto')) {
  // Force secure protocol flag for NextAuth in Azure App Service
  response.headers.set('x-forwarded-proto', 'https');
}
```

## Azure App Service Configuration

For complete compatibility, ensure your Azure App Service has these application settings:

1. `NODE_ENV`: Set to `production`
2. `NEXTAUTH_URL`: Set to the public HTTPS URL of your app service (https://your-app-name.azurewebsites.net)
3. `NEXTAUTH_SECRET`: Set to your secure, randomly generated secret

## Testing After Deployment

After deploying, verify that:

1. Authentication flows work properly
2. Users remain signed in after refreshing the page
3. Automatic login works after user registration
4. Secure cookies are properly set

If issues persist, check the application logs in Azure App Service for more specific error details.