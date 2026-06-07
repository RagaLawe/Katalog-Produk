import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Force re-creation of PrismaClient to pick up schema changes
// Check if the cached client has the expected models
const cachedClient = globalForPrisma.prisma
const needsNewClient = !cachedClient || !('productView' in cachedClient)

export const db = needsNewClient
  ? new PrismaClient({
      log: ['query'],
    })
  : cachedClient

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
