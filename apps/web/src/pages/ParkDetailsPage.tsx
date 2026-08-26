import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc";

export function ParkDetailsPage() {
  const { id } = useParams();
  const parkId = Number(id);

  const navigate = useNavigate();
  const trpc = useTRPC();

  const parkQuery = useQuery(
    trpc.parks.byId.queryOptions({
      id: parkId,
    }),
  );

  if (!Number.isInteger(parkId) || parkId <= 0) {
    return (
      <main className="mx-auto w-full max-w-7xl px-6 py-10">
        <p className="text-lg text-slate-800">Invalid park ID.</p>
      </main>
    );
  }

  if (parkQuery.isLoading) {
    return (
      <main className="mx-auto w-full max-w-7xl px-6 py-10">
        <p className="text-lg text-slate-800">Loading park...</p>
      </main>
    );
  }

  if (parkQuery.isError) {
    return (
      <main className="mx-auto w-full max-w-7xl px-6 py-10">
        <p className="text-lg text-slate-800">{parkQuery.error.message}</p>
      </main>
    );
  }

  if (!parkQuery.data) {
    return (
      <main className="mx-auto w-full max-w-7xl px-6 py-10">
        <p className="text-lg text-slate-800">Park not found.</p>
      </main>
    );
  }

  const park = parkQuery.data;

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-10">
      <Button variant="outline" className="mb-8" onClick={() => navigate(-1)}>
        ← Back to parks
      </Button>

      <div className="max-w-5xl">
        <h1 className="text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
          {park.name}
        </h1>

        <p className="mt-5 max-w-4xl text-xl leading-8 text-slate-800">
          {park.description}
        </p>

        <div className="mt-10 border-t border-slate-200 pt-8">
          <div className="flex flex-col gap-8 sm:flex-row sm:flex-wrap sm:gap-x-16">
            <div className="min-w-40">
              <p className="text-base font-semibold text-slate-950">City</p>

              <p className="mt-2 text-lg text-slate-800">{park.city.name}</p>
            </div>

            <div className="min-w-40">
              <p className="text-base font-semibold text-slate-950">Region</p>

              <p className="mt-2 text-lg text-slate-800">{park.region.name}</p>
            </div>

            <div className="min-w-52">
              <p className="text-base font-semibold text-slate-950">
                Opening date
              </p>

              <p className="mt-2 text-lg text-slate-800">
                {park.openingDate ?? "Not provided"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}