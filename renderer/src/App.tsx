Exit code: 0
Wall time: 0.4 seconds
Output:
import { useEffect, useState } from 'react'

const initialSettings: PixxySettings = {
  completedOnboarding: false,
  displayName: '',
  roomTheme: 'meadow',
  alwaysOnTop: false,
  desktopAwarenessEnabled: false,
  launchAtLogin: false,
}

export default function App() {
  const [settings, setSettings] = useState<PixxySettings>(initialSettings)
  const [ready, setReady] = useState(false)
  const [panel, setPanel] = useState<'menu' | 'settings' | 'onboarding'>('onboarding')
  const [name, setName] = useState('')

  useEffect(() => {
    void window.pixxy.settings.read().then((saved) => {
      setSettings(saved)
      setName(saved.displayName)
      setPanel(saved.completedOnboarding ? 'menu' : 'onboarding')
      setReady(true)
    })
  }, [])

  async function update(update: Partial<PixxySettings>) {
    const saved = await window.pixxy.settings.update(update)
    setSettings(saved)
  }

  async function finishOnboarding() {
    const saved = await window.pixxy.settings.update({
      completedOnboarding: true,
      displayName: name.trim() || 'friend',
    })
    setSettings(saved)
    setPanel('menu')
  }

  if (!ready) return null

  return (
    <main className={`pixxy-shell theme-${settings.roomTheme}`} aria-label="Pixxy desktop companion">
      <button className="pet" type="button" aria-label="Open Pixxy interactions" onClick={() => setPanel('menu')}>
        <span className="pet-ear pet-ear-left" />
        <span className="pet-ear pet-ear-right" />
        <span className="pet-face"><i /><i /><b /></span>
      </button>

      {panel === 'onboarding' && (
        <section className="panel welcome-panel" aria-label="Welcome to Pixxy">
          <p className="eyebrow">Hello, I am Pixxy</p>
          <h1>What should I call you?</h1>
          <label>
            Your name
            <input value={name} onChange={(event) => setName(event.target.value)} maxLength={32} autoFocus />
          </label>
          <p className="supporting-copy">I only notice desktop activity when you choose to enable it in Settings.</p>
          <button className="primary-action" type="button" onClick={() => void finishOnboarding()}>Continue</button>
        </section>
      )}

      {panel === 'menu' && (
        <section className="panel menu-panel" aria-label="Pixxy interactions">
          <p className="greeting">Hi, {settings.displayName}.</p>
          <button className="text-action" type="button" onClick={() => setPanel('settings')}>Settings</button>
        </section>
      )}

      {panel === 'settings' && (
        <section className="panel settings-panel" aria-label="Pixxy settings">
          <div className="panel-header"><h1>Settings</h1><button className="close-button" type="button" aria-label="Close settings" onClick={() => setPanel('menu')}>x</button></div>
          <label className="toggle-row"><span>Always on top</span><input type="checkbox" checked={settings.alwaysOnTop} onChange={(event) => void update({ alwaysOnTop: event.target.checked })} /></label>
          <label className="toggle-row"><span>Launch at startup</span><input type="checkbox" checked={settings.launchAtLogin} onChange={(event) => void update({ launchAtLogin: event.target.checked })} /></label>
          <label className="toggle-row"><span>Desktop awareness</span><input type="checkbox" checked={settings.desktopAwarenessEnabled} onChange={(event) => void update({ desktopAwarenessEnabled: event.target.checked })} /></label>
          <label className="theme-label">Room theme
            <select value={settings.roomTheme} onChange={(event) => void update({ roomTheme: event.target.value as PixxySettings['roomTheme'] })}>
              <option value="meadow">Meadow</option><option value="moonlight">Moonlight</option><option value="sunset">Sunset</option>
            </select>
          </label>
        </section>
      )}
    </main>
  )
}

