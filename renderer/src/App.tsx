import { useEffect, useRef, useState } from 'react'
import SpriteAnimation from './SpriteAnimation'

const initialSettings: PixxySettings = {
  completedOnboarding: false,
  displayName: '',
  roomTheme: 'meadow',
  alwaysOnTop: false,
  desktopAwarenessEnabled: false,
  launchAtLogin: false,
}

const animationSources = {
  idle: './assets/animations/idle/pixxy_idle.png',
  wave: './assets/animations/wave/pixxy_wave.png',
}

export default function App() {
  const [settings, setSettings] = useState<PixxySettings>(initialSettings)
  const [ready, setReady] = useState(false)
  const [panel, setPanel] = useState<'settings' | 'onboarding' | null>(null)
  const [name, setName] = useState('')
  const [animation, setAnimation] = useState<'idle' | 'wave'>('idle')
  const clickTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!window.pixxy?.settings) {
      setReady(true)
      return
    }

    void window.pixxy.settings.read()
      .then((saved) => {
        setSettings(saved)
        setName(saved.displayName)
        if (!saved.completedOnboarding) setPanel('onboarding')
      })
      .catch(() => setPanel('onboarding'))
      .finally(() => setReady(true))
  }, [])

  useEffect(() => () => {
    if (clickTimer.current !== undefined) window.clearTimeout(clickTimer.current)
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
    setPanel(null)
    setAnimation('wave')
  }

  function interactWithPixxy() {
    setAnimation('wave')
  }

  function handlePetClick() {
    if (clickTimer.current !== undefined) window.clearTimeout(clickTimer.current)
    clickTimer.current = window.setTimeout(() => {
      interactWithPixxy()
      clickTimer.current = undefined
    }, 220)
  }

  function handlePetDoubleClick() {
    if (clickTimer.current !== undefined) {
      window.clearTimeout(clickTimer.current)
      clickTimer.current = undefined
    }
    setPanel('settings')
  }

  if (!ready) return null

  return (
    <main className={`pixxy-shell theme-${settings.roomTheme}`} aria-label="Pixxy desktop companion">
      <button
        className="pet"
        type="button"
        aria-label="Pixxy"
        onClick={handlePetClick}
        onDoubleClick={handlePetDoubleClick}
      >
        <SpriteAnimation
          src={animationSources[animation]}
          columns={animation === 'wave' ? 8 : 5}
          rows={animation === 'wave' ? 1 : 2}
          fps={animation === 'wave' ? 8 : 5}
          loop={animation === 'idle'}
          width={250}
          height={315}
          onComplete={() => setAnimation('idle')}
        />
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

      {panel === 'settings' && (
        <section className="panel settings-panel" aria-label="Pixxy settings">
          <div className="panel-header">
            <h1>Settings</h1>
            <button className="close-button" type="button" aria-label="Close settings" onClick={() => setPanel(null)}>×</button>
          </div>

          <label className="toggle-row">
            <span>Always on top</span>
            <input type="checkbox" checked={settings.alwaysOnTop} onChange={(event) => void update({ alwaysOnTop: event.target.checked })} />
          </label>
          <label className="toggle-row">
            <span>Launch at startup</span>
            <input type="checkbox" checked={settings.launchAtLogin} onChange={(event) => void update({ launchAtLogin: event.target.checked })} />
          </label>
          <label className="toggle-row">
            <span>Desktop awareness</span>
            <input type="checkbox" checked={settings.desktopAwarenessEnabled} onChange={(event) => void update({ desktopAwarenessEnabled: event.target.checked })} />
          </label>
          <label className="theme-label">
            Room theme
            <select value={settings.roomTheme} onChange={(event) => void update({ roomTheme: event.target.value as PixxySettings['roomTheme'] })}>
              <option value="meadow">Meadow</option>
              <option value="moonlight">Moonlight</option>
              <option value="sunset">Sunset</option>
            </select>
          </label>

          <div className="settings-actions">
            <button type="button" className="secondary-action" onClick={() => {
              setName('')
              void update({ displayName: '' })
            }}>
              Reset profile
            </button>
            <button type="button" className="secondary-action" onClick={() => void update({ roomTheme: 'meadow', alwaysOnTop: false, desktopAwarenessEnabled: false, launchAtLogin: false })}>
              Restore to defaults
            </button>
          </div>
        </section>
      )}
    </main>
  )
}
