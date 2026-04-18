/**
 * Seeds `users_table` for local development.
 *
 * Prerequisite: apply migrations first, e.g. `npm run db:migrate`
 * (uses `DB_FILE_NAME` from `.env`, same as the app).
 */
import 'dotenv/config'
import { initializeDatabase, getDb } from '../src/main/db/db'
import { usersTable } from '../src/main/db/models/schema'

const url = process.env.DB_FILE_NAME
if (url === undefined || url.length === 0) {
  throw new Error('DB_FILE_NAME is missing. Set it in .env (e.g. file:local.db).')
}

initializeDatabase(url)

async function seed(): Promise<void> {
  const db = getDb()
  const existing = await db.select().from(usersTable)

  if (existing.length > 0) {
    console.log(`Seed skipped: users_table already has ${existing.length} row(s).`)
    return
  }

  await db.insert(usersTable).values([
    { name: 'Ada Lovelace', age: 36, email: 'ada@example.com' },
    { name: 'Alan Turing', age: 41, email: 'alan@example.com' },
    { name: 'Grace Hopper', age: 85, email: 'grace@example.com' }
  ])

  console.log('Seed completed: inserted 3 users.')
}

seed().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
