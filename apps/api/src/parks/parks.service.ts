import { Injectable } from '@nestjs/common';
import { TRPCError } from '@trpc/server';
import { and, eq, getTableColumns } from 'drizzle-orm';

import { cities, db, parks, regions } from '@park-explorer/db';

import type { CreateParkDto } from './dto/create-park.dto';
import type { UpdateParkDto } from './dto/update-park.dto';
import type { ParkResultDto } from './dto/park-result.dto';

@Injectable()
export class ParksService {
  async list(regionId: number, cityId?: number): Promise<ParkResultDto[]> {
    return db
      .select({
        ...getTableColumns(parks),

        city: {
          id: cities.id,
          name: cities.name,
        },

        region: {
          id: regions.id,
          name: regions.name,
        },
      })
      .from(parks)
      .innerJoin(cities, eq(parks.cityId, cities.id))
      .innerJoin(regions, eq(cities.regionId, regions.id))
      .where(
        and(
          eq(cities.regionId, regionId),

          cityId !== undefined ? eq(parks.cityId, cityId) : undefined,
        ),
      );
  }

  async byId(id: number): Promise<ParkResultDto> {
    const [park] = await db
      .select({
        ...getTableColumns(parks),

        city: {
          id: cities.id,
          name: cities.name,
        },

        region: {
          id: regions.id,
          name: regions.name,
        },
      })
      .from(parks)
      .innerJoin(cities, eq(parks.cityId, cities.id))
      .innerJoin(regions, eq(cities.regionId, regions.id))
      .where(eq(parks.id, id));

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

    return {
      message: 'Park deleted successfully',
    };
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
