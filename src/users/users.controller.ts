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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SWAGGER_USER_TAG } from '../configs/swagger.config';
import { UserDto } from './dto/user.dto';
import { TransformInterceptor } from '../interceptors/transform-interceptor/transform.interceptor';
import { User } from '../decorators/user.decorator';

@Controller('users')
@ApiTags(SWAGGER_USER_TAG)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(new TransformInterceptor<UserDto>(UserDto))
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created',
    type: UserDto,
  })
  create(@User() user: UserDto, @Body() createUserDto: CreateUserDto) {
    return this.usersService.create(user, createUserDto);
  }

  @Get()
  @UseInterceptors(new TransformInterceptor<UserDto>(UserDto))
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Returns all users',
    type: [UserDto],
  })
  findAll(@User() user: UserDto) {
    return this.usersService.findAll(user);
  }

  @Get(':id')
  @UseInterceptors(new TransformInterceptor<UserDto>(UserDto))
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the user with the specified ID',
    type: UserDto,
  })
  findOne(@User() user: UserDto, @Param('id') id: string) {
    return this.usersService.findById(user, id);
  }

  @Patch(':id')
  @UseInterceptors(new TransformInterceptor<UserDto>(UserDto))
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated',
    type: UserDto,
  })
  update(
    @User() user: UserDto,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(user, id, updateUserDto);
  }

  @Delete(':id')
  @UseInterceptors(new TransformInterceptor<UserDto>(UserDto))
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted',
    type: UserDto,
  })
  remove(@User() user: UserDto, @Param('id') id: string) {
    return this.usersService.delete(user, id);
  }
}
