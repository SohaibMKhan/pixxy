Exit code: 0
Wall time: 0.4 seconds
Output:
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('pixxy', {
  version: '0.1.0',
  settings: {
    read: () => ipcRenderer.invoke('settings:read'),
    update: (settings: Record<string, unknown>) => ipcRenderer.invoke('settings:update', settings),
  },
})

