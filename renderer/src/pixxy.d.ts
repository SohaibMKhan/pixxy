Exit code: 0
Wall time: 0.4 seconds
Output:
export {}

declare global {
  type PixxySettings = {
    completedOnboarding: boolean
    displayName: string
    roomTheme: 'meadow' | 'moonlight' | 'sunset'
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
    }
  }
}

