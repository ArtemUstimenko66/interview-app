import { Controller, Post, UseGuards, Body, Get, Res, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { IGoogleUser, IUser } from './interfaces/user.interface';
import { RolesGuard } from './guards/roles.guard';
import { Response, Request } from 'express';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth.response.dto';
import { LoginDto } from './dto/login.dto';
import { UserDto } from './dto/user.dto';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { CookieService } from './cookie.service';
import { ConfigService } from '@nestjs/config';

interface RequestWithUser extends Request {
  user: IUser;
}

interface RequestWithCookies extends Request {
  cookies: { [key: string]: string };
}

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
    private readonly configService: ConfigService,
  ) {}

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

  //Google 

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(): Promise<void> {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(
    @Res() res: Response, 
    @Req() req: { user: IGoogleUser }
  ) {
    const tokens = await this.authService.googleLogin(req.user);

    this.cookieService.setAuthCookies(res, tokens);
    
    const frontendUrl = this.configService.get('FRONTEND_URL');

    return res.redirect(`${frontendUrl}/profile`);
  }
}
