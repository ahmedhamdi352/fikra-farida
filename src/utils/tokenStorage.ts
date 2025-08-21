// Simple in-memory storage for temporary token storage
// In production, you might want to use Redis or a database
const tokenStorage = new Map<string, { token: string; timestamp: number }>();

// Store token with expiration (1 hour)
export function storeUserToken(orderId: string, token: string): void {
  console.log(`📝 Storing token for orderId: ${orderId}`);
  console.log(`📝 Current storage size before: ${tokenStorage.size}`);
  
  tokenStorage.set(orderId, {
    token,
    timestamp: Date.now()
  });
  
  console.log(`📝 Current storage size after: ${tokenStorage.size}`);
  console.log(`📝 All stored order IDs: ${Array.from(tokenStorage.keys()).join(', ')}`);
  
  // Clean up expired tokens (older than 1 hour)
  const oneHour = 60 * 60 * 1000;
  for (const [key, value] of tokenStorage.entries()) {
    if (Date.now() - value.timestamp > oneHour) {
      tokenStorage.delete(key);
      console.log(`🗑️ Cleaned up expired token for orderId: ${key}`);
    }
  }
}

// Retrieve and remove token
export function getUserToken(orderId: string): string | null {
  console.log(`🔍 Looking for token with orderId: ${orderId}`);
  console.log(`🔍 Current storage size: ${tokenStorage.size}`);
  console.log(`🔍 All stored order IDs: ${Array.from(tokenStorage.keys()).join(', ')}`);
  
  const stored = tokenStorage.get(orderId);
  if (!stored) {
    console.log(`❌ No token found for orderId: ${orderId}`);
    return null;
  }
  
  console.log(`✅ Found token for orderId: ${orderId}, stored at: ${new Date(stored.timestamp).toISOString()}`);
  
  // Check if token is expired (1 hour)
  const oneHour = 60 * 60 * 1000;
  const age = Date.now() - stored.timestamp;
  console.log(`⏰ Token age: ${Math.round(age / 1000 / 60)} minutes`);
  
  if (age > oneHour) {
    console.log(`⏰ Token expired (older than 1 hour)`);
    tokenStorage.delete(orderId);
    return null;
  }
  
  // Remove token after use for security
  tokenStorage.delete(orderId);
  console.log(`🔒 Token retrieved and removed for security`);
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
