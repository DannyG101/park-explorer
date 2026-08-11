import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import './index.css'
import App from './App.tsx'
import { TRPCProvider } from './trpc'
import type { AppRouter } from '../../api/src/@generated/server'

const queryClient = new QueryClient()

const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc',
    }),
  ],
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TRPCProvider
        trpcClient={trpcClient}
        queryClient={queryClient}
      >
        <App />
      </TRPCProvider>
    </QueryClientProvider>
  </StrictMode>,
)