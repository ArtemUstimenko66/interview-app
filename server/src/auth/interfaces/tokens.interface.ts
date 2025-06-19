export enum TOKEN_TYPES {
  ACCESS = 'access_token',
  REFRESH = 'refresh_token',
}

export interface ITokens {
  access_token: string;
  refresh_token: string;
}

export interface ITokenPayload {
  sub: number;
  username?: string;
  role?: string;
  email?: string;
  token_type: TOKEN_TYPES;
}
