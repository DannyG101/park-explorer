import 'dotenv/config';

import { db } from './index';
import { cities, parks, regions } from './schema';

const CREATOR_ID = 12;

const GIS_URL =
  'https://mapateva.org.il/arcgis/rest/services/Preservation/CorporateResponsibility_Layers/MapServer/0/query';

const regionData = [
  { name: 'Central' },
  { name: 'Northern' },
  { name: 'Southern' },
  { name: 'Jerusalem' },
];

const cityData = [
  { name: 'Tel Aviv', region: 'Central' },
  { name: 'Petach Tikva', region: 'Central' },
  { name: 'Netanya', region: 'Central' },
  { name: 'Hadera', region: 'Central' },

  { name: 'Haifa', region: 'Northern' },
  { name: 'Tiberias', region: 'Northern' },
  { name: 'Acre', region: 'Northern' },
  { name: 'Nazareth', region: 'Northern' },
  { name: 'Kiryat Shmona', region: 'Northern' },

  { name: 'Beer Sheva', region: 'Southern' },
  { name: 'Arad', region: 'Southern' },
  { name: 'Mitzpe Ramon', region: 'Southern' },
  { name: 'Eilat', region: 'Southern' },

  { name: 'Jerusalem', region: 'Jerusalem' },
  { name: 'Beit Shemesh', region: 'Jerusalem' },
];

const parkData = [
  { name: 'Yarkon', city: 'Tel Aviv' },
  { name: 'Apollonia', city: 'Tel Aviv' },
  { name: 'Caesarea', city: 'Hadera' },
  { name: 'Alexander Stream', city: 'Netanya' },

  { name: 'Carmel', city: 'Haifa' },
  { name: 'Mount Carmel', city: 'Haifa' },
  { name: 'Akhziv', city: 'Acre' },
  { name: 'Beit Shearim', city: 'Haifa' },
  { name: 'Tzipori', city: 'Nazareth' },
  { name: 'Arbel', city: 'Tiberias' },
  { name: 'Hamat Tiberias', city: 'Tiberias' },
  { name: 'Tel Dan', city: 'Kiryat Shmona' },
  { name: 'Banias', city: 'Kiryat Shmona' },

  { name: 'Masada', city: 'Arad' },
  { name: 'Ein Gedi', city: 'Arad' },
  { name: 'Tel Beer Sheva', city: 'Beer Sheva' },
  { name: 'Avdat', city: 'Mitzpe Ramon' },
  { name: 'Ein Avdat', city: 'Mitzpe Ramon' },
  { name: 'Makhtesh Ramon', city: 'Mitzpe Ramon' },
  { name: 'Timna', city: 'Eilat' },
  { name: 'Coral Beach', city: 'Eilat' },

  { name: 'City of David', city: 'Jerusalem' },
  { name: 'Ein Hemed', city: 'Jerusalem' },
  { name: 'Castel', city: 'Jerusalem' },
];

type GeoJsonGeometry = {
  type: 'Polygon' | 'MultiPolygon';
  coordinates: unknown;
};

type GeoJsonFeature = {
  properties: {
    PARK_ENG_NAME?: string;
    PARK_HEB_NAME?: string;
  };
  geometry: GeoJsonGeometry | null;
};

type GeoJsonResponse = {
  features: GeoJsonFeature[];
};

async function seed() {
  console.log('Adding regions...');

  const insertedRegions = await db
    .insert(regions)
    .values(regionData)
    .returning();

  const regionIds = new Map(
    insertedRegions.map((region) => [region.name, region.id]),
  );

  console.log('Adding cities...');

  const insertedCities = [];

  for (const city of cityData) {
    const regionId = regionIds.get(city.region);

    if (!regionId) {
      throw new Error(`Region not found: ${city.region}`);
    }

    const [insertedCity] = await db
      .insert(cities)
      .values({
        name: city.name,
        regionId,
      })
      .returning();

    insertedCities.push(insertedCity);
  }

  const cityIds = new Map(
    insertedCities.map((city) => [city.name, city.id]),
  );

  console.log('Getting real park polygons...');

  const params = new URLSearchParams({
    where: '1=1',
    outFields: 'PARK_ENG_NAME,PARK_HEB_NAME',
    returnGeometry: 'true',
    outSR: '4326',
    f: 'geojson',
  });

  const response = await fetch(`${GIS_URL}?${params}`);

  if (!response.ok) {
    throw new Error('Could not download park polygons');
  }

  const geoJson = (await response.json()) as GeoJsonResponse;

  let insertedParkCount = 0;

  console.log('Adding parks...');

  for (const wantedPark of parkData) {
    const feature = geoJson.features.find((feature) => {
      const englishName =
        feature.properties.PARK_ENG_NAME?.toLowerCase() ?? '';

      return englishName.includes(wantedPark.name.toLowerCase());
    });

    if (!feature?.geometry) {
      console.log(`Skipped: ${wantedPark.name} - polygon not found`);
      continue;
    }

    const cityId = cityIds.get(wantedPark.city);

    if (!cityId) {
      throw new Error(`City not found: ${wantedPark.city}`);
    }

    const center = getCenter(feature.geometry.coordinates);

    if (!center) {
      console.log(`Skipped: ${wantedPark.name} - center not found`);
      continue;
    }

    await db.insert(parks).values({
      name: wantedPark.name,
      description: `${wantedPark.name} in Israel`,
      creatorId: CREATOR_ID,
      openingDate: null,
      cityId,
      latitude: center.latitude,
      longitude: center.longitude,
      polygon: feature.geometry,
    });

    insertedParkCount++;

    console.log(`Added: ${wantedPark.name}`);
  }

  console.log('');
  console.log(`Seed completed - ${insertedParkCount} parks added`);
}

function getCenter(coordinates: unknown) {
  const points: [number, number][] = [];

  collectPoints(coordinates, points);

  if (points.length === 0) {
    return null;
  }

  const longitude =
    points.reduce((total, point) => total + point[0], 0) /
    points.length;

  const latitude =
    points.reduce((total, point) => total + point[1], 0) /
    points.length;

  return {
    latitude,
    longitude,
  };
}

function collectPoints(
  value: unknown,
  points: [number, number][],
) {
  if (!Array.isArray(value)) {
    return;
  }

  if (
    value.length >= 2 &&
    typeof value[0] === 'number' &&
    typeof value[1] === 'number'
  ) {
    points.push([value[0], value[1]]);
    return;
  }

  for (const child of value) {
    collectPoints(child, points);
  }
}

void seed();