import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/main/db/models/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DB_FILE_NAME!,
  },
});
