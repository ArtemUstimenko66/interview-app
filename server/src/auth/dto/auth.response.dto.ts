import { ApiProperty } from '@nestjs/swagger';
import { IUser } from '../interfaces/user.interface';
import { UserDto } from './user.dto';

export class AuthResponseDto {
  @ApiProperty({
    description: 'Access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR...',
  })
  access_token: string;
  @ApiProperty({
    description: 'Refresh token',
    example: 'eyJhbGciOiJIUzI1NiIsInR...',
  })
  refresh_token: string;
  @ApiProperty({ type: UserDto })
  user: IUser;
}
