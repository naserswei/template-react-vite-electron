import { asc } from 'drizzle-orm'
import { getDb } from '../../db/db'
import { usersTable } from '../../db/models/schema'

export type UserRow = typeof usersTable.$inferSelect

/**
 * Loads all users ordered by id. Runs in the main process only.
 */
export async function listUsers(): Promise<UserRow[]> {
  const db = getDb()
  return db.select().from(usersTable).orderBy(asc(usersTable.id))
}
