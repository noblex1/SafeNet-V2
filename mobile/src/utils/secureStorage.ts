/**
 * Secure Storage Utilities
 * Handles secure storage of authentication tokens using Expo SecureStore
 */

import * as SecureStore from 'expo-secure-store';

const TOKEN_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
} as const;

/**
 * Store access token securely
 */
export const storeAccessToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(TOKEN_KEYS.ACCESS_TOKEN, token);
  } catch (error) {
    console.error('Error storing access token:', error);
    throw error;
  }
};

/**
 * Store refresh token securely
 */
export const storeRefreshToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(TOKEN_KEYS.REFRESH_TOKEN, token);
  } catch (error) {
    console.error('Error storing refresh token:', error);
    throw error;
  }
};

/**
 * Get access token from secure storage
 */
export const getAccessToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEYS.ACCESS_TOKEN);
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
};

/**
 * Get refresh token from secure storage
 */
export const getRefreshToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
};

/**
 * Store both tokens
 */
export const storeTokens = async (tokens: { accessToken: string; refreshToken: string }): Promise<void> => {
  await Promise.all([
    storeAccessToken(tokens.accessToken),
    storeRefreshToken(tokens.refreshToken),
  ]);
};

/**
 * Clear all stored tokens
 */
export const clearTokens = async (): Promise<void> => {
  try {
    await Promise.all([
      SecureStore.deleteItemAsync(TOKEN_KEYS.ACCESS_TOKEN),
      SecureStore.deleteItemAsync(TOKEN_KEYS.REFRESH_TOKEN),
    ]);
  } catch (error) {
    console.error('Error clearing tokens:', error);
  }
};

/**
 * Check if user is authenticated (has tokens)
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const accessToken = await getAccessToken();
  return accessToken !== null;
};
