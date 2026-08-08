import { contextBridge } from 'electron'

contextBridge.exposeInMainWorld('pixxy', {
  version: '0.1.0',
})
