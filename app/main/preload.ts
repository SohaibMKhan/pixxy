import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('pixxy', {
  version: '0.1.0',
  settings: {
    read: () => ipcRenderer.invoke('settings:read'),
    update: (settings: Record<string, unknown>) => ipcRenderer.invoke('settings:update', settings),
  },
  window: {
    setSettingsOpen: (open: boolean) => ipcRenderer.send('window:set-settings-open', open),
    setMousePassthrough: (passthrough: boolean) => ipcRenderer.send('window:set-mouse-passthrough', passthrough),
    moveBy: (delta: number) => ipcRenderer.invoke('window:move-by', delta) as Promise<{ x: number; hitBoundary: boolean }>,
  },
})
