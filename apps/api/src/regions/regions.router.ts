import { Input, Query, Router } from 'nestjs-trpc';
import { z } from 'zod';

import { RegionsService } from './regions.service';

const citiesByRegionInput = z.object({
  regionId: z.number(),
});

@Router({ alias: 'regions' })
export class RegionsRouter {
  constructor(private readonly regionsService: RegionsService) {}

  @Query()
  list() {
    return this.regionsService.list();
  }

  @Query({
    input: citiesByRegionInput,
  })
  citiesByRegion(@Input() input: z.infer<typeof citiesByRegionInput>) {
    return this.regionsService.citiesByRegion(input.regionId);
  }
}
