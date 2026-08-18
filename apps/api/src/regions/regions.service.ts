import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { cities, db } from '@park-explorer/db';

@Injectable()
export class RegionsService {
  async list() {
    return db.query.regions.findMany();
  }

  async citiesByRegion(regionId: number) {
    return db.select().from(cities).where(eq(cities.regionId, regionId));
  }
}
