import { app, BrowserWindow, ipcMain, Menu, nativeImage, screen, Tray } from 'electron'
import fs from 'node:fs'
import path from 'node:path'

let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null
let isQuitting = false

const PROFILE_VERSION = 2
const PET_WINDOW_WIDTH = 190
const PET_WINDOW_HEIGHT = 205
const SETTINGS_WINDOW_WIDTH = 340
const SETTINGS_WINDOW_HEIGHT = 430

const pixxyIcon = nativeImage.createFromDataURL(
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHJ4PSI4IiBmaWxsPSIjMjY1ZjczIi8+PGNpcmNsZSBjeD0iMTEiIGN5PSIxMyIgcj0iMyIgZmlsbD0iI2ZmZiIvPjxjaXJjbGUgY3g9IjIxIiBjeT0iMTMiIHI9IjMiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNOSAyMGM0IDMgMTAgMyAxNCAwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PC9zdmc+',
)

export type PixxySettings = {
  profileVersion: number
  completedOnboarding: boolean
  displayName: string
  roomTheme: 'meadow' | 'moonlight' | 'sunset' | 'ocean' | 'lavender' | 'peach'
  alwaysOnTop: boolean
  desktopAwarenessEnabled: boolean
  launchAtLogin: boolean
}

const defaultSettings: PixxySettings = {
  profileVersion: PROFILE_VERSION,
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

function workArea() {
  return screen.getPrimaryDisplay().workArea
}

function clampWindowX(x: number, width: number) {
  const area = workArea()
  return Math.min(Math.max(x, area.x), area.x + area.width - width)
}

function readSettings(): PixxySettings {
  try {
    const saved = JSON.parse(fs.readFileSync(settingsPath(), 'utf8'))
    if (saved.profileVersion !== PROFILE_VERSION) return defaultSettings

    const validThemes: PixxySettings['roomTheme'][] = ['meadow', 'moonlight', 'sunset', 'ocean', 'lavender', 'peach']
    return {
      ...defaultSettings,
      ...saved,
      roomTheme: validThemes.includes(saved.roomTheme) ? saved.roomTheme : defaultSettings.roomTheme,
    }
  } catch {
    return defaultSettings
  }
}

function writeSettings(settings: PixxySettings) {
  fs.mkdirSync(path.dirname(settingsPath()), { recursive: true })
  fs.writeFileSync(settingsPath(), JSON.stringify(settings, null, 2), 'utf8')
}

function applySettings(settings: PixxySettings) {
  mainWindow?.setAlwaysOnTop(settings.alwaysOnTop, 'screen-saver')
  app.setLoginItemSettings({ openAtLogin: settings.launchAtLogin })
}

function setWindowMode(mode: 'pet' | 'settings') {
  if (!mainWindow) return

  const area = workArea()
  const bounds = mainWindow.getBounds()
  const width = mode === 'settings' ? SETTINGS_WINDOW_WIDTH : PET_WINDOW_WIDTH
  const height = mode === 'settings' ? SETTINGS_WINDOW_HEIGHT : PET_WINDOW_HEIGHT
  const x = clampWindowX(bounds.x, width)
  const y = area.y + area.height - height

  mainWindow.setBounds({ x, y, width, height }, true)
}

function createTray() {
  tray = new Tray(pixxyIcon)
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
  app.setAppUserModelId('com.pixxy.desktop')

  const area = workArea()
  const width = PET_WINDOW_WIDTH
  const height = PET_WINDOW_HEIGHT
  const x = clampWindowX(area.x + 80, width)
  const y = area.y + area.height - height

  mainWindow = new BrowserWindow({
    width,
    height,
    x,
    y,
    minWidth: width,
    minHeight: height,
    transparent: true,
    frame: false,
    resizable: false,
    focusable: true,
    alwaysOnTop: readSettings().alwaysOnTop,
    skipTaskbar: false,
    icon: pixxyIcon,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
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
    const settings = { ...readSettings(), ...update, profileVersion: PROFILE_VERSION }
    writeSettings(settings)
    applySettings(settings)
    return settings
  })

  ipcMain.on('window:set-settings-open', (_event, open: boolean) => {
    setWindowMode(open ? 'settings' : 'pet')
  })

  ipcMain.handle('window:move-by', (_event, delta: number) => {
    if (!mainWindow) return { x: 0, hitBoundary: false }

    const bounds = mainWindow.getBounds()
    const nextX = clampWindowX(bounds.x + delta, bounds.width)
    const hitBoundary = nextX === bounds.x && delta !== 0
    if (nextX !== bounds.x) {
      const area = workArea()
      mainWindow.setPosition(nextX, area.y + area.height - bounds.height, true)
    }

    return { x: nextX, hitBoundary }
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
