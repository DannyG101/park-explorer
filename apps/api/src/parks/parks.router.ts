import { TRPCError } from '@trpc/server';
import { Ctx, Input, Mutation, Query, Router } from 'nestjs-trpc';
import { z } from 'zod';

import { AuthService } from '../auth/auth.service';
import type { AppContextType } from '../trpc/trpc.context';
import {
  byIdInput,
  createParkInput,
  listParksInput,
  updateParkInput,
} from './parks.schema';
import { ParksService } from './parks.service';

@Router({ alias: 'parks' })
export class ParksRouter {
  constructor(
    private readonly parksService: ParksService,
    private readonly authService: AuthService,
  ) {}

  @Query({ input: listParksInput })
  async list(
    @Input() input: z.infer<typeof listParksInput>,
    @Ctx() context: AppContextType,
  ) {
    await this.getCurrentUser(context);

    return this.parksService.list(input.regionId, input.cityId);
  }

  @Query({ input: byIdInput })
  async byId(
    @Input() input: z.infer<typeof byIdInput>,
    @Ctx() context: AppContextType,
  ) {
    await this.getCurrentUser(context);

    return this.parksService.byId(input.id);
  }

  @Mutation({ input: createParkInput })
  async create(
    @Input() input: z.infer<typeof createParkInput>,
    @Ctx() context: AppContextType,
  ) {
    const user = await this.getCurrentUser(context);

    return this.parksService.create(user.id, input);
  }

  @Mutation({ input: updateParkInput })
  async update(
    @Input() input: z.infer<typeof updateParkInput>,
    @Ctx() context: AppContextType,
  ) {
    const user = await this.getCurrentUser(context);

    const { id, ...updates } = input;

    return this.parksService.update(id, user.id, updates);
  }

  @Mutation({ input: byIdInput })
  async delete(
    @Input() input: z.infer<typeof byIdInput>,
    @Ctx() context: AppContextType,
  ) {
    const user = await this.getCurrentUser(context);

    return this.parksService.delete(input.id, user.id);
  }

  private async getCurrentUser(context: AppContextType) {
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
