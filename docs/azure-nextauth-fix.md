# NextAuth Configuration for Azure App Service

This document explains the fixes implemented to address auto-login issues when running NextAuth.js with Azure App Service.

## Problem

Azure App Service injects a reverse proxy layer (using IIS/ARR) that modifies request headers, including:
- `X-Forwarded-Proto`
- `Host`

When NextAuth doesn't properly recognize or trust these modified headers, it can misinterpret HTTPS requests as HTTP. This leads to:
1. NextAuth setting cookies with `Secure` flags that don't persist
2. Authentication sessions failing to maintain across requests
3. Users not being "auto-logged in" after registration

## Solution

The following changes were implemented to fix the authentication issues:

### 1. NextAuth Cookie Configuration

Updated the `auth.ts` file to add explicit cookie configuration:

```typescript
cookies: {
  sessionToken: {
    name: "__Secure-next-auth.session-token",
    options: {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: true,
    },
  },
},
```

### 2. Azure Proxy Detection and Configuration

Updated the `app/api/auth/[...nextauth]/route.ts` file to properly detect and handle the Azure App Service environment:

```typescript
// Configure NextAuth to work with Azure App Service's reverse proxy
process.env.NEXTAUTH_URL_INTERNAL = process.env.NEXTAUTH_URL;

// For Azure App Service, we need to ensure correct proxy handling
if (process.env.WEBSITE_HOSTNAME) {
  console.log(`Running in Azure App Service: ${process.env.WEBSITE_HOSTNAME}`);
  // Force secure cookies when behind Azure's proxy
  process.env.NEXTAUTH_URL = `https://${process.env.WEBSITE_HOSTNAME}`;
}
```

## Additional Notes

- NextAuth v4 doesn't support the `trustHost` and `trustProxy` options directly through its TypeScript types, so we implemented alternative fixes
- The solution ensures that cookies are properly set with secure flags and that NextAuth correctly recognizes requests from the Azure App Service proxy
- This fix addresses user auto-login issues after registration without requiring users to manually log in

## Testing

After deploying this change, verify that:
1. New user registrations automatically log in the user
2. Existing users remain logged in across page refreshes
3. Session cookies are properly set with the "Secure" flag

If issues persist, check the server logs for any NextAuth-related error messages and verify that the NEXTAUTH_URL is set correctly in the Azure App Service configuration.