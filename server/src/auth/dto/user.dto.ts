import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  id: number;
  @ApiProperty({ example: 'user123', description: 'Username' })
  username: string;

  @ApiProperty({ example: 'user@example.com', description: 'Email' })
  email: string;

  @ApiProperty({ example: 'user', description: 'User role (e.g. admin, user)' })
  role: string;
}
