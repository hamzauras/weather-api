/**
 * EN: Extended error interface for application-specific errors
 * - Allows attaching custom error codes (e.g. from Prisma or external services)
 */
export interface AppError extends Error {
  code?: string; // EN: Optional custom error code (e.g., "P2025" from Prisma)
}
