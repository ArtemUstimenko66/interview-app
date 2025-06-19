import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { ITokenPayload, TOKEN_TYPES } from '../interfaces/tokens.interface';
import { IUser } from '../interfaces/user.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(req) => req?.cookies?.['access_token']]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'token-my',
    });
  }

  async validate(payload: ITokenPayload): Promise<IUser> {
    if (payload.token_type !== TOKEN_TYPES.ACCESS) {
      throw new UnauthorizedException('Invalid token type');
    }

    const user = await this.userService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { password, ...result } = user;
    return result;
  }
}
