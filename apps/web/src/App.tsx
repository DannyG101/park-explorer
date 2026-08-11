import { useQuery } from '@tanstack/react-query'
import { useTRPC } from './trpc'

function App() {
  const trpc = useTRPC()

  const healthQuery = useQuery(
    trpc.health.check.queryOptions()
  )

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Park Explorer</h1>

      <p className="mt-4">
        Server status: {healthQuery.data?.status}
      </p>
    </div>
  )
}

export default App