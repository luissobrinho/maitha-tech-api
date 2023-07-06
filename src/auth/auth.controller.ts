import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { Public } from '../decorators/is-piblic.decorator';
import { SWAGGER_AUTH_TAG } from '../configs/swagger.config';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { TokenDto } from './dto/token.dto';

@Controller('auth')
@ApiTags(SWAGGER_AUTH_TAG)
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  @Public()
  @ApiOkResponse({
    type: TokenDto,
  })
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Post('sign-up')
  @Public()
  @ApiCreatedResponse({
    type: TokenDto,
  })
  async signUp(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signUp(createUserDto);
  }

  @Post('sign-out')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: TokenDto,
  })
  signOut() {
    return this.authService.signOut();
  }
}
