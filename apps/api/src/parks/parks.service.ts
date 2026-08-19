import { Injectable } from '@nestjs/common';
import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';

import { db, parks } from '@park-explorer/db';

import type { CreateParkDto } from './dto/create-park.dto';
import type { UpdateParkDto } from './dto/update-park.dto';

@Injectable()
export class ParksService {
  async list() {
    return db.query.parks.findMany();
  }

  async byId(id: number) {
    const [park] = await db.select().from(parks).where(eq(parks.id, id));

    if (!park) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Park not found',
      });
    }

    return park;
  }

  async create(creatorId: number, input: CreateParkDto) {
    const [park] = await db
      .insert(parks)
      .values({
        ...input,
        creatorId,
      })
      .returning();

    return park;
  }

  async update(id: number, userId: number, input: UpdateParkDto) {
    await this.findParkAndCheckOwnership(id, userId);

    const [updatedPark] = await db
      .update(parks)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(parks.id, id))
      .returning();

    return updatedPark;
  }

  async delete(id: number, userId: number) {
    await this.findParkAndCheckOwnership(id, userId);

    await db.delete(parks).where(eq(parks.id, id));

    return { message: 'Park deleted successfully' };
  }

  private async findParkAndCheckOwnership(id: number, userId: number) {
    const [park] = await db.select().from(parks).where(eq(parks.id, id));

    if (!park) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Park not found',
      });
    }

    if (park.creatorId !== userId) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You do not own this park',
      });
    }

    return park;
  }
}
