import { getUsersContainer, getProfilesContainer } from '../cosmos';
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

export async function ensureUserFromOidc(identity: OidcIdentity) {
  try {
    const provider = identity.provider ?? 'microsoft';
    const providerAccountId = identity.providerAccountId ?? identity.sub ?? undefined;
    if (!providerAccountId) return null;

    const email = identity.email ?? undefined;
    const name = identity.name ?? undefined;
    const objectId = identity.oid || identity.sub || undefined;
    const upn = identity.preferred_username || undefined;
    const firstName = identity.given_name || undefined;
    const lastName = identity.family_name || undefined;
    const now = new Date().toISOString();

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
        lastSignInAt: now
      };
      
      const { resource: updatedUserResource } = await usersContainer.item(userId).replace(updatedUser);
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
        await profilesContainer.item(profile.id).replace(updatedProfile);
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
    return null;
  }
}
