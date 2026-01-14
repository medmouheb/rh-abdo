
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const candidates = await prisma.candidate.findMany();
    console.log('Candidates count:', candidates.length);
    candidates.forEach(c => {
        console.log(`ID: ${c.id}, Name: ${c.firstName} ${c.lastName}`);
    });
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
