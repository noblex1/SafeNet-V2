/**
 * Token Storage Utilities
 * Uses localStorage for web (not as secure as mobile, but sufficient for admin dashboard)
 */

const TOKEN_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
} as const;

export const storeAccessToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, token);
};

export const storeRefreshToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, token);
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
};

export const storeTokens = (tokens: { accessToken: string; refreshToken: string }): void => {
  storeAccessToken(tokens.accessToken);
  storeRefreshToken(tokens.refreshToken);
};

export const clearTokens = (): void => {
  localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
};

export const isAuthenticated = (): boolean => {
  return getAccessToken() !== null;
};
