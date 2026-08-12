import { Query, Router } from 'nestjs-trpc';
import { db } from '@park-explorer/db';

@Router({ alias: 'cities' })
export class CitiesRouter {
  @Query()
  async getAll() {
    return db.query.cities.findMany({
      with: {
        region: true,
      },
    });
  }
}
