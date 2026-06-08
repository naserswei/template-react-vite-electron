import { drizzle } from 'drizzle-orm/libsql'
import { migrate } from 'drizzle-orm/libsql/migrator'
import * as schema from './models/schema'

type AppDatabase = ReturnType<typeof drizzle<typeof schema>>

let instance: AppDatabase | null = null

/**
 * Creates the Drizzle client once. Call from:
 * - `app.whenReady()` in main (after resolving DB URL)
 * - CLI scripts (e.g. seed) after `dotenv/config`
 */
export function initializeDatabase(connectionUrl: string): AppDatabase {
  if (instance !== null) {
    return instance
  }
  instance = drizzle({
    connection: { url: connectionUrl },
    schema
  })
  return instance
}

/**
 * Returns the singleton DB. Throws if `initializeDatabase` was not called.
 */
export function getDb(): AppDatabase {
  if (instance === null) {
    throw new Error(
      'Database not initialized. Call initializeDatabase() from main or a CLI script first.'
    )
  }
  return instance
}

export async function migrateDatabase(migrationsFolder: string): Promise<void> {
  await migrate(getDb(), { migrationsFolder })
}
