import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/utils/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService) { }

  async validateOAuthLogin(user: any): Promise<{ accessToken: string }> {


    const payload = { sub: user.email, name: `${user.firstName} ${user.lastName}` };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  async loginOrRegister(googleUser: any): Promise<{ accessToken: string }> {
    const { email, firstName, lastName, picture, oauthId  } = googleUser;

    if (!email.endsWith('@ujcv.edu.hn')) {
      throw new UnauthorizedException('Email domain not allowed');
    }

    const defaultRole = await this.prisma.role.findUnique({
      where: { roleName: 'Alumno' },
      select: { roleId: true },
    });

    if (!defaultRole) {
      throw new InternalServerErrorException('No default role defined');
    }

    // Try to find the user
    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    // Create user if not exists
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          oauthProvider: 'google',
          firstName,
          lastName,
          roleId: defaultRole.roleId,
          picture,
          oauthId
        },
      });
    }

    // Generate JWT payload
    const payload = {
      sub: user.userId,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
    };

    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
}