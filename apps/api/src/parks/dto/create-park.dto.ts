import { z } from 'zod';

import { createParkInput } from '../parks.schema';

export type CreateParkDto = z.infer<typeof createParkInput>;
