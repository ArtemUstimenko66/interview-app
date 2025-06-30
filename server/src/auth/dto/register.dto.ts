import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

export class RegisterDto implements Partial<CreateUserDto> {
  @ApiProperty({ example: 'user123', description: 'Unique username' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'user@example.com', description: 'Unique email' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: 'Password for the account',
  })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
