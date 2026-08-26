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

  function renderLeftContent() {
    if (selectedRegionId === null) {
      return (
        <div className="flex h-full items-center px-4">
          <div className="max-w-sm">
            <div className="mb-5 h-1 w-12 rounded-full bg-primary" />

            <h2 className="text-3xl font-bold tracking-tight text-slate-950">
              Start exploring
            </h2>

            <p className="mt-4 text-lg leading-7 text-slate-600">
              Choose a region above to discover parks across Israel.
            </p>
          </div>
        </div>
      );
    }

    if (parksQuery.isLoading) {
      return (
        <div className="flex h-full items-center px-4">
          <div className="max-w-sm">
            <div className="mb-5 h-1 w-12 rounded-full bg-primary" />

            <h2 className="text-2xl font-bold text-slate-950">
              Loading parks...
            </h2>

            <p className="mt-3 text-base leading-7 text-slate-600">
              Finding parks in the selected area.
            </p>
          </div>
        </div>
      );
    }

    if (parksQuery.isError) {
      return (
        <div className="flex h-full items-center px-4">
          <div className="max-w-sm">
            <div className="mb-5 h-1 w-12 rounded-full bg-primary" />

            <h2 className="text-2xl font-bold text-slate-950">
              Could not load parks
            </h2>

            <p className="mt-3 text-base leading-7 text-slate-600">
              {parksQuery.error.message}
            </p>
          </div>
        </div>
      );
    }

    if (parks.length === 0) {
      return (
        <div className="flex h-full items-center px-4">
          <div className="max-w-sm">
            <div className="mb-5 h-1 w-12 rounded-full bg-primary" />

            <h2 className="text-3xl font-bold tracking-tight text-slate-950">
              No parks here yet
            </h2>

            <p className="mt-4 text-lg leading-7 text-slate-600">
              Try choosing another city or region to keep exploring.
            </p>
          </div>
        </div>
      );
    }

    if (filteredParks.length === 0) {
      return (
        <div className="flex h-full items-center px-4">
          <div className="max-w-sm">
            <div className="mb-5 h-1 w-12 rounded-full bg-primary" />

            <h2 className="text-3xl font-bold tracking-tight text-slate-950">
              No matches
            </h2>

            <p className="mt-4 text-lg leading-7 text-slate-600">
              We couldn&apos;t find a park matching &quot;{search}&quot;. Try
              another search.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="h-full overflow-y-auto pr-2">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Parks</h2>

          <p className="text-sm text-slate-500">
            {filteredParks.length}{" "}
            {filteredParks.length === 1 ? "park" : "parks"} found
          </p>
        </div>

        <ParkList parks={filteredParks} onParkClick={setFocusedParkId} />
      </div>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-10">
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium uppercase tracking-widest text-slate-400">
          Park Explorer
        </p>

        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          Explore Israel&apos;s parks
        </h1>

        <p className="mt-3 max-w-2xl text-lg leading-7 text-slate-500">
          Browse parks by region or city, search by name, and explore their
          locations directly on the map.
        </p>
      </div>

      <div className="mb-8">
        <ParkFilters
          search={search}
          selectedRegionId={selectedRegionId}
          selectedCityId={selectedCityId}
          onSearchChange={setSearch}
          onRegionChange={handleRegionChange}
          onCityChange={handleCityChange}
        />
      </div>

      <div className="flex flex-col gap-8 lg:h-[620px] lg:flex-row">
        <aside className="min-h-[260px] lg:h-full lg:w-[360px]">
          {renderLeftContent()}
        </aside>

        <section className="h-[500px] flex-1 overflow-hidden rounded-2xl shadow-sm ring-1 ring-slate-200 lg:h-full">
          <ParksMap
            parks={filteredParks}
            focusedParkId={focusedParkId}
            selectedRegionId={selectedRegionId}
          />
        </section>
      </div>
    </main>
  );
}