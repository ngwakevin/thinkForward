import { prisma } from '../lib/prisma';

async function main() {
  console.log('Prisma datasource URL present:', !!process.env.DATABASE_URL);
  try {
    console.time('db-connect');
    await prisma.$connect();
    console.timeEnd('db-connect');
    console.log('Connected. Running lightweight query...');
    const userCount = await prisma.user.count().catch(e => {
      console.warn('Count failed (may be expected if migrations not applied):', e.code || e.message);
      return -1;
    });
    console.log('User count (or -1 if failed):', userCount);
  } catch (e: any) {
    console.error('Direct connect failed. Raw error below ->');
    console.error('Name:', e.name);
    console.error('Code:', e.code);
    console.error('Message:', e.message);
    if (e.meta) console.error('Meta:', e.meta);
    if (e.stack) console.error(e.stack.split('\n').slice(0,6).join('\n'));
  } finally {
    await prisma.$disconnect().catch(()=>{});
  }
}

main();
