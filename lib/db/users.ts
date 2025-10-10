import { getUsersContainer, getProfilesContainer, isCosmosAvailable } from '../cosmos';
import { v4 as uuidv4 } from 'uuid';

type OidcIdentity = {
  sub?: string | null;
  oid?: string | null; // Azure AD object id
  email?: string | null;
  name?: string | null;
  preferred_username?: string | null; // UPN
  given_name?: string | null;
  family_name?: string | null;
  provider?: string | null;
  providerAccountId?: string | null;
};

// In-memory storage as fallback when Cosmos DB is not available
const memoryUserStore: Map<string, any> = new Map();
const memoryProfileStore: Map<string, any> = new Map();

export async function ensureUserFromOidc(identity: OidcIdentity) {
  try {
    const provider = identity.provider ?? 'microsoft';
    const providerAccountId = identity.providerAccountId ?? identity.sub ?? identity.oid ?? undefined;
    if (!providerAccountId) return null;

    const email = identity.email ?? undefined;
    const name = identity.name ?? undefined;
    const objectId = identity.oid || identity.sub || undefined;
    const upn = identity.preferred_username || undefined;
    const firstName = identity.given_name || undefined;
    const lastName = identity.family_name || undefined;
    const now = new Date().toISOString();
    
    // Check if Cosmos DB is available - use memory store if not
    const cosmosAvailable = isCosmosAvailable();
    
    if (!cosmosAvailable) {
      return handleInMemoryUserStore(provider, providerAccountId, email, name, objectId, upn, firstName, lastName, now);
    }

    // Get containers
    const usersContainer = await getUsersContainer();
    const profilesContainer = await getProfilesContainer();

    // Check if user exists
    const querySpec = {
      query: "SELECT * FROM c WHERE c.providerAccountId = @providerAccountId",
      parameters: [
        {
          name: "@providerAccountId",
          value: providerAccountId
        }
      ]
    };

    const { resources: existingUsers } = await usersContainer.items
      .query(querySpec)
      .fetchAll();
    
    let user;
    let userId;

    // If user exists, update it
    if (existingUsers && existingUsers.length > 0) {
      user = existingUsers[0];
      userId = user.id;
      
      // Update user
      const updatedUser = {
        ...user,
        email,
        name,
        objectId,
        upn,
        signInIdentity: email || upn,
        firstName,
        lastName,
        lastSignInAt: now,
        updatedAt: now
      };
      
      // Use items.upsert instead of item().replace for better compatibility
      const { resource: updatedUserResource } = await usersContainer.items.upsert(updatedUser);
      user = updatedUserResource;

      // Check if profile exists
      const profileQuerySpec = {
        query: "SELECT * FROM c WHERE c.userId = @userId",
        parameters: [
          {
            name: "@userId",
            value: userId
          }
        ]
      };

      const { resources: existingProfiles } = await profilesContainer.items
        .query(profileQuerySpec)
        .fetchAll();
      
      // Update or create profile
      if (existingProfiles && existingProfiles.length > 0) {
        const profile = existingProfiles[0];
        const updatedProfile = {
          ...profile,
          displayName: name ?? profile.displayName,
          updatedAt: now
        };
        // Use items.upsert instead of item().replace
        await profilesContainer.items.upsert(updatedProfile);
      } else {
        const newProfile = {
          id: uuidv4(),
          userId: userId,
          displayName: name ?? undefined,
          createdAt: now,
          updatedAt: now
        };
        await profilesContainer.items.create(newProfile);
      }
    } 
    // If user doesn't exist, create it
    else {
      userId = uuidv4();
      const newUser = {
        id: userId,
        provider,
        providerAccountId,
        email,
        name,
        objectId,
        upn,
        signInIdentity: email || upn,
        firstName,
        lastName,
        createdAt: now,
        updatedAt: now,
        lastSignInAt: now
      };
      
      const { resource: createdUser } = await usersContainer.items.create(newUser);
      user = createdUser;

      // Create profile
      const newProfile = {
        id: uuidv4(),
        userId: userId,
        displayName: name ?? undefined,
        createdAt: now,
        updatedAt: now
      };
      
      await profilesContainer.items.create(newProfile);
    }

    // Get profile to return with user
    const profileQuerySpec = {
      query: "SELECT * FROM c WHERE c.userId = @userId",
      parameters: [
        {
          name: "@userId",
          value: userId
        }
      ]
    };

    const { resources: profiles } = await profilesContainer.items
      .query(profileQuerySpec)
      .fetchAll();
    
    return {
      ...user,
      profile: profiles && profiles.length > 0 ? profiles[0] : null
    };
  } catch (error) {
    console.error("Error in ensureUserFromOidc:", error);
    // Fallback to memory store on error
    const provider = identity.provider ?? 'microsoft';
    const providerAccountId = identity.providerAccountId ?? identity.sub ?? identity.oid ?? undefined;
    if (!providerAccountId) return null;
    
    const email = identity.email ?? undefined;
    const name = identity.name ?? undefined;
    const objectId = identity.oid || identity.sub || undefined;
    const upn = identity.preferred_username || undefined;
    const firstName = identity.given_name || undefined;
    const lastName = identity.family_name || undefined;
    const now = new Date().toISOString();
    
    return handleInMemoryUserStore(provider, providerAccountId, email, name, objectId, upn, firstName, lastName, now);
  }
}

/**
 * Fallback function that uses in-memory storage when Cosmos DB is not available
 */
function handleInMemoryUserStore(
  provider: string, 
  providerAccountId: string,
  email?: string, 
  name?: string, 
  objectId?: string, 
  upn?: string, 
  firstName?: string, 
  lastName?: string,
  now: string = new Date().toISOString()
) {
  console.log("Using in-memory user store (Cosmos DB not available)");
  
  // Use providerAccountId as the key
  let user = memoryUserStore.get(providerAccountId);
  let userId;
  
  // If user exists, update it
  if (user) {
    userId = user.id;
    user = {
      ...user,
      email: email ?? user.email,
      name: name ?? user.name,
      objectId: objectId ?? user.objectId,
      upn: upn ?? user.upn,
      signInIdentity: email || upn || user.signInIdentity,
      firstName: firstName ?? user.firstName,
      lastName: lastName ?? user.lastName,
      lastSignInAt: now,
      updatedAt: now
    };
    memoryUserStore.set(providerAccountId, user);
  } 
  // If user doesn't exist, create it
  else {
    userId = uuidv4();
    user = {
      id: userId,
      provider,
      providerAccountId,
      email,
      name,
      objectId,
      upn,
      signInIdentity: email || upn,
      firstName,
      lastName,
      createdAt: now,
      updatedAt: now,
      lastSignInAt: now
    };
    memoryUserStore.set(providerAccountId, user);
  }
  
  // Check if profile exists
  let profile = Array.from(memoryProfileStore.values()).find(p => p.userId === userId);
  
  if (profile) {
    profile = {
      ...profile,
      displayName: name ?? profile.displayName,
      updatedAt: now
    };
    memoryProfileStore.set(profile.id, profile);
  } else {
    const profileId = uuidv4();
    profile = {
      id: profileId,
      userId,
      displayName: name ?? undefined,
      createdAt: now,
      updatedAt: now
    };
    memoryProfileStore.set(profileId, profile);
  }
  
  return {
    ...user,
    profile
  };
}
