import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { JwtUserData } from './login.guard';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject()
  private reflector: Reflector;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const user: JwtUserData | null = request.user;

    if (!user) {
      return true;
    }

    const permissions = user.permissions.map((p) => {
      return p.code;
    });

    const requirePermissions = this.reflector.getAllAndOverride<string[]>(
      'requirePermissions',
      [context.getHandler(), context.getClass()],
    );

    if (!requirePermissions) {
      return true;
    }

    for (const permission of requirePermissions) {
      if (!permissions.includes(permission)) {
        throw new UnauthorizedException('用户没有访问该接口的权限');
      }
    }
    return true;
  }
}
