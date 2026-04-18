/**
 * Serializable user shape sent from main → renderer over IPC.
 * Keep in sync with `users_table` in Drizzle schema.
 */
export type UserDto = {
  id: number
  name: string
  age: number
  email: string
}
