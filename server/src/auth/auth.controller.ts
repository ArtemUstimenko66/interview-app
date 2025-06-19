import { Controller, Post, UseGuards, Body, Get, Res, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { IUser } from './interfaces/user.interface';
import { RolesGuard } from './guards/roles.guard';
import { Response, Request } from 'express';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth.response.dto';
import { LoginDto } from './dto/login.dto';
import { UserDto } from './dto/user.dto';

interface RequestWithUser extends Request {
  user: IUser;
}

interface RequestWithCookies extends Request {
  cookies: { [key: string]: string };
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Successful login',
    type: AuthResponseDto,
  })
  async login(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    return this.authService.login(req.user, res);
  }

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'Successful registration',
    type: AuthResponseDto,
  })
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    return this.authService.register(registerDto, res);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh tokens' })
  @ApiResponse({
    status: 200,
    description: 'Tokens refreshed',
    type: AuthResponseDto,
  })
  async refreshToken(
    @Req() req: RequestWithCookies,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    return this.authService.refreshToken(req, res);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'User profile', type: UserDto })
  getProfile(@Req() req: RequestWithUser) {
    return req.user;
  }

  @Post('logout')
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Successfully logged out' })
  async logout(@Res({ passthrough: true }) res: Response): Promise<{ message: string }> {
    await this.authService.logout(res);
    return { message: 'Successfully logged out' };
  }

}
