import { Injectable } from '@nestjs/common';
import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';

import { db, parks } from '@park-explorer/db';

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

  async create(
    creatorId: number,
    input: {
      name: string;
      description: string;
      openingDate?: string | null;
      cityId: number;
      latitude: number;
      longitude: number;
      polygon?: unknown;
    },
  ) {
    const [park] = await db
      .insert(parks)
      .values({
        name: input.name,
        description: input.description,
        creatorId: creatorId,
        openingDate: input.openingDate,
        cityId: input.cityId,
        latitude: input.latitude,
        longitude: input.longitude,
        polygon: input.polygon,
      })
      .returning();

    return park;
  }

  async update(
    id: number,
    userId: number,
    input: {
      name?: string;
      description?: string;
      openingDate?: string | null;
      cityId?: number;
      latitude?: number;
      longitude?: number;
      polygon?: unknown;
    },
  ) {
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
        message: 'You cannot edit this park',
      });
    }

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
        message: 'You cannot edit this park',
      });
    }

    await db.delete(parks).where(eq(parks.id, id));

    return { message: 'Park deleted successfully' };
  }
}
