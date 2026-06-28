import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Force re-creation of PrismaClient to pick up schema changes
// Check if the cached client has the expected models
const cachedClient = globalForPrisma.prisma
const needsNewClient = !cachedClient || !('productView' in cachedClient)

// Only enable query logging in development to avoid noisy production logs
const logLevels = process.env.NODE_ENV === 'production' ? ['error', 'warn'] : ['query', 'error', 'warn']

export const db = needsNewClient
  ? new PrismaClient({
      log: logLevels,
    })
  : cachedClient

// Cache the client in development to avoid exhausting DB connections on hot reload.
// In production (serverless), each instance creates its own client.
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
