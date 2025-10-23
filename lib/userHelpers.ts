// Compatibility helpers matching pages-based examples, built on current services
import bcrypt from 'bcryptjs';
import cosmosService from '@/lib/azure/cosmos-service';
import { getUsersContainer, getBootcampRegistrationsContainer, isCosmosAvailable } from '@/lib/cosmos';
import { createBootcampRegistration } from '@/lib/db/bootcamps';

// Create a new user; stores passwordHash (not plaintext) and sets required fields
export async function createUser({ name, email, password }: { name: string; email: string; password: string }) {
  const hashed = await bcrypt.hash(password, 12);
  // Prefer using the typed service to create user so we keep schema consistent
  const user = await cosmosService.createUser({
    provider: 'credentials',
    providerAccountId: crypto.randomUUID(),
    name,
    email: email.toLowerCase(),
    username: name || email.split('@')[0],
    passwordHash: hashed,
    signInIdentity: email.toLowerCase(),
    isMentor: false,
  });
  return user;
}

export async function getUserByEmail(email: string) {
  return cosmosService.getUserByEmail(email.toLowerCase());
}

// Link bootcamp to a user. Uses dedicated bootcamp registration store.
export async function registerBootcamp(email: string, bootcampName: string) {
  const user = await getUserByEmail(email);
  if (!user) throw new Error('User not found');

  // Create a rich registration record
  const registration = await createBootcampRegistration({
    userId: user.id,
    email: user.email || email,
    name: user.name || undefined,
    bootcampName,
    track: bootcampName,
    type: 'bootcamp-registration',
  });
  return registration;
}
