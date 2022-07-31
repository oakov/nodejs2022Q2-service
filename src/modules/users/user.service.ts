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
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  private users: IUser[] = [];
  constructor(private prismaService: PrismaService) {}

  async getAll(): Promise<IUser[]> {
    // return this.users;
    return this.prismaService.user.findMany({
      select: {
        id: true,
        login: true,
        password: true,
        createdAt: true,
        updatedAt: true,
        version: true,
      },
    });
  }

  async getById(id: string): Promise<IUser> {
    return await this.prismaService.user.findUnique({
      where: { id },
      select: {
        id: true,
        login: true,
        password: true,
        createdAt: true,
        updatedAt: true,
        version: true,
      },
    });
  }

  async create(userDto: CreateUserDto): Promise<Omit<IUser, 'password'>> {
    if (!userDto.login || !userDto.password) throw new BadRequestException();
    // const createTime = Date.now();
    // const newUser = {
    //   id: uuidv4(),
    //   ...userDto,
    //   version: 1,
    //   createdAt: createTime,
    //   updatedAt: createTime,
    // };
    // this.users.push(newUser);
    // const responseUser = { ...newUser };
    // delete responseUser.password;
    // return responseUser;

    const newUser = await this.prismaService.user.create({
      data: {
        id: uuidv4(),
        login: userDto.login,
        password: userDto.password,
        version: 1,
        createdAt: new Date().valueOf(),
        updatedAt: new Date().valueOf(),
      },
    });
    const responseUser = { ...newUser };
    delete responseUser.password;
    return responseUser;
  }

  async remove(id: string): Promise<IUser> {
    const deletedUser = await this.prismaService.user.delete({
      where: {
        id: id,
      },
    });
    return deletedUser;
  }

  async update(
    id: string,
    userDto: UpdatePasswordDto,
  ): Promise<Omit<IUser, 'password'>> {
    // const userIndex = this.users.findIndex((user) => id === user.id);
    // if (userIndex != -1) {
    //   if (this.users[userIndex].password !== userDto.oldPassword)
    //     throw new ForbiddenException('oldPassword is wrong');

    //   this.users[userIndex].password = userDto.newPassword;
    //   this.users[userIndex].version += 1;
    //   this.users[userIndex].updatedAt = Date.now();

    //   const responceUser: IUser = { ...this.users[userIndex] };
    //   delete responceUser.password;
    //   return responceUser;
    // }
    // throw new NotFoundException();
    const updateUser: IUser = await this.prismaService.user.update({
      where: {
        id: id,
      },
      data: {
        password: userDto.newPassword,
        version: { increment: 1 },
      },
    });

    return {
      id: updateUser.id,
      login: updateUser.login,
      version: updateUser.version,
      createdAt: new Date(updateUser.createdAt).valueOf(),
      updatedAt: new Date(updateUser.updatedAt).valueOf(),
    };
  }
}
