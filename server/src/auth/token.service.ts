import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUser } from './interfaces/user.interface';
import { ITokenPayload, TOKEN_TYPES } from './interfaces/tokens.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  createAccessToken(user: IUser): string {
    const payload: ITokenPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      token_type: TOKEN_TYPES.ACCESS,
    };
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION') 
    });
  }

  createRefreshToken(user: IUser): string {
    const payload: ITokenPayload = {
      sub: user.id,
      token_type: TOKEN_TYPES.REFRESH,
    };
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION') 

    });
  }

  verifyToken(token: string, expectedType: TOKEN_TYPES): ITokenPayload {
    const payload = this.jwtService.verify<ITokenPayload>(token);
    if (payload.token_type !== expectedType) {
      throw new UnauthorizedException(`Invalid ${expectedType} token`);
    }
    return payload;
  }

  generateTokenPair(user: IUser): { access_token: string; refresh_token: string } {
    return {
      access_token: this.createAccessToken(user),
      refresh_token: this.createRefreshToken(user),
    };
  }
}
