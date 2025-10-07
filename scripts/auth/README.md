# Authentication Setup for ThinkForward

This directory contains scripts and utilities related to authentication for the ThinkForward application.

## Required Environment Variables

For authentication to work properly in production, the following environment variables must be set:

- `NEXTAUTH_URL`: The base URL of your application (e.g., `https://your-app.azurewebsites.net`)
- `NEXTAUTH_SECRET`: A secret string used to encrypt cookies and tokens
- `AZURE_AD_CLIENT_ID`: The client ID from your Entra External ID registration
- `AZURE_AD_CLIENT_SECRET`: The client secret from your Entra External ID registration
- `AZURE_AD_TENANT_ID`: Your Azure tenant ID

## Generating a NEXTAUTH_SECRET

To generate a secure `NEXTAUTH_SECRET` value, run:

```bash
npm run generate:secret
```

This will output a secure random value that you should add to:

1. Your GitHub repository secrets (for CI/CD)
2. Your Azure App Service application settings
3. Your local `.env.local` file (for development)

## Entra External ID Setup

1. Register a new app in Entra External ID (Azure AD)
2. Configure the redirect URI: `https://your-app.azurewebsites.net/api/auth/callback/azure-ad`
3. Create a client secret and note it down
4. Add the required permissions (e.g., `User.Read`)
5. Set the client ID, client secret, and tenant ID in your environment variables

## Authentication Flow

1. User clicks "Sign In" and is redirected to Entra External ID login
2. After successful authentication, the user is redirected back to the app
3. NextAuth.js validates the token and creates a session
4. The user data is saved to Cosmos DB if it's their first login

## Security Considerations

- Never commit secrets to version control
- Use Azure Key Vault for storing sensitive information in production
- Use managed identities for accessing Azure resources when possible
- Rotate secrets regularly

## Troubleshooting

If you encounter authentication errors, check that:

1. All required environment variables are set
2. The redirect URIs match exactly in your Entra ID app registration
3. The scopes are correctly configured
4. The NEXTAUTH_SECRET is properly set in your deployment