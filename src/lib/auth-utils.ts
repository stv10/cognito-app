import type { User } from 'oidc-client-ts';

interface DecodedToken {
  sub: string;
  email: string;
  given_name?: string;
  family_name?: string;
  'cognito:groups'?: string[];
  [key: string]: string | string[] | undefined;
}

/**
 * Decodes a JWT token without verification (for client-side use)
 * Note: This is safe for client-side use as we're only extracting claims
 */
function decodeJwtToken(token: string): DecodedToken | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
}

/**
 * Extracts user groups from the Cognito ID token
 */
export function getUserGroups(user: User | null): string[] {
  if (!user?.id_token) {
    return [];
  }

  const decodedToken = decodeJwtToken(user.id_token);
  if (!decodedToken) {
    return [];
  }

  return decodedToken['cognito:groups'] || [];
}

/**
 * Checks if user has a specific group
 */
export function hasGroup(user: User | null, group: string): boolean {
  const groups = getUserGroups(user);
  return groups.includes(group);
}

/**
 * Checks if user is an admin
 */
export function isAdmin(user: User | null): boolean {
  return hasGroup(user, 'admin');
}

/**
 * Checks if user is a regular user
 */
export function isUser(user: User | null): boolean {
  return hasGroup(user, 'user');
}

/**
 * Gets the user's primary role (admin takes precedence)
 */
export function getUserRole(user: User | null): 'admin' | 'user' | 'none' {
  if (isAdmin(user)) {
    return 'admin';
  }
  if (isUser(user)) {
    return 'user';
  }
  return 'none';
} 