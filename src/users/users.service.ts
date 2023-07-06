import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './users.repository';
import { UserDocument } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {}

  async findAll(user: UserDto): Promise<UserDocument[]> {
    return this.userRepository.findAll(user);
  }

  async findById(owner: UserDto, id: string): Promise<UserDocument> {
    const user = await this.userRepository.findById(owner, id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado!');
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument> {
    return this.userRepository.findByEmail(email);
  }

  async create(owner: UserDto, user: CreateUserDto): Promise<UserDocument> {
    const existingUser = await this.findByEmail(user.email);
    if (existingUser) {
      throw new ConflictException('E-mail já está em uso.');
    }

    const hashedPassword = await bcrypt.hash(
      user.password,
      +this.configService.get('app.salt'),
    );

    return this.userRepository.create({
      userId: owner?._id,
      ...user,
      password: hashedPassword,
    });
  }

  async update(
    owner: UserDto,
    id: string,
    user: UpdateUserDto,
  ): Promise<UserDocument> {
    await this.findById(owner, id);
    return await this.userRepository.update(id, user);
  }

  async delete(owner: UserDto, id: string): Promise<UserDocument> {
    await this.findById(owner, id);
    return await this.userRepository.delete(id);
  }
}
