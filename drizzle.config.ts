import { defineConfig } from 'drizzle-kit';
import { env } from './src/env';

export default defineConfig({
  out: './drizzle',
  schema: './src/lib/db/schema',
  dialect: 'sqlite',
  dbCredentials: {
    url: env.DB_FILE_NAME,
  },
});
