import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { Public } from '../decorators/is-piblic.decorator';
import { SWAGGER_AUTH_TAG } from '../configs/swagger.config';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { TokenDto } from './dto/token.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('auth')
@ApiTags(SWAGGER_AUTH_TAG)
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  @Public()
  @ApiOperation({ summary: 'Sign in to the application' })
  @ApiBody({ type: SignInDto })
  @ApiResponse({
    status: 200,
    description: 'Sign in successful',
    type: TokenDto,
  })
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Post('sign-up')
  @Public()
  @ApiOperation({ summary: 'Sign up for a new account' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'Account created successfully',
    type: TokenDto,
  })
  async signUp(@Body() signUpDto: SignUpDto) {
    return await this.authService.signUp(signUpDto);
  }

  @Post('sign-out')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'Sign out successful',
    type: TokenDto,
  })
  @ApiOperation({ summary: 'Sign out from the application' })
  signOut() {
    return this.authService.signOut();
  }
}
