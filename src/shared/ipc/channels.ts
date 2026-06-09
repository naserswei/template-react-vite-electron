/**
 * Central list of IPC channel names.
 * Main and preload import this so channel strings stay in one place.
 */
export const IPC_CHANNELS = {
  /** Request: none. Response: {@link import('../types/user').UserDto}[] */
  USERS_LIST: 'users:list',
  /** Main -> renderer: update lifecycle event. */
  UPDATER_STATUS: 'updater:status',
  /** Renderer -> main: apply downloaded update now. */
  UPDATER_INSTALL_NOW: 'updater:install-now'
} as const

export type IpcChannel = (typeof IPC_CHANNELS)[keyof typeof IPC_CHANNELS]
