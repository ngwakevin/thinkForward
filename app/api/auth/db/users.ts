// app/api/auth/db/users.ts
import crypto from 'crypto';

// Import your Cosmos DB service dynamically to avoid circular dependencies
const getCosmosService = async () => {
  const { authCosmosService } = await import("../../../../lib/azure/auth-cosmos-service");
  return authCosmosService;
};

// Types for user data
interface OidcUserData {
  email?: string;
  name: string;
  provider: string;
  providerAccountId: string;
  oid?: string;
  sub?: string;
}

/**
 * Ensures a user exists in the database from OIDC provider data
 * If the user doesn't exist, creates a new one
 */
export async function ensureUserFromOidc(userData: OidcUserData) {
  try {
    const cosmosService = await getCosmosService();
    
    // Try to find user by provider + providerAccountId first (most reliable)
    let user = await cosmosService.getUserByProviderAccount(
      userData.provider, 
      userData.providerAccountId
    );
    
    // If not found by provider account, try email
    if (!user && userData.email) {
      user = await cosmosService.getUserByEmail(userData.email);
      
      // If found by email but different provider, link the accounts
      if (user) {
        console.log(`[auth] Linking existing user ${user.id} with provider ${userData.provider}`);
        await cosmosService.linkUserAccount(user.id, {
          provider: userData.provider,
          providerAccountId: userData.providerAccountId,
          oid: userData.oid,
        });
      }
    }
    
    // If still not found, create new user
    if (!user) {
      console.log(`[auth] Creating new user from ${userData.provider} auth`);
      
      // Generate unique ID
      const userId = crypto.randomUUID();
      
      user = await cosmosService.createUser({
        id: userId,
        email: userData.email,
        emailVerified: userData.email ? new Date().toISOString() : null,
        name: userData.name || 'Anonymous User',
        provider: userData.provider,
        providerAccountId: userData.providerAccountId,
        oid: userData.oid,
        profile: {
          displayName: userData.name
        }
      });
    }
    
    return user;
  } catch (error) {
    console.error("[auth] Error in ensureUserFromOidc:", error);
    return null;
  }
}