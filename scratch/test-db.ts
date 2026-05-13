import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const teachers = await prisma.teacher.findMany();
    console.log('Successfully connected to DB. Teachers count:', teachers.length);
  } catch (error) {
    console.error('Failed to connect to DB:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
