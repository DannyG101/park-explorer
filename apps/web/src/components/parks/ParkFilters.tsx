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
        className="h-11 min-w-48 rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
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
        className="h-11 min-w-48 rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
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
          className="h-11 min-w-64 flex-1 rounded-lg border-slate-200 bg-white px-4 text-sm shadow-none focus-visible:ring-slate-200"
          type="text"
          placeholder="Search parks by name..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      )}
    </div>
  );
}