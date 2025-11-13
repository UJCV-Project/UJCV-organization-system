// rbac.guard.ts
import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, PERMISSIONS_KEY } from './rbac.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';

type AuthRequest = Request & { user?: any };

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Allow bypass for Swagger testing when env var is set
    const skipSwaggerAuth = String(process.env.SKIP_AUTH_FOR_SWAGGER || '').toLowerCase() === 'true';
    const req = context.switchToHttp().getRequest<AuthRequest>();
    const path = req?.path || req?.originalUrl || '';
    if (skipSwaggerAuth && path.startsWith('/api')) {
      return true;
    }

    return true;

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = req;
    const user = request.user;

    if (!user) throw new ForbiddenException('User not authenticated');

    const dbUser = await (this.prisma as any).user.findUnique({
      where: { userId: user.id },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!dbUser || !dbUser.role) throw new ForbiddenException('Role not assigned');

    // Check role
    if (requiredRoles?.length && !requiredRoles.includes(dbUser.role.roleName)) {
      throw new ForbiddenException('Insufficient role');
    }

    // Check permission
    if (
      requiredPermissions?.length &&
      !requiredPermissions.some((perm) =>
        dbUser.role.permissions.map((p) => p.permission.permissionName).includes(perm),
      )
    ) {
      throw new ForbiddenException('Insufficient permission');
    }

    return true;
  }
}
