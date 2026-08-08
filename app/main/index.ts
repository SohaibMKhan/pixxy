import { app, BrowserWindow, ipcMain, Menu, nativeImage, Tray } from 'electron'
import fs from 'node:fs'
import path from 'node:path'

let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null
let isQuitting = false

export type PixxySettings = {
  completedOnboarding: boolean
  displayName: string
  roomTheme: 'meadow' | 'moonlight' | 'sunset'
  alwaysOnTop: boolean
  desktopAwarenessEnabled: boolean
  launchAtLogin: boolean
}

const defaultSettings: PixxySettings = {
  completedOnboarding: false,
  displayName: '',
  roomTheme: 'meadow',
  alwaysOnTop: false,
  desktopAwarenessEnabled: false,
  launchAtLogin: false,
}

function settingsPath() {
  return path.join(app.getPath('userData'), 'settings.json')
}

function readSettings(): PixxySettings {
  try {
    return { ...defaultSettings, ...JSON.parse(fs.readFileSync(settingsPath(), 'utf8')) }
  } catch {
    return defaultSettings
  }
}

function writeSettings(settings: PixxySettings) {
  fs.mkdirSync(app.getPath('userData'), { recursive: true })
  fs.writeFileSync(settingsPath(), JSON.stringify(settings, null, 2), 'utf8')
}

function applySettings(settings: PixxySettings) {
  mainWindow?.setAlwaysOnTop(settings.alwaysOnTop, 'screen-saver')
  app.setLoginItemSettings({ openAtLogin: settings.launchAtLogin })
}

function createTray() {
  const icon = nativeImage.createFromDataURL(
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHJ4PSI4IiBmaWxsPSIjMjY1ZjczIi8+PGNpcmNsZSBjeD0iMTEiIGN5PSIxMyIgcj0iMyIgZmlsbD0iI2ZmZiIvPjxjaXJjbGUgY3g9IjIxIiBjeT0iMTMiIHI9IjMiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNOSAyMGM0IDMgMTAgMyAxNCAwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PC9zdmc+'
  )
  tray = new Tray(icon)
  tray.setToolTip('Pixxy')
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'Show Pixxy', click: () => mainWindow?.show() },
    { label: 'Hide Pixxy', click: () => mainWindow?.hide() },
    { type: 'separator' },
    { label: 'Exit', click: () => app.quit() },
  ]))
  tray.on('click', () => mainWindow?.isVisible() ? mainWindow.hide() : mainWindow?.show())
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 380,
    height: 440,
    minWidth: 340,
    minHeight: 400,
    transparent: true,
    frame: false,
    resizable: true,
    alwaysOnTop: readSettings().alwaysOnTop,
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (process.env.ELECTRON_RENDERER_URL) {
    void mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    void mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }

  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault()
      mainWindow?.hide()
    }
  })
}

app.whenReady().then(() => {
  ipcMain.handle('settings:read', () => readSettings())
  ipcMain.handle('settings:update', (_event, update: Partial<PixxySettings>) => {
    const settings = { ...readSettings(), ...update }
    writeSettings(settings)
    applySettings(settings)
    return settings
  })

  createWindow()
  createTray()

  app.on('before-quit', () => {
    isQuitting = true
    tray?.destroy()
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
