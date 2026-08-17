import { Mutation, Router } from 'nestjs-trpc';
import { z } from 'zod';

import { AuthService } from './auth.service';

const registerInput = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(8),
});

const loginInput = z.object({
  email: z.email(),
  password: z.string(),
});

@Router({ alias: 'auth' })
export class AuthRouter {
  constructor(private readonly authService: AuthService) {}

  @Mutation({ input: registerInput })
  register(input: z.infer<typeof registerInput>) {
    return this.authService.register(input.name, input.email, input.password);
  }

  @Mutation({ input: loginInput })
  login(input: z.infer<typeof loginInput>) {
    return this.authService.login(input.email, input.password);
  }
}
