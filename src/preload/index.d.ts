import { ElectronAPI } from '@electron-toolkit/preload'
import type { UpdaterStatusListener } from '../shared/types/updater'
import type { UserDto } from '../shared/types/user'

/**
 * Custom APIs exposed via preload (`contextBridge`).
 */
export interface AppPreloadApi {
  users: {
    list: () => Promise<UserDto[]>
  }
  updater: {
    onStatus: (listener: UpdaterStatusListener) => () => void
    installNow: () => Promise<void>
  }
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: AppPreloadApi
  }
}
