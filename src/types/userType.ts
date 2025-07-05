// EN: Enum defining valid user roles
import { Role } from '../constants/roles';

/**
 * EN: JWT payload structure attached to authenticated requests
 * - Used to extract user information from decoded token
 */
export interface UserPayload {
  userId: number; // EN: Unique identifier for the user
  role: Role;     // EN: User's role (e.g., ADMIN or USER)
}

/**
 * EN: Public-facing user representation
 * - This interface is safe to expose to the client (e.g. omits password)
 */
export interface UserPublic {
  id: number;     // EN: Unique identifier for the user
  email: string;  // EN: User email address
  role: Role;     // EN: User's assigned role
}
