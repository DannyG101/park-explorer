import type { ParkListProps } from "@/types/park.types";
import { ParkCard } from "./ParkCard";

export function ParkList({ parks, onParkClick }: ParkListProps) {
  return (
    <div className="grid gap-4">
      {parks.map((park) => (
        <ParkCard key={park.id} park={park} onParkClick={onParkClick} />
      ))}
    </div>
  );
}