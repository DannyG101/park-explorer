import { integer, pgTable, text } from 'drizzle-orm/pg-core';

export const regions = pgTable('regions', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull(),
});
