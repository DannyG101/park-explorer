import { useEffect } from "react";
import { Link } from "react-router-dom";

import {
  GeoJSON,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import type { GeoJsonObject } from "geojson";

import type { ParksMapProps } from "@/types/park.types";

const ISRAEL_CENTER: [number, number] = [31.7683, 35.2137];
const ISRAEL_ZOOM = 8;

function MapFocus({ parks, focusedParkId }: ParksMapProps) {
  const map = useMap();

  useEffect(() => {
    if (focusedParkId === null) {
      return;
    }

    const focusedPark = parks.find((park) => park.id === focusedParkId);

    if (!focusedPark) {
      return;
    }

    map.flyTo([focusedPark.latitude, focusedPark.longitude], 15);
  }, [focusedParkId, parks, map]);

  return null;
}

function RegionFocus({
  parks,
  focusedParkId,
  selectedRegionId,
}: ParksMapProps) {
  const map = useMap();

  useEffect(() => {
    if (focusedParkId !== null) {
      return;
    }

    if (selectedRegionId === null) {
      map.flyTo(ISRAEL_CENTER, ISRAEL_ZOOM);
      return;
    }

    if (parks.length === 0) {
      return;
    }

    const positions = parks.map(
      (park) => [park.latitude, park.longitude] as [number, number],
    );

    map.fitBounds(positions, {
      padding: [40, 40],
      maxZoom: 11,
    });
  }, [parks, focusedParkId, selectedRegionId, map]);

  return null;
}

export function ParksMap({
  parks,
  focusedParkId,
  selectedRegionId,
}: ParksMapProps) {
  return (
    <MapContainer
      center={ISRAEL_CENTER}
      zoom={ISRAEL_ZOOM}
      className="h-[500px] w-full rounded-lg"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <RegionFocus
        parks={parks}
        focusedParkId={focusedParkId}
        selectedRegionId={selectedRegionId}
      />

      <MapFocus
        parks={parks}
        focusedParkId={focusedParkId}
        selectedRegionId={selectedRegionId}
      />

      {parks.map((park) => (
        <Marker
          key={`marker-${park.id}`}
          position={[park.latitude, park.longitude]}
        >
          <Popup>
            <div className="min-w-48">
              <strong className="text-base">{park.name}</strong>

              <p className="!my-1 text-sm">{park.description}</p>

              <p className="!my-1 text-sm">
                <strong>Location:</strong> {park.city.name}, {park.region.name}
              </p>

              <p className="!my-1 text-sm">
                <strong>Opening date:</strong>{" "}
                {park.openingDate ?? "Not provided"}
              </p>

              <Link
                to={`/parks/${park.id}`}
                className="mt-1 inline-block font-medium underline"
              >
                View details
              </Link>
            </div>
          </Popup>
        </Marker>
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