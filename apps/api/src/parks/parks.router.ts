import type { Request } from 'express';
import { Ctx, Input, Mutation, Query, Router } from 'nestjs-trpc';
import { z } from 'zod';

import { AuthService } from '../auth/auth.service';
import { ParksService } from './parks.service';
import { TRPCError } from '@trpc/server';

type AuthRequest = Request & {
  cookies: {
    session?: string;
  };
};

const parkInput = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  openingDate: z.string().nullable().optional(),
  cityId: z.number().int().positive(),
  latitude: z.number(),
  longitude: z.number(),
  polygon: z.unknown().optional(),
});

const byIdInput = z.object({
  id: z.number().int().positive(),
});

const updateInput = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  openingDate: z.string().nullable().optional(),
  cityId: z.number().int().positive().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  polygon: z.unknown().optional(),
});

@Router({ alias: 'parks' })
export class ParksRouter {
  constructor(
    private readonly parksService: ParksService,
    private readonly authService: AuthService,
  ) {}

  @Query()
  list() {
    return this.parksService.list();
  }

  @Query({ input: byIdInput })
  byId(@Input() input: z.infer<typeof byIdInput>) {
    return this.parksService.byId(input.id);
  }

  @Mutation({ input: parkInput })
  async create(
    @Input() input: z.infer<typeof parkInput>,
    @Ctx() context: Record<string, unknown>,
  ) {
    const user = await this.getCurrentUser(context);

    return this.parksService.create(user.id, input);
  }

  @Mutation({ input: updateInput })
  async update(
    @Input() input: z.infer<typeof updateInput>,
    @Ctx() context: Record<string, unknown>,
  ) {
    const user = await this.getCurrentUser(context);

    const { id, ...updates } = input;

    return this.parksService.update(id, user.id, updates);
  }

  @Mutation({ input: byIdInput })
  async delete(
    @Input() input: z.infer<typeof byIdInput>,
    @Ctx() context: Record<string, unknown>,
  ) {
    const user = await this.getCurrentUser(context);

    return this.parksService.delete(input.id, user.id);
  }

  private async getCurrentUser(context: Record<string, unknown>) {
    const req = context.req as AuthRequest;

    const token = req.cookies.session;

    if (!token) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Not logged in',
      });
    }

    return this.authService.me(token);
  }
}
