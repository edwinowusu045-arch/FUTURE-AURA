import { PrismaClient } from '@prisma/client';

// eslint-disable-next-line no-undef
const globalWithPrisma = globalThis as typeof globalThis & { prisma?: PrismaClient };

export const prisma = globalWithPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalWithPrisma.prisma = prisma;
}
