import { z } from 'zod';

import { registerInput } from '../auth.schema';

export type RegisterDto = z.infer<typeof registerInput>;
