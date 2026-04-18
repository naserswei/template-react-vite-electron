import { join } from 'node:path'
import { app } from 'electron'

/**
 * Resolves the libSQL/SQLite URL for the running app.
 * - Prefers `DB_FILE_NAME` from `.env` (dev, drizzle-kit, seed).
 * - Falls back to a file under Electron `userData` when packaged or env is missing.
 */
export function resolveDatabaseUrl(): string {
  const fromEnv = process.env.DB_FILE_NAME
  if (fromEnv !== undefined && fromEnv.length > 0) {
    return fromEnv
  }
  return `file:${join(app.getPath('userData'), 'app.db')}`
}
