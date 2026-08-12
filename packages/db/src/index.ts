import * as dotenv from 'dotenv';
import { resolve } from 'node:path';

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

dotenv.config({
  path: resolve(__dirname, '../.env'),
});

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is missing');
}

const sql = neon(databaseUrl);

export const db = drizzle(sql, { schema });
