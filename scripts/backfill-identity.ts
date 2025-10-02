#!/usr/bin/env tsx
import prisma from '../lib/prisma';

async function run() {
  // Fetch all users; filter in JS for simplicity since new fields may not yet be in the generated client type.
  const users: any[] = await prisma.user.findMany();
  let updated = 0;
  for (const u of users) {
    const needs = !u.signInIdentity || !u.lastSignInAt;
    if (!needs) continue;
    try {
      await prisma.user.update({
        where: { id: u.id },
        data: {
          signInIdentity: u.signInIdentity || u.email || u.upn || u.objectId,
          lastSignInAt: u.lastSignInAt || u.createdAt,
        } as any,
      });
      updated++;
    } catch (e) {
      console.warn('Failed to update user', u.id, e);
    }
  }
  console.log(`Backfill complete. Updated ${updated} user(s).`);
  await prisma.$disconnect();
}
run().catch((e) => {
  console.error(e);
  process.exit(1);
});
