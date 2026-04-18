import { ipcMain } from 'electron'
import { IPC_CHANNELS } from '../../../shared/ipc/channels'
import type { UserDto } from '../../../shared/types/user'
import * as userRepository from './user.repository'

/**
 * Maps a DB row to the IPC contract type (explicit, easy to evolve).
 */
function toDto(row: userRepository.UserRow): UserDto {
  return {
    id: row.id,
    name: row.name,
    age: row.age,
    email: row.email
  }
}

/**
 * Registers user-related `ipcMain.handle` listeners.
 */
export function registerUsersIpcHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.USERS_LIST, async (): Promise<UserDto[]> => {
    const rows = await userRepository.listUsers()
    return rows.map(toDto)
  })
}
