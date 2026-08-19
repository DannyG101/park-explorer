import { z } from 'zod';

import { updateParkData } from '../parks.schema';

export type UpdateParkDto = z.infer<typeof updateParkData>;
