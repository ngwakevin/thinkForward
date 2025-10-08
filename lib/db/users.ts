import { prisma } from '../prisma';

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
  const provider = identity.provider ?? 'microsoft';
  const providerAccountId = identity.providerAccountId ?? identity.sub ?? undefined;
  if (!providerAccountId) return null;

  const email = identity.email ?? undefined;
  const name = identity.name ?? undefined;
  const objectId = identity.oid || identity.sub || undefined;
  const upn = identity.preferred_username || undefined;
  const firstName = identity.given_name || undefined;
  const lastName = identity.family_name || undefined;
  const now = new Date();

  // Upsert User by provider+providerAccountId
  const user = await prisma.user.upsert({
    where: { providerAccountId },
    create: ({
      provider,
      providerAccountId,
      email,
      name,
      objectId,
      upn,
      signInIdentity: email || upn,
      firstName,
      lastName,
      lastSignInAt: now,
      profile: {
        create: {
          displayName: name ?? undefined,
        },
      },
    } as any),
    update: ({
      email,
      name,
      objectId,
      upn,
      signInIdentity: email || upn,
      firstName,
      lastName,
      lastSignInAt: now,
      profile: {
        upsert: {
          create: { displayName: name ?? undefined },
          update: { displayName: name ?? undefined },
        },
      },
    } as any),
    include: { profile: true },
  });

  return user;
}
