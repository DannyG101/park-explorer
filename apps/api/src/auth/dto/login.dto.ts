import { z } from 'zod';

import { loginInput } from '../auth.schema';

export type LoginDto = z.infer<typeof loginInput>;
