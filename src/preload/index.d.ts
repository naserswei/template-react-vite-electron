import { ElectronAPI } from '@electron-toolkit/preload'
import type { UserDto } from '../shared/types/user'

/**
 * Custom APIs exposed via preload (`contextBridge`).
 */
export interface AppPreloadApi {
  users: {
    list: () => Promise<UserDto[]>
  }
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: AppPreloadApi
  }
}
