# Cross-Tenant Azure AD Authentication Guide

This guide explains how to configure your application when the app runs in a different Azure AD tenant than where the app registration exists.

## Understanding the Scenario

In your case:
- App Registration Tenant ID: `438537ce-67d5-4799-837e-aa8ba4ed01eb`
- App Running in Tenant ID: Different tenant (appears to be `210c0b48-cd6d-4b9f-8c17-54ba2524cced` from your current login)

## Solution: Configure Multi-Tenant Authentication

### 1. Update Your Application Code

✅ **Already Completed**: We've updated your auth.ts file to use `tenantId: 'common'` instead of a specific tenant ID.

This change allows your application to accept sign-ins from any Azure AD tenant.

### 2. Verify Your App Registration Configuration for Multi-Tenant

✅ **Already Configured**: Your app registration is already correctly configured as multi-tenant.

The current settings in Azure Portal show:
- Supported account types: "Accounts in any organizational directory (Any Microsoft Entra ID tenant - Multitenant)"
- This setting allows users from any Azure AD tenant to sign in to your application

If you need to verify this configuration:
1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to "Microsoft Entra ID" > "App registrations" 
3. Select your app (Client ID: `3ca9d2ec-a691-4a58-9658-ecd4fb8d6918`)
4. Go to "Authentication" > "Supported account types"
5. Confirm that "Accounts in any organizational directory" is selected

### 3. Configure Redirect URIs

⚠️ **Configuration Required**: Your app registration needs specific redirect URIs to handle both NextAuth.js and App Service Authentication.

Required redirect URIs:
```
https://thinkforward-dev.azurewebsites.net/api/auth/callback/microsoft  (for NextAuth.js)
https://thinkforward-dev.azurewebsites.net/.auth/login/aad/callback     (for App Service Authentication)
```

To configure these redirect URIs:
1. Go to your app registration in the Azure Portal
2. Navigate to "Authentication" > "Platform configurations" > "Web"
3. Add both redirect URIs listed above
4. For local development, also add:
   ```
   http://localhost:3000/api/auth/callback/microsoft
   ```
   or if using a different port:
   ```
   http://localhost:3006/api/auth/callback/microsoft
   ```
5. Click Save at the top of the page

**Important Note**: You appear to be using both NextAuth.js and App Service Authentication (Easy Auth). This can cause conflicts. Consider using only one authentication method, preferably NextAuth.js for your app.

### 4. Grant Admin Consent (Optional but Recommended)

For a smoother user experience:

1. Go to "API permissions" in your app registration
2. Click "Grant admin consent for [Tenant]"

This step might need to be performed by a Global Administrator in each tenant that will use your app.

### 5. Update Environment Variables

✅ **Already Completed**: We've updated your environment scripts to use `common` for the `AZURE_AD_TENANT_ID`.

### 6. Test Your Authentication

1. Start your application locally: `npm run dev`
2. Try signing in with a user from a different tenant
3. If the sign-in succeeds, your multi-tenant configuration is working

## Cross-Tenant Admin Consent URL

If users from other tenants need to use your app, they'll need to consent to the permissions. An admin in each tenant can grant consent by visiting:

```
https://login.microsoftonline.com/common/adminconsent?client_id=3ca9d2ec-a691-4a58-9658-ecd4fb8d6918&redirect_uri=https://thinkforward-dev.azurewebsites.net
```

### 7. Enable Implicit Flow and ID Tokens

⚠️ **Required Configuration**: You must enable ID tokens in your app registration.

NextAuth.js with Azure AD provider uses the PKCE authorization code flow with ID tokens, which requires the 'ID tokens' option to be enabled:

1. Go to your app registration in the Azure Portal
2. Navigate to "Authentication" in the left menu
3. In the "Implicit grant and hybrid flows" section, check both:
   - ☑ Access tokens (used for implicit flows)
   - ☑ ID tokens (used for implicit and hybrid flows)
4. Click Save at the top of the page

Without this setting, you'll encounter the error: `AADSTS700054: response_type 'id_token' is not enabled for the application.`

## Troubleshooting Common Issues

1. **"AADSTS700054: response_type 'id_token' is not enabled for the application"**:
   - You need to enable ID tokens in your app registration's Authentication settings
   - Follow the steps in section 7 above to fix this

2. **"App is trying to access a resource it doesn't have permissions to access"**:
   - Make sure you've configured the app as multi-tenant in the Azure Portal
   - Verify users have granted consent to the application

3. **"Invalid client secret"**:
   - Verify the client secret hasn't expired
   - Regenerate it in the Azure Portal if needed

4. **"AADSTS50011: The redirect URI specified doesn't match the ones configured"**:
   - Add both required redirect URIs to your app registration:
     - `https://thinkforward-dev.azurewebsites.net/api/auth/callback/microsoft` (for NextAuth.js)
     - `https://thinkforward-dev.azurewebsites.net/.auth/login/aad/callback` (for App Service Authentication)
   - Consider disabling App Service Authentication if you're using NextAuth.js

5. **"User from tenant 'X' is not allowed to access this application"**:
   - Verify the app is configured for multi-tenant access
   - Check that you're using `tenantId: 'common'` in your code

## Resources

- [Microsoft Identity Platform Documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/)
- [NextAuth.js Azure AD Provider Documentation](https://next-auth.js.org/providers/azure-ad)