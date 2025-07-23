// rbac.guard.ts
import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, PERMISSIONS_KEY } from './rbac.decorator';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) throw new ForbiddenException('User not authenticated');

    const dbUser = await this.prisma.user.findUnique({
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
