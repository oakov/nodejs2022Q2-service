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
  constructor(private prismaService: PrismaService) {}

  async getAll(): Promise<IUser[]> {
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
    const user = await this.prismaService.user.findUnique({
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
    if (!user) throw new NotFoundException();
    return user;
  }

  async create(userDto: CreateUserDto): Promise<Omit<IUser, 'password'>> {
    if (!userDto.login || !userDto.password) throw new BadRequestException();

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
    try {
      const deletedUser = await this.prismaService.user.delete({
        where: {
          id: id,
        },
      });
      return deletedUser;
    } catch (e) {
      throw new NotFoundException();
    }
  }

  async update(
    id: string,
    userDto: UpdatePasswordDto,
  ): Promise<Omit<IUser, 'password'>> {
    if (userDto.oldPassword !== (await this.getById(id)).password)
      throw new ForbiddenException();
    try {
      const updateUser: IUser = await this.prismaService.user.update({
        where: {
          id: id,
        },
        data: {
          password: userDto.newPassword,
          version: { increment: 1 },
          updatedAt: Date.now(),
        },
      });

      return {
        id: updateUser.id,
        login: updateUser.login,
        version: updateUser.version,
        createdAt: new Date(updateUser.createdAt).valueOf(),
        updatedAt: new Date(updateUser.updatedAt).valueOf(),
      };
    } catch (e) {
      throw new NotFoundException();
    }
  }
}
