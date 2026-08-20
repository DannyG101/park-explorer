import { TRPCError } from '@trpc/server';
import { Ctx, Input, Mutation, Query, Router } from 'nestjs-trpc';
import { z } from 'zod';

import type { AppContextType } from '../trpc/trpc.context';
import { loginInput, registerInput } from './auth.schema';
import { AuthService } from './auth.service';

const SEVEN_DAYS_IN_MS = 7 * 24 * 60 * 60 * 1000;

@Router({ alias: 'auth' })
export class AuthRouter {
  constructor(private readonly authService: AuthService) {}

  @Mutation({ input: registerInput })
  register(@Input() input: z.infer<typeof registerInput>) {
    return this.authService.register(input);
  }

  @Mutation({ input: loginInput })
  async login(
    @Input() input: z.infer<typeof loginInput>,
    @Ctx() context: AppContextType,
  ) {
    const result = await this.authService.login(input);

    context.res.cookie('session', result.token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: SEVEN_DAYS_IN_MS,
    });

    return result.user;
  }

  @Query()
  me(@Ctx() context: AppContextType) {
    const token = context.req.cookies.session;

    if (!token) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Not logged in',
      });
    }

    return this.authService.me(token);
  }
}
