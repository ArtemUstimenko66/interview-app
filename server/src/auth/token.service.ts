import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUser } from './interfaces/user.interface';
import { ITokenPayload, TOKEN_TYPES } from './interfaces/tokens.interface';
import { JWT_CONSTANTS } from 'src/common/constants/auth.constants';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  createAccessToken(user: IUser): string {
    const payload: ITokenPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      token_type: TOKEN_TYPES.ACCESS,
    };
    return this.jwtService.sign(payload, {
      expiresIn: JWT_CONSTANTS.ACCESS_TOKEN_EXPIRATION,
    });
  }

  createRefreshToken(user: IUser): string {
    const payload: ITokenPayload = {
      sub: user.id,
      token_type: TOKEN_TYPES.REFRESH,
    };
    return this.jwtService.sign(payload, {
      expiresIn: JWT_CONSTANTS.ACCESS_TOKEN_EXPIRATION,
    });
  }

  verifyToken(token: string, type: TOKEN_TYPES): ITokenPayload {
    const payload = this.jwtService.verify<ITokenPayload>(token);
    if (payload.token_type !== type) {
      throw new UnauthorizedException(`Invalid ${type} token`);
    }
    return payload;
  }
}
