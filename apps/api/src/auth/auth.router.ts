import { UnauthorizedException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { Ctx, Input, Mutation, Query, Router } from 'nestjs-trpc';
import { z } from 'zod';

import { AuthService } from './auth.service';

type AuthRequest = Request & {
  cookies: {
    session?: string;
  };
};

const registerInput = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(8),
});

const loginInput = z.object({
  email: z.email(),
  password: z.string(),
});

@Router({ alias: 'auth' })
export class AuthRouter {
  constructor(private readonly authService: AuthService) {}

  @Mutation({ input: registerInput })
  register(@Input() input: z.infer<typeof registerInput>) {
    return this.authService.register(input.name, input.email, input.password);
  }

  @Mutation({ input: loginInput })
  async login(
    @Input() input: z.infer<typeof loginInput>,
    @Ctx() context: Record<string, unknown>,
  ) {
    const result = await this.authService.login(input.email, input.password);

    const res = context.res as Response;

    res.cookie('session', result.token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
    });

    return result.user;
  }

  @Query()
  me(@Ctx() context: Record<string, unknown>) {
    const req = context.req as AuthRequest;

    const token = req.cookies.session;

    if (!token) {
      throw new UnauthorizedException('Not logged in');
    }

    return this.authService.me(token);
  }
}
