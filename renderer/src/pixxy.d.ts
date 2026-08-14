export {}

declare global {
  type PixxySettings = {
    profileVersion: number
    completedOnboarding: boolean
    displayName: string
    alwaysOnTop: boolean
    launchAtLogin: boolean
  }

  interface Window {
    pixxy: {
      version: string
      settings: {
        read: () => Promise<PixxySettings>
        update: (settings: Partial<PixxySettings>) => Promise<PixxySettings>
      }
      window: {
        setSettingsOpen: (open: boolean) => void
        setMousePassthrough: (passthrough: boolean) => void
        moveBy: (dx: number, dy: number) => void
      }
    }
  }
}
