import { Link } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { ParkCardProps } from "@/types/park.types";

export function ParkCard({ park, onParkClick }: ParkCardProps) {
  return (
    <Card
      className="cursor-pointer bg-slate-50 shadow-none transition-colors hover:bg-slate-100"
      onClick={() => onParkClick(park.id)}
    >
      <CardHeader>
        <CardTitle>{park.name}</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        <p>{park.description}</p>

        <p>
          <strong>City:</strong> {park.city.name}
        </p>

        <p>
          <strong>Region:</strong> {park.region.name}
        </p>

        <p>
          <strong>Opening date:</strong> {park.openingDate ?? "Not provided"}
        </p>

        <Link
          to={`/parks/${park.id}`}
          className="font-medium underline"
          onClick={(event) => event.stopPropagation()}
        >
          View details
        </Link>
      </CardContent>
    </Card>
  );
}