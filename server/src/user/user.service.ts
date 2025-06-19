import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JWT_CONSTANTS } from 'src/common/constants/auth.constants';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    await this.validateUniqueUser(createUserDto);

    const hashedPassword = await this.hashPassword(createUserDto.password);
    const user = this.createUserEntity(createUserDto, hashedPassword);

    return this.userRepository.save(user);
  }

  private async validateUniqueUser(createUserDto: CreateUserDto): Promise<void> {
    const existingUser = await this.userRepository.findOne({
      where: [{ email: createUserDto.email }, { username: createUserDto.username }],
    });

    if (existingUser) {
      throw new ConflictException('A user with this email or username already exists');
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, JWT_CONSTANTS.SALT_ROUNDS);
  }

  private createUserEntity(createUserDto: CreateUserDto, hashedPassword: string): User {
    return this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
}
