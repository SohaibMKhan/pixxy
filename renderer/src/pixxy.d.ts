export {}

declare global {
  type PixxySettings = {
    profileVersion: number
    completedOnboarding: boolean
    displayName: string
    roomTheme: 'meadow' | 'moonlight' | 'sunset' | 'ocean' | 'lavender' | 'peach'
    alwaysOnTop: boolean
    desktopAwarenessEnabled: boolean
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
        moveBy: (delta: number) => Promise<{ x: number; hitBoundary: boolean }>
      }
    }
  }
}
