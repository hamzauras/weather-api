// EN: Standard HTTP status codes used throughout the application
export const StatusCodes = {
  OK: 200,                        // EN: Request succeeded
  CREATED: 201,                   // EN: Resource created successfully
  BAD_REQUEST: 400,               // EN: Client sent invalid request
  UNAUTHORIZED: 401,              // EN: Authentication required or failed
  FORBIDDEN: 403,                 // EN: Access denied due to insufficient permissions
  NOT_FOUND: 404,                 // EN: Requested resource not found
  INTERNAL_SERVER_ERROR: 500,     // EN: Generic server error
};
