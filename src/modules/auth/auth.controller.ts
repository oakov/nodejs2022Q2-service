import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/user.create.dto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signup: CreateUserDto) {
    return this.authService.signup(signup);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() login: AuthDto) {
    return this.authService.login(login);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @HttpCode(HttpStatus.CREATED)
  async refresh(@Body() { refreshToken }) {
    return this.authService.refresh(refreshToken);
  }
}
