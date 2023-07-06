import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { TokenDto } from './dto/token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signIn(email: string, pass: string): Promise<TokenDto> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const passwordMatch = await bcrypt.compare(pass, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const payload = { sub: user._id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(createUserDto: CreateUserDto): Promise<TokenDto> {
    const { password, ...newUser } = createUserDto;

    const existingUser = await this.usersService.findByEmail(newUser.email);
    if (existingUser) {
      throw new ConflictException('E-mail já está em uso.');
    }

    const hashedPassword = await bcrypt.hash(
      password,
      +this.configService.get('app.salt'),
    );

    const user = await this.usersService.create({
      ...newUser,
      password: hashedPassword,
    });

    const payload = { sub: user._id, email: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signOut(): Promise<TokenDto> {
    return { access_token: this.jwtService.sign({ invalidated: true }) };
  }
}
