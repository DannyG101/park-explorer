import { useQuery } from '@tanstack/react-query'

import { useTRPC } from '@/trpc'
import { Input } from '../ui/input'

type ParkFiltersProps = {
  search: string
  selectedRegionId: number | null
  selectedCityId: number | null
  showSearch: boolean
  onSearchChange: (search: string) => void
  onRegionChange: (regionId: number | null) => void
  onCityChange: (cityId: number | null) => void
}

export function ParkFilters({
  search,
  selectedRegionId,
  selectedCityId,
  showSearch,
  onSearchChange,
  onRegionChange,
  onCityChange,
}: ParkFiltersProps) {
  const trpc = useTRPC()

  const regionsQuery = useQuery(
    trpc.regions.list.queryOptions(),
  )

  const citiesQuery = useQuery(
    trpc.regions.citiesByRegion.queryOptions(
      {
        regionId: selectedRegionId ?? 0,
      },
      {
        enabled: selectedRegionId !== null,
      },
    ),
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <select
          className="rounded-md border p-2"
          value={selectedRegionId ?? ''}
          onChange={(event) => {
            const value = event.target.value

            onRegionChange(
              value ? Number(value) : null,
            )

            onCityChange(null)
          }}
        >
          <option value="">Select a region</option>

          {regionsQuery.data?.map((region) => (
            <option key={region.id} value={region.id}>
              {region.name}
            </option>
          ))}
        </select>

        <select
          className="rounded-md border p-2"
          value={selectedCityId ?? ''}
          disabled={selectedRegionId === null}
          onChange={(event) => {
            const value = event.target.value

            onCityChange(
              value ? Number(value) : null,
            )
          }}
        >
          <option value="">All cities</option>

          {citiesQuery.data?.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      {showSearch && (
        <Input
          type="text"
          placeholder="Search By Park Name......"
          value={search}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
        />
      )}
    </div>
  )
}