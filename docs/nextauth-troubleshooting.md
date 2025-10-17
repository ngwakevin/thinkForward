# NextAuth Troubleshooting Guide for Azure App Service

This document provides steps for troubleshooting authentication issues with NextAuth.js when deployed to Azure App Service.

## Configuration Checklist

### 1. Environment Variables

Ensure these environment variables are properly set in Azure App Service Configuration:

- `NEXTAUTH_URL`: Should be `https://yourdomain.azurewebsites.net`
- `NEXTAUTH_SECRET`: Must be identical to your local development environment
- `AZURE_AD_CLIENT_ID`: Your Microsoft Entra ID/Azure AD application client ID
- `AZURE_AD_CLIENT_SECRET`: Your Microsoft Entra ID/Azure AD application client secret 
- `AZURE_AD_TENANT_ID`: Your tenant ID (or "common" for multi-tenant)

### 2. Cookie Configuration

NextAuth cookies must be properly configured for production HTTPS environments:

```typescript
cookies: {
  sessionToken: {
    name: "__Secure-next-auth.session-token",
    options: {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: true, // Must be true in production
    },
  },
},
```

### 3. JWT/Session Callbacks

Ensure JWT and session callbacks correctly pass the user ID:

```typescript
callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.sub = user.id;
    }
    return token;
  },
  async session({ session, token }) {
    if (session.user) {
      session.user.id = token.sub || token.id;
    }
    return session;
  },
},
```

## Common Issues and Solutions

### Issue: Auto-Login Not Working

**Symptoms:**
- User is redirected to login page after every page refresh
- Session appears to be lost between requests

**Solutions:**

1. **Check NEXTAUTH_SECRET**:
   - Must be identical across environments
   - Must be properly set in Azure App Settings
   - App Service must be restarted after changing this value

2. **Check Secure Cookie Handling**:
   - Azure App Service uses a reverse proxy
   - Ensure cookies have the `secure` flag set to `true`
   - Check your browser's developer tools to see if cookies are being set

3. **Check Headers**:
   - Azure's IIS/ARR proxy might be modifying headers
   - Ensure `trust: true` is set in NextAuth config

4. **Test Middleware**:
   - If using middleware, temporarily disable it to see if that's causing the issue
   - Make sure middleware isn't interfering with NextAuth endpoints

### Issue: Login Redirects to Error Page

**Symptoms:**
- Clicking "Sign in" redirects to error page
- Error mentions CSRF token mismatch

**Solutions:**

1. **Check for Cookie Issues**:
   - Clear your browser cookies and try again
   - Ensure cookies are being properly set (check browser dev tools)

2. **Check NEXTAUTH_URL**:
   - Ensure it matches your actual deployment URL

3. **Azure App Service Configuration**:
   - Check if ARR Affinity is enabled (may need to be disabled)
   - Ensure your app is configured for HTTPS

## Debugging Tools

Run these scripts to diagnose authentication issues:

1. Check NextAuth Secret: `/scripts/check-nextauth-secret.sh`
2. Debug NextAuth: `/scripts/debug-nextauth.sh`

## NextAuth with Azure App Service Best Practices

1. **Always use JWT strategy**:
   ```typescript
   session: {
     strategy: 'jwt',
     maxAge: 30 * 24 * 60 * 60, // 30 days
   }
   ```

2. **Use secure cookies**:
   ```typescript
   cookies: {
     sessionToken: {
       name: "__Secure-next-auth.session-token",
       options: { httpOnly: true, sameSite: "lax", path: "/", secure: true },
     },
   }
   ```

3. **Handle proxy headers**:
   ```typescript
   // In app/api/auth/[...nextauth]/route.ts
   if (process.env.WEBSITE_HOSTNAME) {
     process.env.NEXTAUTH_URL = `https://${process.env.WEBSITE_HOSTNAME}`;
   }
   ```

4. **Enhanced logging**:
   ```typescript
   logger: {
     error(code, ...message) {
       console.error('[nextauth][error]', code, ...message);
     },
     warn(code, ...message) {
       console.warn('[nextauth][warn]', code, ...message);
     },
     debug(code, ...message) {
       console.debug('[nextauth][debug]', code, ...message);
     },
   },
   ```

## Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/configuration/options)
- [Azure App Service Documentation](https://docs.microsoft.com/en-us/azure/app-service/)
- [Azure Application Gateway with HTTP to HTTPS redirection](https://docs.microsoft.com/en-us/azure/application-gateway/redirect-http-to-https-portal)