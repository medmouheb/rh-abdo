if (typeof process !== 'undefined') {
  process.env.PRISMA_CLIENT_ENGINE_TYPE = 'library';
}
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const isBuild = process.env.NEXT_PHASE === 'phase-production-build' || process.env.IS_BUILD === 'true' || process.env.SKIP_BUILD_STATIC_GENERATION === 'true';

export const prisma =
  globalForPrisma.prisma ||
  (isBuild
    ? (null as unknown as PrismaClient)
    : new PrismaClient({
      log: ["query"],
    }));

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
