import { useQuery } from "@tanstack/react-query";

import type { ParkFiltersProps } from "@/types/park.types";
import { useTRPC } from "@/trpc";
import { Input } from "../ui/input";

export function ParkFilters({
  search,
  selectedRegionId,
  selectedCityId,
  showSearch,
  onSearchChange,
  onRegionChange,
  onCityChange,
}: ParkFiltersProps) {
  const trpc = useTRPC();

  const regionsQuery = useQuery(trpc.regions.list.queryOptions());

  const citiesQuery = useQuery(
    trpc.regions.citiesByRegion.queryOptions(
      {
        regionId: selectedRegionId ?? 0,
      },
      {
        enabled: selectedRegionId !== null,
      },
    ),
  );

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        className="h-10 min-w-44 rounded-md border bg-white px-3"
        value={selectedRegionId ?? ""}
        onChange={(event) => {
          const value = event.target.value;

          onRegionChange(value ? Number(value) : null);
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
        className="h-10 min-w-44 rounded-md border bg-white px-3 disabled:cursor-not-allowed disabled:opacity-50"
        value={selectedCityId ?? ""}
        disabled={selectedRegionId === null}
        onChange={(event) => {
          const value = event.target.value;

          onCityChange(value ? Number(value) : null);
        }}
      >
        <option value="">All cities</option>

        {citiesQuery.data?.map((city) => (
          <option key={city.id} value={city.id}>
            {city.name}
          </option>
        ))}
      </select>

      {showSearch && (
        <Input
          className="h-10 min-w-56 flex-1"
          type="text"
          placeholder="Search by park name..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      )}
    </div>
  );
}
