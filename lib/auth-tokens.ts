/**
 * Client-side token management utilities
 */

const TOKEN_KEY = 'auth_token';

/**
 * Store auth token in localStorage
 */
export function setAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

/**
 * Get auth token from localStorage
 */
export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

/**
 * Remove auth token from localStorage
 */
export function removeAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: string): boolean {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiryTime = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expiryTime;
  } catch (e) {
    return true;
  }
}

/**
 * Refresh the access token using the refresh token in cookies
 */
export async function refreshAccessToken(): Promise<string | null> {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include', // Important: sends cookies with the request
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    
    if (data.token) {
      setAuthToken(data.token);
      return data.token;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    removeAuthToken();
    return null;
  }
}

/**
 * Get auth headers for API requests
 */
export function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Fetch with authentication
 * Automatically handles token refresh if needed
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  let token = getAuthToken();

  // Check if token exists and is expired
  if (token && isTokenExpired(token)) {
    // Try to refresh the token
    token = await refreshAccessToken();
    if (!token) {
      throw new Error('Session expired. Please log in again.');
    }
  }

  // Merge headers
  const headers = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // Make the request with auth headers
  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response;
}