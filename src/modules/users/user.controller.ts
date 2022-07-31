import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Body,
  Delete,
  HttpCode,
  Put,
} from '@nestjs/common';
import { CreateUserDto } from './dto/user.create.dto';
import { UpdatePasswordDto } from './dto/user-password.update.dto';
import { IUser } from './user.inrterface';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  getAll(): Promise<IUser[]> {
    return this.usersService.getAll();
  }

  @Get(':id')
  getById(@Param('id', new ParseUUIDPipe()) id: string): Promise<IUser> {
    return this.usersService.getById(id);
  }

  @Post()
  create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<Omit<IUser, 'password'>> {
    return this.usersService.create(createUserDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<IUser> {
    return this.usersService.remove(id);
  }

  @Put(':id')
  update(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<Omit<IUser, 'password'>> {
    return this.usersService.update(id, updatePasswordDto);
  }
}
