import { Query, Router } from 'nestjs-trpc';
import { z } from 'zod';

const healthSchema = z.object({
  status: z.string(),
});

@Router({ alias: 'health' })
export class HealthRouter {
  @Query({
    output: healthSchema,
  })
  check() {
    return {
      status: 'ok',
    };
  }
}
