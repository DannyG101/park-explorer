import { integer, pgTable, text } from 'drizzle-orm/pg-core';
import { parks } from './parks';

export const parkImages = pgTable('park_images', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),

  parkId: integer('park_id')
    .notNull()
    .references(() => parks.id),

  url: text('url').notNull(),
});
