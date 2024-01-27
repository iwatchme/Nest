import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { Permission } from 'src/user/dto/login-user.vo';

export interface JwtUserData {
  id: number;
  username: string;
  roles: string[];
  permissions: Permission[];
}

declare module 'express' {
  interface Request {
    user: JwtUserData;
  }
}

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject()
  private reflector: Reflector;

  @Inject(JwtService)
  private readonly jwtService: JwtService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const requireLogin = this.reflector.getAllAndOverride<boolean>(
      'needLogin',
      [context.getHandler(), context.getClass()],
    );

    if (!requireLogin) {
      return true;
    }

    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('用户未登录');
    }

    try {
      const data = this.jwtService.verify<JwtUserData>(authorization);
      const user: JwtUserData = {
        id: data.id,
        username: data.username,
        roles: data.roles,
        permissions: data.permissions,
      };
      request.user = user;
      return true;
    } catch (e) {
      throw new UnauthorizedException('token 已经失效请重新登录');
    }

    return true;
  }
}
