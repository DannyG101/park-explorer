import { useMutation, useQuery } from '@tanstack/react-query'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'

import { useTRPC } from '@/trpc'
import { Button } from '../components/ui/button'

export function AuthenticatedLayout() {
  const trpc = useTRPC()
  const navigate = useNavigate()

  const meQuery = useQuery(
    trpc.auth.me.queryOptions(),
  )

  const logoutMutation = useMutation(
    trpc.auth.logout.mutationOptions({
      onSuccess: () => {
        navigate('/login')
      },
    }),
  )

  if (meQuery.isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-lg">
          Checking your session...
        </p>
      </main>
    )
  }

  if (meQuery.isError || !meQuery.data) {
    return <Navigate to="/login" replace />
  }

  return (
    <div>
      <header className="flex items-center justify-between border-b p-4">
        <h1 className="text-xl font-bold">
          Park Explorer
        </h1>

        <div className="flex items-center gap-4">
          <span>
            Hi {meQuery.data.name}
          </span>

          <Button
            variant="outline"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending
              ? 'Logging out...'
              : 'Logout'}
          </Button>
        </div>
      </header>

      <Outlet />
    </div>
  )
}