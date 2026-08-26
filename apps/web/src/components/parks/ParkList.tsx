import type { ParkListProps } from "@/types/park.types";

import { ParkCard } from "./ParkCard";

export function ParkList({ parks, onParkClick }: ParkListProps) {
  return (
    <div className="flex flex-col gap-3">
      {parks.map((park) => (
        <ParkCard key={park.id} park={park} onParkClick={onParkClick} />
      ))}
    </div>
  );
}