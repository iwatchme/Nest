import {
  SetMetadata,
  createParamDecorator,
  ExecutionContext,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';

export const RequireLogin = () => SetMetadata('needLogin', true);

export const RequirePermission = (...permissions: string[]) =>
  SetMetadata('requirePermissions', permissions);

export const UserInfo = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest<Request>();

    if (!request.user) {
      return null;
    }
    return data ? request.user[data] : request.user;
  },
);

export function generateParseIntPipe(name: string) {
  return new ParseIntPipe({
    exceptionFactory() {
      throw new BadRequestException(name + ' 应该传数字');
    },
  });
}
