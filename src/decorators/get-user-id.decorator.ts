import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUserId = createParamDecorator(
  (data, ctx: ExecutionContext): string => {
    return ctx.switchToHttp().getRequest().currentUser.user_id;
  },
);
