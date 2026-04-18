/**
 * Central list of IPC channel names.
 * Main and preload import this so channel strings stay in one place.
 */
export const IPC_CHANNELS = {
  /** Request: none. Response: {@link import('../types/user').UserDto}[] */
  USERS_LIST: 'users:list'
} as const

export type IpcChannel = (typeof IPC_CHANNELS)[keyof typeof IPC_CHANNELS]
