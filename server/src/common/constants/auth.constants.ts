export const JWT_CONSTANTS = {
  ACCESS_TOKEN_EXPIRATION: '15m',
  REFRESH_TOKEN_EXPIRATION: '7d',
  SALT_ROUNDS: 10,
} as const;

export const TOKEN_TYPES = {
  ACCESS: 'access',
  REFRESH: 'refresh',
} as const;
