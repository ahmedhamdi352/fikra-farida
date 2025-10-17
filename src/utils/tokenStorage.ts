import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

// Persistent file-based storage for serverless environments
const STORAGE_DIR = '/tmp/token-storage';
const STORAGE_FILE = join(STORAGE_DIR, 'tokens.json');

// Ensure storage directory exists
if (!existsSync(STORAGE_DIR)) {
  mkdirSync(STORAGE_DIR, { recursive: true });
}

interface TokenData {
  token: string;
  timestamp: number;
}

type TokenStorage = Record<string, TokenData>;

// Load tokens from file
function loadTokens(): TokenStorage {
  try {
    if (existsSync(STORAGE_FILE)) {
      const data = readFileSync(STORAGE_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading tokens:', error);
  }
  return {};
}

// Save tokens to file
function saveTokens(tokens: TokenStorage): void {
  try {
    writeFileSync(STORAGE_FILE, JSON.stringify(tokens, null, 2));
  } catch (error) {
    console.error('Error saving tokens:', error);
  }
}

// Store token with expiration (1 hour)
export function storeUserToken(orderId: string, token: string): void {

  const tokens = loadTokens();
  
  tokens[orderId] = {
    token,
    timestamp: Date.now()
  };
  
  // Clean up expired tokens (older than 1 hour)
  const oneHour = 60 * 60 * 1000;
  const now = Date.now();
  for (const [key, value] of Object.entries(tokens)) {
    if (now - value.timestamp > oneHour) {
      delete tokens[key];

    }
  }
  
  saveTokens(tokens);
  
}

// Retrieve and remove token
export function getUserToken(orderId: string): string | null {
  const tokens = loadTokens();
  
  const stored = tokens[orderId];
  if (!stored) {
    return null;
  }
  
  
  // Check if token is expired (1 hour)
  const oneHour = 60 * 60 * 1000;
  const age = Date.now() - stored.timestamp;
  
  if (age > oneHour) {
    delete tokens[orderId];
    saveTokens(tokens);
    return null;
  }
  
  // Remove token after use for security
  delete tokens[orderId];
  saveTokens(tokens);
  return stored.token;
}

// Clean up expired tokens periodically (serverless functions don't need setInterval)
// Cleanup happens automatically when storing/retrieving tokens
