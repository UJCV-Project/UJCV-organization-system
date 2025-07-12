import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';

const prisma = new PrismaClient();

async function run() {
  const sql = readFileSync('./init.sql', 'utf-8');

  try {
    await prisma.$executeRawUnsafe(sql); // ⚠️ Use with trusted SQL only!
    console.log('SQL executed successfully');
  } catch (err) {
    console.error('Error executing SQL:', err);
  } finally {
    await prisma.$disconnect();
  }
}

run();
