import { integer, pgTable, text } from 'drizzle-orm/pg-core';
import { regions } from './regions';

export const cities = pgTable('cities', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull(),

  regionId: integer('region_id')
    .notNull()
    .references(() => regions.id),
});
