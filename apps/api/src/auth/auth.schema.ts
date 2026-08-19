import { z } from 'zod';

export const registerInput = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(8),
});

export const loginInput = z.object({
  email: z.email(),
  password: z.string(),
});
