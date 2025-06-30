import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { CookieTokens } from './interfaces/cookie.interface';

@Injectable()
export class CookieService {
  constructor(private readonly configService: ConfigService) {}

  setAuthCookies(res: Response, tokens: CookieTokens): void {
    const baseOptions = this.getBaseCookieOptions();

    res.cookie('access_token', tokens.access_token, {
      ...baseOptions,
      maxAge: 15 * 60 * 1000, // 15m
    });

    res.cookie('refresh_token', tokens.refresh_token, {
      ...baseOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
    });
  }

  clearAuthCookies(res: Response): void {
    const baseOptions = this.getBaseCookieOptions();

    res.clearCookie('access_token', baseOptions);
    res.clearCookie('refresh_token', baseOptions);
  }

  private getBaseCookieOptions() {
    const isProduction = this.configService.get('NODE_ENV') === 'production';
    
    return {
      httpOnly: true,
      secure: isProduction, // true только в продакшене (HTTPS)
      sameSite: 'strict' as const,
      path: '/',
    };
  }
}
