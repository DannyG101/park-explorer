import { useState } from "react";
import { skipToken, useQuery } from "@tanstack/react-query";

import { ParkFilters } from "@/components/parks/ParkFilters";
import { ParkList } from "@/components/parks/ParkList";
import { ParksMap } from "@/components/parks/ParksMap";
import { useParkFilters } from "@/hooks/useParkFilters";
import { useTRPC } from "@/trpc";

export function ParksPage() {
  const [focusedParkId, setFocusedParkId] = useState<number | null>(null);

  const {
    search,
    selectedRegionId,
    selectedCityId,
    setSearch,
    setSelectedRegionId,
    setSelectedCityId,
  } = useParkFilters();

  const trpc = useTRPC();

  const parksQuery = useQuery(
    trpc.parks.list.queryOptions(
      selectedRegionId === null
        ? skipToken
        : {
            regionId: selectedRegionId,
            cityId: selectedCityId ?? undefined,
          },
    ),
  );

  const parks = parksQuery.data ?? [];

  const filteredParks = parks.filter((park) =>
    park.name.toLowerCase().includes(search.toLowerCase()),
  );

  function handleRegionChange(regionId: number | null) {
    setFocusedParkId(null);
    setSelectedRegionId(regionId);
  }

  function handleCityChange(cityId: number | null) {
    setFocusedParkId(null);
    setSelectedCityId(cityId);
  }

  const hasParks = filteredParks.length > 0;

  return (
    <main className="mx-auto w-full max-w-7xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Parks</h1>

      <div className="mb-6 rounded-lg border p-4">
        <ParkFilters
          search={search}
          selectedRegionId={selectedRegionId}
          selectedCityId={selectedCityId}
          showSearch={parksQuery.isSuccess && parks.length > 0}
          onSearchChange={setSearch}
          onRegionChange={handleRegionChange}
          onCityChange={handleCityChange}
        />
      </div>

      {!hasParks && (
        <div className="mb-4">
          {selectedRegionId === null && (
            <p>Please select a region to view parks.</p>
          )}

          {selectedRegionId !== null && parksQuery.isLoading && (
            <p>Loading parks...</p>
          )}

          {selectedRegionId !== null && parksQuery.isError && (
            <p>{parksQuery.error.message}</p>
          )}

          {selectedRegionId !== null &&
            parksQuery.isSuccess &&
            parks.length === 0 && <p>No parks found in this area.</p>}

          {selectedRegionId !== null &&
            parks.length > 0 &&
            filteredParks.length === 0 && <p>No parks match your search.</p>}
        </div>
      )}

      {hasParks ? (
        <div className="grid items-start gap-6 lg:grid-cols-[350px_1fr]">
          <ParkList parks={filteredParks} onParkClick={setFocusedParkId} />

          <div className="overflow-hidden rounded-lg border">
            <ParksMap
              parks={filteredParks}
              focusedParkId={focusedParkId}
              selectedRegionId={selectedRegionId}
            />
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <ParksMap
            parks={filteredParks}
            focusedParkId={focusedParkId}
            selectedRegionId={selectedRegionId}
          />
        </div>
      )}
    </main>
  );
}