import { IsNotEmpty, IsString } from '@nestjs/class-validator';

export class AuthDto {
  @IsNotEmpty()
  @IsString()
  login: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
