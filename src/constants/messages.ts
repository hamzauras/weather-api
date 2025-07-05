// EN: Centralized application messages used for API responses and errors
export const Messages = {
  USER_REGISTERED: 'User registered successfully',
  EMAIL_IN_USE: 'Email is already in use',
  MISSING_FIELDS: 'Required fields are missing',
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Forbidden: Insufficient permissions',
  SERVER_ERROR: 'Internal server error',

  FETCH_USERS_ERROR: 'Failed to retrieve users',
  USER_UPDATED: 'User role updated successfully',
  UPDATE_ERROR: 'Failed to update user',
  USER_DELETED: 'User deleted successfully',
  DELETE_ERROR: 'Failed to delete user',

  WEATHER_FETCH_ERROR: 'Failed to fetch weather data',

  TOKEN_MISSING: 'Authorization token is missing',
  INVALID_TOKEN: 'Authorization token is invalid',
};
