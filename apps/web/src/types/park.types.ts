import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../../../api/src/@generated/server";

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type Park = RouterOutputs["parks"]["list"][number];

export type ParkCardProps = {
  park: Park;
};

export type ParkListProps = {
  parks: Park[];
};

export type ParkFiltersProps = {
  search: string;
  selectedRegionId: number | null;
  selectedCityId: number | null;
  showSearch: boolean;
  onSearchChange: (search: string) => void;
  onRegionChange: (regionId: number | null) => void;
  onCityChange: (cityId: number | null) => void;
};

export type ParksMapProps = {
  parks: Park[];
};