import { registerUsersIpcHandlers } from '../modules/users/users.ipc'

/**
 * Single entry point to register all IPC handlers for the main process.
 */
export function registerIpcHandlers(): void {
  registerUsersIpcHandlers()
}
