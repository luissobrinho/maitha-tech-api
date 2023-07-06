import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { UserDocument } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}

  async findAll(): Promise<UserDocument[]> {
    return this.userRepository.findAll();
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado!');
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument> {
    return this.userRepository.findByEmail(email);
  }

  async create(user: CreateUserDto): Promise<UserDocument> {
    return this.userRepository.create(user);
  }

  async update(id: string, user: UpdateUserDto): Promise<UserDocument> {
    await this.findById(id);
    return await this.userRepository.update(id, user);
  }

  async delete(id: string): Promise<UserDocument> {
    await this.findById(id);
    return await this.userRepository.delete(id);
  }
}
