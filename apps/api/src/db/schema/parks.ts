import {
  date,
  integer,
  jsonb,
  pgTable,
  real,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

import { cities } from './cities';
import { users } from './users';

export const parks = pgTable('parks', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),

  name: text('name').notNull(),
  description: text('description').notNull(),

  creatorId: integer('creator_id')
    .notNull()
    .references(() => users.id),

  openingDate: date('opening_date'),

  cityId: integer('city_id')
    .notNull()
    .references(() => cities.id),

  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),

  polygon: jsonb('polygon'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
