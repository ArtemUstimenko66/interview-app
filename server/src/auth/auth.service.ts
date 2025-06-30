import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CookieService } from './cookie.service';
import { IGoogleUser, IUser } from './interfaces/user.interface';
import { ITokens, TOKEN_TYPES } from './interfaces/tokens.interface';
import { TokenService } from './token.service';
import { Request, Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth.response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private readonly cookieService: CookieService,
  ) {}

  async validateUser(email: string, password: string): Promise<IUser | null> {
    const user = await this.userService.findByEmail(email);

    if (user && (await this.verifyPassword(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  private async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async login(user: IUser, res: Response): Promise<AuthResponseDto> {

    const tokens = this.tokenService.generateTokenPair(user);

    this.cookieService.setAuthCookies(res, tokens);

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      user: this.createUserResponse(user),
    };
  }

  async googleLogin(googleUser: IGoogleUser): Promise<ITokens> {
    let user = await this.userService.findByEmail(googleUser.email);

    if (!user) {
      user = await this.userService.create({
        email: googleUser.email,
        username: googleUser.email.split('@')[0],
        firstName: googleUser.firstName,
        lastName: googleUser.lastName,
        picture: googleUser.picture,
        googleId: googleUser.googleId,
      });
    } else if (!user.googleId) {
      // Обновляем существующего пользователя с Google данными
      user.googleId = googleUser.googleId;
      user.firstName = googleUser.firstName;
      user.lastName = googleUser.lastName;
      user.picture = googleUser.picture;
      user = await this.userService.update(user.id, user);
    }

    return this.tokenService.generateTokenPair(user);
  }
  
  async register(createUserDto: RegisterDto, res: Response): Promise<AuthResponseDto> {
    try {
      await this.validateUserDoesNotExist(createUserDto);
      const user = await this.userService.create(createUserDto);
      const { password, ...userData } = user;

      return this.login(userData, res);
    } catch (error) {
      this.handleRegistrationError(error);
    }
  }

  private createUserResponse(user: IUser): IUser {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
  }

  private async validateUserDoesNotExist(createUserDto: RegisterDto): Promise<void> {
    const existingUser = await this.userService.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('A user with this email already exists.');
    }

    const existingUsername = await this.userService.findByUsername(createUserDto.username);
    if (existingUsername) {
      throw new ConflictException('A user with this username already exists.');
    }
  }

  private handleRegistrationError(error: unknown): never {
    if (error instanceof ConflictException) {
      throw error;
    }
    throw new InternalServerErrorException('Error while registering user');
  }

  async refreshToken(req: Request, res: Response): Promise<AuthResponseDto> {
    try {
      const refreshToken = req.cookies['refresh_token'];
      if (!refreshToken) {
        throw new UnauthorizedException('Refresh token missing');
      }
      const payload = this.tokenService.verifyToken(refreshToken, TOKEN_TYPES.REFRESH);
      const user = await this.userService.findById(payload.sub);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return this.login(user, res);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(res: Response) : Promise<void> { 
    this.cookieService.clearAuthCookies(res);
  }
}
