import { PrismaClient } from '@prisma/client';
import { env } from './env';

export const prisma = new PrismaClient();
let prismaReady = false;

export function isPrismaReady(): boolean {
  return prismaReady;
}

export async function connectMongo(): Promise<PrismaClient | null> {
  if (!env.databaseUrl) {
    console.warn('DATABASE_URL is not configured; using in-memory fallback mode.');
    prismaReady = false;
    return null;
  }

  try {
    await prisma.$connect();
    prismaReady = true;
    console.log('PostgreSQL connected via Prisma.');
    return prisma;
  } catch (error) {
    console.warn('PostgreSQL connection failed, falling back to in-memory repository mode:', error);
    prismaReady = false;
    return null;
  }
}

export function getMongoDb(): PrismaClient | null {
  return prismaReady ? prisma : null;
}

export async function disconnectMongo(): Promise<void> {
  await prisma.$disconnect();
  prismaReady = false;
}
