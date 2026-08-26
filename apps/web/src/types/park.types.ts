export type Park = {
  id: number;
  name: string;
  description: string;
  creatorId: number;
  openingDate: string | null;
  cityId: number;
  latitude: number;
  longitude: number;

  polygon?: unknown;

  createdAt: string;
  updatedAt: string;

  city: {
    id: number;
    name: string;
  };

  region: {
    id: number;
    name: string;
  };
};

export type ParkCardProps = {
  park: Park;
  onParkClick: (parkId: number) => void;
};

export type ParkListProps = {
  parks: Park[];
  onParkClick: (parkId: number) => void;
};

export type ParksMapProps = {
  parks: Park[];
  focusedParkId: number | null;
  selectedRegionId: number | null;
};

export type ParkFiltersProps = {
  search: string;
  selectedRegionId: number | null;
  selectedCityId: number | null;
  onSearchChange: (search: string) => void;
  onRegionChange: (regionId: number | null) => void;
  onCityChange: (cityId: number | null) => void;
};