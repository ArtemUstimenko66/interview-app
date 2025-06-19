import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { TokenService } from './token.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JWT_CONSTANTS } from 'src/common/constants/auth.constants';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: JWT_CONSTANTS.ACCESS_TOKEN_EXPIRATION,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, TokenService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, TokenService],
})
export class AuthModule {}
