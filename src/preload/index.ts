import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { IPC_CHANNELS } from '../shared/ipc/channels'
import type { UserDto } from '../shared/types/user'

/**
 * Thin, whitelisted API exposed to the renderer. No DB or business logic here.
 */
const api = {
  users: {
    /**
     * Fetches all users from the main process (Drizzle query over IPC).
     */
    list: (): Promise<UserDto[]> => ipcRenderer.invoke(IPC_CHANNELS.USERS_LIST)
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-expect-error (defined in d.ts)
  window.electron = electronAPI
  // @ts-expect-error (defined in d.ts)
  window.api = api
}
