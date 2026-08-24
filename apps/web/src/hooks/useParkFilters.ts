import { useSearchParams } from "react-router-dom";

export function useParkFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") ?? "";

  const regionParam = Number(searchParams.get("region"));
  const cityParam = Number(searchParams.get("city"));

  const selectedRegionId =
    Number.isInteger(regionParam) && regionParam > 0 ? regionParam : null;

  const selectedCityId =
    Number.isInteger(cityParam) && cityParam > 0 ? cityParam : null;

  function setSearch(search: string) {
    setSearchParams((params) => {
      if (search) {
        params.set("search", search);
      } else {
        params.delete("search");
      }

      return params;
    });
  }

  function setSelectedRegionId(regionId: number | null) {
    setSearchParams((params) => {
      if (regionId === null) {
        params.delete("region");
      } else {
        params.set("region", String(regionId));
      }

      params.delete("city");

      return params;
    });
  }

  function setSelectedCityId(cityId: number | null) {
    setSearchParams((params) => {
      if (cityId === null) {
        params.delete("city");
      } else {
        params.set("city", String(cityId));
      }

      return params;
    });
  }

  return {
    search,
    selectedRegionId,
    selectedCityId,
    setSearch,
    setSelectedRegionId,
    setSelectedCityId,
  };
}