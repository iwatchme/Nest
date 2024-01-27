import { SetMetadata } from '@nestjs/common';

export const RequireLogin = () => SetMetadata('needLogin', true);

export const RequirePermission = (...permissions: string[]) =>
  SetMetadata('requirePermissions', permissions);
