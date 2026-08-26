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

    map.flyTo([focusedPark.latitude, focusedPark.longitude], 15, {
      duration: 1.2,
    });
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
      map.flyTo(ISRAEL_CENTER, ISRAEL_ZOOM, {
        duration: 1.2,
      });

      return;
    }

    if (parks.length === 0) {
      return;
    }

    const positions = parks.map(
      (park) => [park.latitude, park.longitude] as [number, number],
    );

    map.flyToBounds(positions, {
      padding: [40, 40],
      maxZoom: 11,
      duration: 1.2,
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
      className="h-full w-full"
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
            <div className="min-w-56">
              <h3 className="text-lg font-bold text-slate-950">{park.name}</h3>

              <p className="!my-2 text-sm leading-5 text-slate-600">
                {park.description}
              </p>

              <div className="!my-3 flex flex-col gap-1 text-sm text-slate-700">
                <p className="!m-0">
                  <strong>Location:</strong> {park.city.name},{" "}
                  {park.region.name}
                </p>

                <p className="!m-0">
                  <strong>Opening date:</strong>{" "}
                  {park.openingDate ?? "Not provided"}
                </p>
              </div>

              <Link
                to={`/parks/${park.id}`}
                className="inline-block text-sm font-semibold text-slate-950 underline-offset-4 hover:underline"
              >
                View details →
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