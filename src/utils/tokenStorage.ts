// Simple in-memory storage for temporary token storage
// In production, you might want to use Redis or a database
const tokenStorage = new Map<string, { token: string; timestamp: number }>();

// Store token with expiration (1 hour)
export function storeUserToken(orderId: string, token: string): void {
  tokenStorage.set(orderId, {
    token,
    timestamp: Date.now()
  });
  
  // Clean up expired tokens (older than 1 hour)
  const oneHour = 60 * 60 * 1000;
  for (const [key, value] of tokenStorage.entries()) {
    if (Date.now() - value.timestamp > oneHour) {
      tokenStorage.delete(key);
    }
  }
}

// Retrieve and remove token
export function getUserToken(orderId: string): string | null {
  const stored = tokenStorage.get(orderId);
  if (!stored) {
    return null;
  }
  
  // Check if token is expired (1 hour)
  const oneHour = 60 * 60 * 1000;
  if (Date.now() - stored.timestamp > oneHour) {
    tokenStorage.delete(orderId);
    return null;
  }
  
  // Remove token after use for security
  tokenStorage.delete(orderId);
  return stored.token;
}

// Clean up expired tokens periodically
setInterval(() => {
  const oneHour = 60 * 60 * 1000;
  for (const [key, value] of tokenStorage.entries()) {
    if (Date.now() - value.timestamp > oneHour) {
      tokenStorage.delete(key);
    }
  }
}, 15 * 60 * 1000); // Clean up every 15 minutes
