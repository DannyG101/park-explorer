import { GeoJSON, MapContainer, Marker, TileLayer } from "react-leaflet";

import "leaflet/dist/leaflet.css";

import type { GeoJsonObject } from "geojson";

import type { ParksMapProps } from "@/types/park.types";

export function ParksMap({ parks }: ParksMapProps) {
  return (
    <MapContainer
      center={[31.7683, 35.2137]}
      zoom={8}
      className="h-[500px] w-full"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {parks.map((park) => (
        <Marker
          key={`marker-${park.id}`}
          position={[park.latitude, park.longitude]}
        />
      ))}

      {parks.map((park) => {
        if (!park.polygon) {
          return null;
        }

        return (
          <GeoJSON
            key={`polygon-${park.id}`}
            data={park.polygon as GeoJsonObject}
          />
        );
      })}
    </MapContainer>
  );
}