import { Injectable } from '@nestjs/common';
import type { Request, Response } from 'express';
import { ContextOptions, TRPCContext } from 'nestjs-trpc';

export type AuthRequest = Request & {
  cookies: {
    session?: string;
  };
};

export type AppContextType = {
  req: AuthRequest;
  res: Response;
};

@Injectable()
export class AppContext implements TRPCContext {
  create(opts: ContextOptions): AppContextType {
    return {
      req: opts.req as AuthRequest,
      res: opts.res as Response,
    };
  }
}
