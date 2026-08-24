import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { useTRPC } from "@/trpc";

export function ParkDetailsPage() {
  const { id } = useParams();
  const parkId = Number(id);
  const trpc = useTRPC();
  const parkQuery = useQuery(
    trpc.parks.byId.queryOptions({
      id: parkId,
    }),
  );

  if (!Number.isInteger(parkId) || parkId <= 0) {
    return <p className="p-6">Invalid park ID.</p>;
  }

  if (parkQuery.isLoading) {
    return <p className="p-6">Loading park...</p>;
  }

  if (parkQuery.isError) {
    return <p className="p-6">{parkQuery.error.message}</p>;
  }

  if (!parkQuery.data) {
    return <p className="p-6">Park not found.</p>;
  }

  const park = parkQuery.data;

  return (
    <main className="p-6">
      <h1 className="mb-4 text-3xl font-bold">{park.name}</h1>

      <div className="flex flex-col gap-2">
        <p>{park.description}</p>

        <p>Opening date: {park.openingDate ?? "Not provided"}</p>

        <p>City ID: {park.cityId}</p>

        <p>
          Coordinates: {park.latitude}, {park.longitude}
        </p>
      </div>
    </main>
  );
}
