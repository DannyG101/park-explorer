import 'dotenv/config';
import { db } from './index';
import { cities, regions } from './schema';

const regionData = [
  { name: 'Central' },
  { name: 'Northern' },
  { name: 'Southern' },
  { name: 'Jerusalem' },
];

async function seed() {
  const insertedRegions = await db
    .insert(regions)
    .values(regionData)
    .returning();

  const regionsList = insertedRegions.map(
    (region) => [region.name, region.id] as [string, number],
  );

  const regionIds = new Map(regionsList);

  const cityData = [
    {
      name: 'Petach Tikva',
      regionId: regionIds.get('Central')!,
    },
    {
      name: 'Haifa',
      regionId: regionIds.get('Northern')!,
    },
    {
      name: 'Beer Sheva',
      regionId: regionIds.get('Southern')!,
    },
    {
      name: 'Jerusalem',
      regionId: regionIds.get('Jerusalem')!,
    },
  ];

  await db.insert(cities).values(cityData);

  console.log('Seed completed');
}

void seed();
