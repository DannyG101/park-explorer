import { Link } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

import type { ParkCardProps } from "@/types/park.types";

export function ParkCard({ park, onParkClick }: ParkCardProps) {
  return (
    <Card
      className="cursor-pointer rounded-xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all hover:border-slate-300 hover:bg-slate-50/70 hover:shadow-md"
      onClick={() => onParkClick(park.id)}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold leading-tight text-slate-950">
          {park.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 pt-0">
        <p className="line-clamp-3 text-sm leading-6 text-slate-600">
          {park.description}
        </p>

        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <span>{park.city.name}</span>

          <span className="text-slate-300">•</span>

          <span>{park.region.name}</span>
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <span className="text-xs text-slate-400">
            {park.openingDate ?? "Opening date not provided"}
          </span>

          <Link
            to={`/parks/${park.id}`}
            className="text-sm font-semibold text-primary underline-offset-4 transition hover:text-primary/80 hover:underline"
            onClick={(event) => event.stopPropagation()}
          >
            View details →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
