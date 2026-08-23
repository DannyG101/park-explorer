import { useState } from 'react'
import {
  skipToken,
  useQuery,
} from '@tanstack/react-query'

import { useTRPC } from '@/trpc'
import { ParkFilters } from './ParkFilters'
import { ParkList } from './ParkList'

export function ParksPage() {
  const [search, setSearch] = useState('')
  const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null)
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null)

  const trpc = useTRPC()

  const parksQuery = useQuery(
    trpc.parks.list.queryOptions(
      selectedRegionId === null
        ? skipToken
        : {
            regionId: selectedRegionId,
            cityId: selectedCityId ?? undefined,
          },
    ),
  )

  const parks = parksQuery.data ?? []

  const filteredParks = parks.filter((park) =>
    park.name
      .toLowerCase()
      .includes(search.toLowerCase()),
  )

  return (
    <main className="p-6">
      <h1 className="mb-6 text-3xl font-bold">
        Parks
      </h1>

      <div className="mb-6">
        <ParkFilters
          search={search}
          selectedRegionId={selectedRegionId}
          selectedCityId={selectedCityId}
          showSearch={
            parksQuery.isSuccess &&
            parks.length > 0
          }
          onSearchChange={setSearch}
          onRegionChange={setSelectedRegionId}
          onCityChange={setSelectedCityId}
        />
      </div>

      {selectedRegionId === null && (
        <p>Please select a region to view parks.</p>
      )}

      {selectedRegionId !== null &&
        parksQuery.isLoading && (
          <p>Loading parks...</p>
        )}

      {selectedRegionId !== null &&
        parksQuery.isError && (
          <p>{parksQuery.error.message}</p>
        )}

      {selectedRegionId !== null &&
        parksQuery.isSuccess &&
        parks.length === 0 && (
          <p>No parks found in this area.</p>
        )}

      {filteredParks.length > 0 && (
        <ParkList parks={filteredParks} />
      )}

      {selectedRegionId !== null &&
        parks.length > 0 &&
        filteredParks.length === 0 && (
          <p>No parks match your search.</p>
        )}
    </main>
  )
}
