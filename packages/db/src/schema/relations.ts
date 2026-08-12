import { relations } from 'drizzle-orm';

import { regions } from './regions';
import { cities } from './cities';
import { users } from './users';
import { parks } from './parks';
import { parkImages } from './park-images';

export const regionsRelations = relations(regions, ({ many }) => ({
  cities: many(cities),
}));

export const citiesRelations = relations(cities, ({ one, many }) => ({
  region: one(regions, {
    fields: [cities.regionId],
    references: [regions.id],
  }),

  parks: many(parks),
}));

export const usersRelations = relations(users, ({ many }) => ({
  parks: many(parks),
}));

export const parksRelations = relations(parks, ({ one, many }) => ({
  city: one(cities, {
    fields: [parks.cityId],
    references: [cities.id],
  }),

  creator: one(users, {
    fields: [parks.creatorId],
    references: [users.id],
  }),

  images: many(parkImages),
}));

export const parkImagesRelations = relations(parkImages, ({ one }) => ({
  park: one(parks, {
    fields: [parkImages.parkId],
    references: [parks.id],
  }),
}));
