import 'dotenv/config';

import {
  existsSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';

import { db } from './index';
import {
  cities,
  parks,
  regions,
} from './schema';

const CREATOR_ID = 12;

const NOMINATIM_URL =
  'https://nominatim.openstreetmap.org/search';

const CACHE_FILE =
  './src/.osm-park-cache.json';

const REQUEST_DELAY_MS = 1100;

type RegionName =
  | 'Central'
  | 'Northern'
  | 'Southern'
  | 'Jerusalem';

type ParkSeed = {
  name: string;

  osmQueries: string[];

  description: string;

  city: string;

  region: RegionName;
};

type GeoJsonGeometry = {
  type: 'Polygon' | 'MultiPolygon';
  coordinates: unknown;
};

type NominatimResult = {
  place_id: number;

  osm_type: string;
  osm_id: number;

  lat: string;
  lon: string;

  display_name: string;

  type: string;

  category?: string;
  class?: string;

  geojson?: GeoJsonGeometry;

  extratags?: {
    protect_class?: string;
    protection_title?: string;
  };
};

type CachedPark = {
  latitude: number;
  longitude: number;
  polygon: GeoJsonGeometry;

  osmType: string;
  osmId: number;
  displayName: string;
};

type OsmCache = Record<string, CachedPark>;

const parkData: ParkSeed[] = [
  // CENTRAL

  {
    name: 'Yarkon National Park',
    osmQueries: [
      'Yarkon National Park, Israel',
      'גן לאומי ירקון, ישראל',
    ],
    description:
      'National park around the Yarkon springs and historic Afek area.',
    city: 'Rosh HaAyin',
    region: 'Central',
  },

  {
    name: 'Apollonia National Park',
    osmQueries: [
      'Apollonia National Park, Israel',
      'גן לאומי אפולוניה, ישראל',
    ],
    description:
      'Coastal archaeological park overlooking the Mediterranean Sea.',
    city: 'Herzliya',
    region: 'Central',
  },

  {
    name: 'Caesarea National Park',
    osmQueries: [
      'Caesarea National Park, Israel',
      'גן לאומי קיסריה, ישראל',
    ],
    description:
      'Coastal national park preserving the ancient city and harbor of Caesarea.',
    city: 'Caesarea',
    region: 'Central',
  },

  {
    name: 'Alexander Stream National Park',
    osmQueries: [
      'Alexander Stream National Park, Israel',
      'גן לאומי נחל אלכסנדר, ישראל',
    ],
    description:
      'National park protecting the Alexander Stream and surrounding landscape.',
    city: 'Emek Hefer',
    region: 'Central',
  },

  {
    name: 'Palmachim Beach National Park',
    osmQueries: [
      'Palmachim National Park, Israel',
      'גן לאומי חוף פלמחים, ישראל',
    ],
    description:
      'Mediterranean coastal park with beaches, dunes, and archaeological remains.',
    city: 'Palmachim',
    region: 'Central',
  },

  {
    name: 'Taninim Stream Nature Reserve',
    osmQueries: [
      'Taninim Stream Nature Reserve, Israel',
      'שמורת טבע נחל תנינים, ישראל',
    ],
    description:
      'Nature reserve protecting the Taninim Stream and surrounding wetlands.',
    city: 'Jisr az-Zarqa',
    region: 'Central',
  },

  // NORTHERN

  {
    name: 'Akhziv National Park',
    osmQueries: [
      'Akhziv National Park, Israel',
      'Achziv National Park, Israel',
      'גן לאומי אכזיב, ישראל',
    ],
    description:
      'Mediterranean coastal national park with beaches and archaeological remains.',
    city: 'Nahariya',
    region: 'Northern',
  },

  {
    name: 'Beit Shearim National Park',
    osmQueries: [
      'Beit Shearim National Park, Israel',
      "Beit She'arim National Park, Israel",
      'גן לאומי בית שערים, ישראל',
    ],
    description:
      'National park preserving the ancient Jewish necropolis of Beit Shearim.',
    city: 'Kiryat Tivon',
    region: 'Northern',
  },

  {
    name: 'Zippori National Park',
    osmQueries: [
      'Zippori National Park, Israel',
      'Tzipori National Park, Israel',
      'גן לאומי ציפורי, ישראל',
    ],
    description:
      'Archaeological national park preserving the ancient city of Zippori.',
    city: 'Zippori',
    region: 'Northern',
  },

  {
    name: 'Arbel National Park',
    osmQueries: [
      'Arbel National Park, Israel',
      'Arbel Nature Reserve, Israel',
      'שמורת טבע וגן לאומי ארבל, ישראל',
    ],
    description:
      'Protected landscape around Mount Arbel and its dramatic cliffs.',
    city: 'Arbel',
    region: 'Northern',
  },

  {
    name: 'Hamat Tiberias National Park',
    osmQueries: [
      'Hamat Tiberias National Park, Israel',
      'גן לאומי חמת טבריה, ישראל',
    ],
    description:
      'National park preserving ancient remains and hot springs beside Tiberias.',
    city: 'Tiberias',
    region: 'Northern',
  },

  {
    name: 'Tel Dan Nature Reserve',
    osmQueries: [
      'Tel Dan Nature Reserve, Israel',
      'שמורת טבע תל דן, ישראל',
    ],
    description:
      'Nature reserve surrounding the Dan springs and ancient Tel Dan.',
    city: 'Dan',
    region: 'Northern',
  },

  {
    name: 'Banias Nature Reserve',
    osmQueries: [
      'Banias Nature Reserve, Israel',
      'Hermon Stream Nature Reserve, Israel',
      'שמורת טבע נחל חרמון בניאס, ישראל',
    ],
    description:
      'Nature reserve surrounding the Banias spring, stream, and waterfall.',
    city: 'Banias',
    region: 'Northern',
  },

  {
    name: 'Nimrod Fortress National Park',
    osmQueries: [
      'Nimrod Fortress National Park, Israel',
      'גן לאומי מבצר נמרוד, ישראל',
    ],
    description:
      'Mountain national park centered around the medieval Nimrod Fortress.',
    city: 'Nimrod',
    region: 'Northern',
  },

  {
    name: 'Tel Hazor National Park',
    osmQueries: [
      'Tel Hazor National Park, Israel',
      'גן לאומי תל חצור, ישראל',
    ],
    description:
      'National park preserving the archaeological remains of ancient Hazor.',
    city: 'Hazor HaGlilit',
    region: 'Northern',
  },

  {
    name: 'Baram National Park',
    osmQueries: [
      'Baram National Park, Israel',
      "Bar'am National Park, Israel",
      'גן לאומי ברעם, ישראל',
    ],
    description:
      'National park preserving the ancient synagogue and settlement of Baram.',
    city: 'Baram',
    region: 'Northern',
  },

  {
    name: 'Yehiam Fortress National Park',
    osmQueries: [
      'Yehiam Fortress National Park, Israel',
      'Yehiam National Park, Israel',
      'גן לאומי מבצר יחיעם, ישראל',
    ],
    description:
      'National park surrounding the historic Yehiam fortress.',
    city: 'Yehiam',
    region: 'Northern',
  },

  {
    name: 'Korazim National Park',
    osmQueries: [
      'Korazim National Park, Israel',
      'Chorazin National Park, Israel',
      'גן לאומי כורזים, ישראל',
    ],
    description:
      'National park preserving the remains of the ancient settlement of Korazim.',
    city: 'Korazim',
    region: 'Northern',
  },

  {
    name: 'Kursi National Park',
    osmQueries: [
      'Kursi National Park, Israel',
      'גן לאומי כורסי, ישראל',
    ],
    description:
      'Archaeological national park on the eastern shore of the Sea of Galilee.',
    city: 'Kursi',
    region: 'Northern',
  },

  {
    name: 'Capernaum National Park',
    osmQueries: [
      'Capernaum National Park, Israel',
      'Kfar Nahum National Park, Israel',
      'גן לאומי כפר נחום, ישראל',
    ],
    description:
      'Historic national park on the northern shore of the Sea of Galilee.',
    city: 'Kfar Nahum',
    region: 'Northern',
  },

  {
    name: 'Beit Shean National Park',
    osmQueries: [
      "Bet She'an National Park, Israel",
      'Beit Shean National Park, Israel',
      'גן לאומי בית שאן, ישראל',
    ],
    description:
      'National park preserving the extensive ancient city of Beit Shean.',
    city: 'Beit Shean',
    region: 'Northern',
  },

  {
    name: 'Belvoir National Park',
    osmQueries: [
      'Belvoir National Park, Israel',
      'Kokhav HaYarden National Park, Israel',
      'גן לאומי כוכב הירדן, ישראל',
    ],
    description:
      'National park centered around the Crusader fortress of Belvoir.',
    city: 'Kokhav HaYarden',
    region: 'Northern',
  },

  {
    name: 'Hula Nature Reserve',
    osmQueries: [
      'Hula Nature Reserve, Israel',
      'שמורת טבע החולה, ישראל',
    ],
    description:
      'Wetland nature reserve in the Hula Valley, known for birds and wildlife.',
    city: 'Hula Valley',
    region: 'Northern',
  },

  // SOUTHERN

  {
    name: 'Ashkelon National Park',
    osmQueries: [
      'Ashkelon National Park, Israel',
      'גן לאומי אשקלון, ישראל',
    ],
    description:
      'Coastal national park preserving the remains of ancient Ashkelon.',
    city: 'Ashkelon',
    region: 'Southern',
  },

  {
    name: 'Beit Guvrin-Maresha National Park',
    osmQueries: [
      'Beit Guvrin National Park, Israel',
      'Bet Guvrin-Maresha National Park, Israel',
      'גן לאומי בית גוברין, ישראל',
    ],
    description:
      'National park famous for ancient cities and extensive underground cave systems.',
    city: 'Beit Guvrin',
    region: 'Southern',
  },

  {
    name: 'Tel Beer Sheva National Park',
    osmQueries: [
      'Tel Beer Sheva National Park, Israel',
      "Tel Be'er Sheva National Park, Israel",
      'גן לאומי תל באר שבע, ישראל',
    ],
    description:
      'National park preserving the archaeological mound of Tel Beer Sheva.',
    city: 'Beer Sheva',
    region: 'Southern',
  },

  {
    name: 'Tel Arad National Park',
    osmQueries: [
      'Tel Arad National Park, Israel',
      'גן לאומי תל ערד, ישראל',
    ],
    description:
      'National park preserving archaeological remains from ancient Arad.',
    city: 'Arad',
    region: 'Southern',
  },

  {
    name: 'Masada National Park',
    osmQueries: [
      'Masada National Park, Israel',
      'גן לאומי מצדה, ישראל',
    ],
    description:
      'National park surrounding the ancient desert fortress of Masada.',
    city: 'Masada',
    region: 'Southern',
  },

  {
    name: 'Ein Gedi Nature Reserve',
    osmQueries: [
      'Ein Gedi Nature Reserve, Israel',
      'שמורת טבע עין גדי, ישראל',
    ],
    description:
      'Desert oasis nature reserve with springs, waterfalls, cliffs, and wildlife.',
    city: 'Ein Gedi',
    region: 'Southern',
  },

  {
    name: 'Avdat National Park',
    osmQueries: [
      'Avdat National Park, Israel',
      'Ovdat National Park, Israel',
      'גן לאומי עבדת, ישראל',
    ],
    description:
      'Desert national park preserving the ancient Nabataean city of Avdat.',
    city: 'Midreshet Ben-Gurion',
    region: 'Southern',
  },

  {
    name: 'Ein Avdat National Park',
    osmQueries: [
      'Ein Avdat National Park, Israel',
      'En Avdat National Park, Israel',
      'גן לאומי עין עבדת, ישראל',
    ],
    description:
      'Desert canyon national park centered around the springs of Ein Avdat.',
    city: 'Midreshet Ben-Gurion',
    region: 'Southern',
  },

  {
    name: 'Mamshit National Park',
    osmQueries: [
      'Mamshit National Park, Israel',
      'גן לאומי ממשית, ישראל',
    ],
    description:
      'National park preserving the ancient Nabataean city of Mamshit.',
    city: 'Dimona',
    region: 'Southern',
  },

  {
    name: 'Shivta National Park',
    osmQueries: [
      'Shivta National Park, Israel',
      'גן לאומי שבטה, ישראל',
    ],
    description:
      'National park preserving the ancient desert settlement of Shivta.',
    city: 'Shivta',
    region: 'Southern',
  },

  {
    name: 'Timna Park',
    osmQueries: [
      'Timna Park, Israel',
      'Timna Valley Park, Israel',
      'פארק תמנע, ישראל',
    ],
    description:
      'Large desert park featuring dramatic geological formations and ancient mining sites.',
    city: 'Eilat',
    region: 'Southern',
  },

  {
    name: 'Coral Beach Nature Reserve',
    osmQueries: [
      'Coral Beach Nature Reserve, Eilat, Israel',
      'שמורת טבע חוף האלמוגים, אילת',
    ],
    description:
      'Marine nature reserve protecting the coral reef along the Gulf of Eilat.',
    city: 'Eilat',
    region: 'Southern',
  },

  // JERUSALEM

  {
    name: 'Ein Hemed National Park',
    osmQueries: [
      'Ein Hemed National Park, Israel',
      'En Hemed National Park, Israel',
      'גן לאומי עין חמד, ישראל',
    ],
    description:
      'National park in the Jerusalem Hills with springs and Crusader remains.',
    city: 'Abu Ghosh',
    region: 'Jerusalem',
  },

  {
    name: 'Castel National Park',
    osmQueries: [
      'Castel National Park, Israel',
      'The Castel National Park, Israel',
      'גן לאומי הקסטל, ישראל',
    ],
    description:
      'Historic national park on the Castel hill in the Jerusalem Hills.',
    city: 'Mevaseret Zion',
    region: 'Jerusalem',
  },

  {
    name: 'Jerusalem Walls National Park',
    osmQueries: [
      'Jerusalem Walls National Park, Israel',
      'גן לאומי סובב חומות ירושלים, ישראל',
    ],
    description:
      'National park surrounding important archaeological and historic areas of Jerusalem.',
    city: 'Jerusalem',
    region: 'Jerusalem',
  },

  {
    name: 'Herodium National Park',
    osmQueries: [
      'Herodium National Park, Israel',
      'Herodion National Park, Israel',
      'גן לאומי הרודיון, ישראל',
    ],
    description:
      'National park centered around the ancient palace-fortress of Herodium.',
    city: 'Herodium',
    region: 'Jerusalem',
  },
];

function loadCache(): OsmCache {
  if (!existsSync(CACHE_FILE)) {
    return {};
  }

  return JSON.parse(
    readFileSync(
      CACHE_FILE,
      'utf8',
    ),
  ) as OsmCache;
}

function saveCache(cache: OsmCache) {
  writeFileSync(
    CACHE_FILE,
    JSON.stringify(
      cache,
      null,
      2,
    ),
  );
}

function sleep(milliseconds: number) {
  return new Promise<void>((resolve) => {
    setTimeout(
      resolve,
      milliseconds,
    );
  });
}

function isPolygon(
  geometry: GeoJsonGeometry | undefined,
): geometry is GeoJsonGeometry {
  return (
    geometry?.type === 'Polygon' ||
    geometry?.type === 'MultiPolygon'
  );
}

function scoreResult(
  result: NominatimResult,
) {
  let score = 0;

  if (!isPolygon(result.geojson)) {
    return -1000;
  }

  if (
    result.osm_type === 'relation'
  ) {
    score += 10;
  }

  if (result.osm_type === 'way') {
    score += 5;
  }

  if (
    result.type === 'protected_area'
  ) {
    score += 20;
  }

  if (
    result.type === 'national_park'
  ) {
    score += 20;
  }

  if (
    result.type === 'nature_reserve'
  ) {
    score += 20;
  }

  if (
    result.extratags?.protect_class === '1' ||
    result.extratags?.protect_class === '2'
  ) {
    score += 20;
  }

  return score;
}

async function findParkOnOsm(
  park: ParkSeed,
  cache: OsmCache,
): Promise<CachedPark | null> {
  const cached = cache[park.name];

  if (cached) {
    console.log(
      `Using cache: ${park.name}`,
    );

    return cached;
  }

  for (
    const query of park.osmQueries
  ) {
    console.log(
      `OSM search: ${query}`,
    );

    const params =
      new URLSearchParams({
        q: query,

        format: 'jsonv2',

        limit: '5',

        countrycodes: 'il',

        polygon_geojson: '1',

        addressdetails: '1',

        extratags: '1',
      });

    const response = await fetch(
      `${NOMINATIM_URL}?${params}`,
      {
        headers: {
          'User-Agent':
            'ParkExplorerStudentProject/1.0',
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Nominatim failed: ${response.status} ${response.statusText}`,
      );
    }

    const results =
      (await response.json()) as NominatimResult[];

    const bestResult = results
      .filter((result) =>
        isPolygon(result.geojson),
      )
      .sort(
        (first, second) =>
          scoreResult(second) -
          scoreResult(first),
      )[0];

    await sleep(
      REQUEST_DELAY_MS,
    );

    if (!bestResult?.geojson) {
      continue;
    }

    const result: CachedPark = {
      latitude: Number(
        bestResult.lat,
      ),

      longitude: Number(
        bestResult.lon,
      ),

      polygon:
        bestResult.geojson,

      osmType:
        bestResult.osm_type,

      osmId:
        bestResult.osm_id,

      displayName:
        bestResult.display_name,
    };

    cache[park.name] = result;

    saveCache(cache);

    return result;
  }

  return null;
}

function fakeOpeningDate(
  index: number,
) {
  const year =
    1998 + (index % 25);

  const month =
    (index % 12) + 1;

  const day =
    ((index * 7) % 27) + 1;

  return [
    year,

    String(month).padStart(
      2,
      '0',
    ),

    String(day).padStart(
      2,
      '0',
    ),
  ].join('-');
}

async function seed() {
  console.log(
    'Starting seed...',
  );

  console.log(
    'Clearing old park/location seed data...',
  );

  await db.delete(parks);
  await db.delete(cities);
  await db.delete(regions);

  const regionNames: RegionName[] = [
    'Central',
    'Northern',
    'Southern',
    'Jerusalem',
  ];

  console.log(
    'Adding regions...',
  );

  const insertedRegions =
    await db
      .insert(regions)
      .values(
        regionNames.map(
          (name) => ({
            name,
          }),
        ),
      )
      .returning();

  const regionIds = new Map(
    insertedRegions.map(
      (region) => [
        region.name,
        region.id,
      ],
    ),
  );

  const uniqueCities =
    new Map<
      string,
      {
        name: string;
        region: RegionName;
      }
    >();

  for (const park of parkData) {
    uniqueCities.set(
      `${park.region}:${park.city}`,
      {
        name: park.city,
        region: park.region,
      },
    );
  }

  console.log(
    'Adding cities...',
  );

  const cityIds =
    new Map<string, number>();

  for (
    const city of uniqueCities.values()
  ) {
    const regionId =
      regionIds.get(
        city.region,
      );

    if (!regionId) {
      throw new Error(
        `Region not found: ${city.region}`,
      );
    }

    const [insertedCity] =
      await db
        .insert(cities)
        .values({
          name: city.name,
          regionId,
        })
        .returning();

    cityIds.set(
      `${city.region}:${city.name}`,
      insertedCity.id,
    );
  }

  const cache =
    loadCache();

  let added = 0;
  let skipped = 0;

  console.log(
    'Getting real OpenStreetMap park data...',
  );

  for (
    let index = 0;
    index < parkData.length;
    index++
  ) {
    const park =
      parkData[index];

    console.log('');
    console.log(
      `Looking for ${park.name}...`,
    );

    const osmPark =
      await findParkOnOsm(
        park,
        cache,
      );

    if (!osmPark) {
      console.log(
        `SKIPPED: ${park.name} - no usable OSM polygon`,
      );

      skipped++;

      continue;
    }

    const cityId =
      cityIds.get(
        `${park.region}:${park.city}`,
      );

    if (!cityId) {
      throw new Error(
        `City not found: ${park.city}`,
      );
    }

    await db
      .insert(parks)
      .values({
        name:
          park.name,

        description:
          park.description,

        creatorId:
          CREATOR_ID,

        openingDate:
          fakeOpeningDate(
            index,
          ),

        cityId,

        // IMPORTANT:
        // use the representative location
        // supplied by OpenStreetMap/Nominatim.
        latitude:
          osmPark.latitude,

        longitude:
          osmPark.longitude,

        // Actual OSM geometry.
        polygon:
          osmPark.polygon,
      });

    console.log(
      `ADDED: ${park.name}`,
    );

    console.log(
      `  OSM: ${osmPark.osmType}/${osmPark.osmId}`,
    );

    console.log(
      `  Marker: ${osmPark.latitude}, ${osmPark.longitude}`,
    );

    console.log(
      `  Geometry: ${osmPark.polygon.type}`,
    );

    console.log(
      `  Opening date: ${fakeOpeningDate(index)} (demo)`,
    );

    added++;
  }

  console.log('');
  console.log(
    '==============================',
  );

  console.log(
    `Seed completed.`,
  );

  console.log(
    `Added: ${added}`,
  );

  console.log(
    `Skipped: ${skipped}`,
  );

  console.log(
    `Requested: ${parkData.length}`,
  );

  console.log(
    '==============================',
  );
}

void seed();