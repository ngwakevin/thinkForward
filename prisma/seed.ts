import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const activities = [
    { slug: 'running', name: 'Running' },
    { slug: 'hiking', name: 'Hiking' },
    { slug: 'coding', name: 'Coding' },
    { slug: 'reading', name: 'Reading' },
  ];

  for (const a of activities) {
    await prisma.activity.upsert({
      where: { slug: a.slug },
      update: { name: a.name, isActive: true },
      create: { slug: a.slug, name: a.name },
    });
  }

  console.log('Seed complete');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
