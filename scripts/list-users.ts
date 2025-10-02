import { prisma } from '../lib/prisma';

async function main() {
  try {
    await prisma.$connect();
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
    const rows = users.map(u => {
      const anyU: any = u as any;
      return {
        id: u.id,
        provider: u.provider,
        providerAccountId: u.providerAccountId,
        email: u.email,
        signInIdentity: anyU.signInIdentity,
        objectId: anyU.objectId,
        upn: anyU.upn,
        lastSignInAt: anyU.lastSignInAt ? new Date(anyU.lastSignInAt).toISOString() : null,
        createdAt: u.createdAt.toISOString(),
      };
    });
    console.table(rows);
  } catch (e) {
    console.error('Failed to list users', e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
