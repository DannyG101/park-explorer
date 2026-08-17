import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';

export const sessions = pgTable('sessions', {
  token: text('token').primaryKey(),

  userId: integer('user_id')
    .notNull()
    .references(() => users.id),

  expiresAt: timestamp('expires_at').notNull(),
});