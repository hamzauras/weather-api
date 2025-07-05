// EN: Standard HTTP status codes used throughout the application
export const StatusCodes = {
  OK: 200,                        // EN: Request succeeded
  CREATED: 201,                   // EN: Resource created successfully
  BAD_REQUEST: 400,               // EN: Client sent invalid request
  UNAUTHORIZED: 401,              // EN: Authentication required or failed
  FORBIDDEN: 403,                 // EN: Access denied due to insufficient permissions
  NOT_FOUND: 404,                 // EN: Requested resource not found
  INTERNAL_SERVER_ERROR: 500,     // EN: Generic server error

  // EN: Prisma-specific error codes for common database errors
  PRISMA_EMAIL_IN_USE: 'P2002',          // EN: Unique constraint violation (e.g., duplicate email)
  PRISMA_RECORD_NOT_FOUND: 'P2025',      // EN: Record not found error when updating/deleting
};
