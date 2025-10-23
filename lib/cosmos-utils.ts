// Thin utility wrapper for Cosmos DB operations compatible with simple JS examples
// Leverages existing TypeScript cosmos service and bootcamp utilities

import { cosmosService } from './azure/cosmos-service';
import { createBootcampRegistration } from './db/bootcamps';

/** Create a user document in Cosmos DB */
export async function createUser(user: any) {
  // Ensure required fields expected by our schema
  const payload: any = {
    provider: user.provider || 'credentials',
    providerAccountId: user.providerAccountId || 'local',
    email: user.email?.toLowerCase(),
    name: user.name || null,
    passwordHash: user.passwordHash || null,
    isMentor: user.isMentor ?? false,
    profile: user.profile || null,
  };
  return cosmosService.createUser(payload);
}

/** Fetch a user by email */
export async function getUserByEmail(email: string) {
  return cosmosService.getUserByEmail(email.toLowerCase());
}

/**
 * Link a bootcamp to a user.
 * For compatibility with the JS snippet, we update a `bootcamps` array on the user document
 * and also create a bootcamp registration record for tracking.
 */
export async function linkBootcampToUser(email: string, bootcampName: string) {
  const user = await getUserByEmail(email);
  if (!user) throw new Error('User not found');

  // 1) Update user's bootcamps array (schemaless field)
  const nextBootcamps = Array.isArray((user as any).bootcamps)
    ? ([...(user as any).bootcamps] as string[])
    : ([] as string[]);
  if (!nextBootcamps.includes(bootcampName)) nextBootcamps.push(bootcampName);
  await cosmosService.updateUser(user.id, { ...(user as any), bootcamps: nextBootcamps } as any);

  // 2) Create a dedicated bootcamp registration record for richer queries
  try {
    await createBootcampRegistration({
      userId: user.id,
      email: user.email || email,
      name: user.name || undefined,
      bootcampName,
      track: bootcampName,
      provider: (user as any).provider || 'credentials',
      type: 'bootcamp-registration',
    });
  } catch (err) {
    console.warn('Bootcamp registration creation failed (non-fatal):', err);
  }

  // Return the updated user snapshot
  return cosmosService.getUserById(user.id);
}
