import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { UpdatePasswordDto } from './dto/user-password.update.dto';
import { CreateUserDto } from './dto/user.create.dto';
import { IUser } from './user.inrterface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  private users: IUser[] = [];

  async getAll(): Promise<IUser[]> {
    return this.users;
  }

  async getById(id: string): Promise<IUser> {
    const user = this.users.find((user) => id === user.id);
    if (!user) throw new NotFoundException();
    return user;
  }

  async create(userDto: CreateUserDto): Promise<Omit<IUser, 'password'>> {
    if (!userDto.login || !userDto.password) throw new BadRequestException();
    const createTime = Date.now();
    const newUser = {
      id: uuidv4(),
      ...userDto,
      version: 1,
      createdAt: createTime,
      updatedAt: createTime,
    };
    this.users.push(newUser);
    const responseUser = { ...newUser };
    delete responseUser.password;
    return responseUser;
  }

  async remove(id: string): Promise<IUser> {
    const user = this.users.find((user) => id === user.id);
    if (user) {
      this.users = this.users.filter((user) => user.id !== id);
      return;
    }
    throw new NotFoundException();
  }

  async update(
    id: string,
    userDto: UpdatePasswordDto,
  ): Promise<Omit<IUser, 'password'>> {
    const userIndex = this.users.findIndex((user) => id === user.id);
    if (userIndex != -1) {
      if (this.users[userIndex].password !== userDto.oldPassword)
        throw new ForbiddenException('oldPassword is wrong');

      this.users[userIndex].password = userDto.newPassword;
      this.users[userIndex].version += 1;
      this.users[userIndex].updatedAt = Date.now();
      return this.users[userIndex];
    }
    throw new NotFoundException();
  }
}
