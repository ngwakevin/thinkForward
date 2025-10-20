# Authentication Secret Management

This document explains how authentication secrets are managed in the ThinkForward application.

## Secret Unification

We've unified the authentication secrets to ensure both NextAuth.js and our JWT implementation use the same secret. This provides several benefits:

1. **Consistency**: All authentication methods use the same underlying secret
2. **Simplicity**: Easier to manage one secret instead of two
3. **Security**: Reduces the risk of misconfigurations

## Implementation Details

The application now uses a unified approach for secrets:

1. **Primary Secret**: `NEXTAUTH_SECRET` is now the primary secret
2. **Fallback**: If `NEXTAUTH_SECRET` is not available, the system falls back to `JWT_SECRET`
3. **Middleware**: Updated to use the same secret source as the rest of the application
4. **GitHub Actions**: Updated to ensure both secrets are set to the same value

## Code Changes

- **lib/jwt.ts**: Now uses `NEXTAUTH_SECRET` with fallback to `JWT_SECRET`
- **middleware.ts**: Updated to use `NEXTAUTH_SECRET` with fallback to `JWT_SECRET`
- **GitHub Actions**: Modified to set both environment variables to the same value

## Deployment

We've created a new script (`scripts/unify-auth-secrets.sh`) that ensures both secrets are set to the same value in Azure App Service configuration. This script:

1. Checks if both secrets are set
2. If one is missing, it sets it to match the other
3. If both are missing, it generates a new secret for both
4. If both are set but different, it prompts for which to keep

## How to Use

To ensure secrets are properly unified:

1. Run the unification script:
   ```bash
   bash scripts/unify-auth-secrets.sh
   ```

2. Make sure your local `.env.local` file has the same secret for both:
   ```
   NEXTAUTH_SECRET=your-secret-value
   JWT_SECRET=your-secret-value
   ```

3. In GitHub Actions, ensure you have the `NEXTAUTH_SECRET` secret set.

## Testing

When deploying or testing authentication, verify that:

1. JWT token verification works in middleware
2. NextAuth.js sign-in functions correctly
3. Auto-login functionality works properly