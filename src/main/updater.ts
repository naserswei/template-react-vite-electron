import { app, BrowserWindow, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
import { IPC_CHANNELS } from '../shared/ipc/channels'
import type { UpdaterStatus } from '../shared/types/updater'

function sendUpdaterStatus(mainWindow: BrowserWindow, status: UpdaterStatus): void {
  if (!mainWindow.isDestroyed()) {
    mainWindow.webContents.send(IPC_CHANNELS.UPDATER_STATUS, status)
  }
}

export function setupAutoUpdater(mainWindow: BrowserWindow): void {
  if (!app.isPackaged) {
    return
  }

  autoUpdater.autoDownload = true

  autoUpdater.on('checking-for-update', () => {
    sendUpdaterStatus(mainWindow, { type: 'checking' })
  })

  autoUpdater.on('update-available', (info) => {
    sendUpdaterStatus(mainWindow, { type: 'available', version: info.version })
  })

  autoUpdater.on('update-not-available', () => {
    sendUpdaterStatus(mainWindow, { type: 'not-available' })
  })

  autoUpdater.on('download-progress', (progress) => {
    sendUpdaterStatus(mainWindow, {
      type: 'downloading',
      percent: Math.round(progress.percent)
    })
  })

  autoUpdater.on('update-downloaded', (info) => {
    sendUpdaterStatus(mainWindow, { type: 'downloaded', version: info.version })
  })

  autoUpdater.on('error', (error) => {
    console.error('Auto update error:', error)
    sendUpdaterStatus(mainWindow, { type: 'error', message: error.message })
  })

  ipcMain.handle(IPC_CHANNELS.UPDATER_INSTALL_NOW, async () => {
    sendUpdaterStatus(mainWindow, { type: 'installing' })

    if (!mainWindow.isDestroyed()) {
      mainWindow.hide()
    }

    setTimeout(() => {
      autoUpdater.quitAndInstall(false, true)
    }, 100)
  })

  const checkForUpdates = (): void => {
    autoUpdater.checkForUpdates().catch((error) => {
      console.error('Update check failed:', error)
      sendUpdaterStatus(mainWindow, { type: 'error', message: error.message })
    })
  }

  if (mainWindow.webContents.isLoading()) {
    mainWindow.webContents.once('did-finish-load', checkForUpdates)
  } else {
    checkForUpdates()
  }
}
