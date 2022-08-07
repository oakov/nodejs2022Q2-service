import {
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '../users/dto/user.create.dto';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}
  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }
  async getTokens(id: string, login: string) {
    const jwtPayload: JwtPayload = { id, login };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: process.env.TOKEN_EXPIRE_TIME,
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
      }),
    ]);
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async signup(dto: CreateUserDto) {
    const hashed = await this.hashData(dto.password);
    const newUser = await this.prismaService.user.create({
      data: {
        id: uuid(),
        login: dto.login,
        password: hashed,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        version: 1,
      },
    });

    const tokens = await this.getTokens(newUser.id, newUser.login);
    await this.updateRtHash(newUser.id, tokens.refreshToken);
    return tokens;
  }

  async updateRtHash(id: string, refreshToken: string) {
    const hash = await this.hashData(refreshToken);
    await this.prismaService.user.update({
      where: {
        id: id,
      },
      data: {
        hashedRT: hash,
      },
    });
  }

  async login(dto: AuthDto) {
    const user = await this.prismaService.user.findFirst({
      where: {
        login: dto.login,
      },
    });

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!user || !passwordMatches)
      throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.login);
    await this.updateRtHash(user.id, tokens.refreshToken);
    return tokens;
  }

  async refreshTokens(id: string, refreshToken: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: id },
    });

    if (!user || !user.hashedRT) throw new ForbiddenException('Access denied');
    const rtMatches = await bcrypt.compare(refreshToken, user.hashedRT);
    if (!rtMatches) throw new ForbiddenException('Access denied');
    const tokens = await this.getTokens(user.id, user.login);
    await this.updateRtHash(user.id, tokens.refreshToken);
    return tokens;
  }

  async refresh(refreshToken: string) {
    try {
      const request = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      });
      const id = request['id'];
      return this.refreshTokens(id, refreshToken);
    } catch (error) {
      if (error.message === 'invalid signature') {
        throw new ForbiddenException(error.message);
      }
      throw new UnauthorizedException('ba');
    }
  }

  verifyAccessToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET_KEY,
      });
    } catch {
      throw new ForbiddenException();
    }
  }
}
