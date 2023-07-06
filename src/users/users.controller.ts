import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SWAGGER_USER_TAG } from '../configs/swagger.config';
import { UserDto } from './dto/user.dto';
import { TransformInterceptor } from '../interceptors/transform-interceptor/transform.interceptor';

@Controller('users')
@ApiTags(SWAGGER_USER_TAG)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(new TransformInterceptor<UserDto>(UserDto))
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseInterceptors(new TransformInterceptor<UserDto>(UserDto))
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseInterceptors(new TransformInterceptor<UserDto>(UserDto))
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @UseInterceptors(new TransformInterceptor<UserDto>(UserDto))
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseInterceptors(new TransformInterceptor<UserDto>(UserDto))
  remove(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
