import { createTRPCContext } from '@trpc/tanstack-react-query'
import type { AppRouter } from '../../api/src/@generated/server'

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>()