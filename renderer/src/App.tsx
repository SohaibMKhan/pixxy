import { useEffect, useRef, useState } from 'react'
import SpriteAnimation from './SpriteAnimation'
import idleSheet from './assets/animations/idle/pixxy_idle.png'
import waveSheet from './assets/animations/wave/pixxy_wave.png'
import walkSheet from './assets/animations/walk/pixxy_walk_8f.png'

const initialSettings: PixxySettings = {
  profileVersion: 2,
  completedOnboarding: false,
  displayName: '',
  roomTheme: 'meadow',
  alwaysOnTop: false,
  desktopAwarenessEnabled: false,
  launchAtLogin: false,
}

type AnimationName = 'idle' | 'walk' | 'wave'

const animationSources: Record<AnimationName, string> = {
  idle: idleSheet,
  walk: walkSheet,
  wave: waveSheet,
}

const PET_STEP = 2.2

export default function App() {
  const [settings, setSettings] = useState<PixxySettings>(initialSettings)
  const [ready, setReady] = useState(false)
  const [panel, setPanel] = useState<'settings' | 'onboarding' | null>(null)
  const [name, setName] = useState('')
  const [animation, setAnimation] = useState<AnimationName>('idle')
  const [direction, setDirection] = useState<1 | -1>(1)
  const [dragEnabled, setDragEnabled] = useState(false)
  const clickTimer = useRef<number | undefined>(undefined)
  const panelRef = useRef<typeof panel>(null)
  const movePendingRef = useRef(false)

  useEffect(() => {
    panelRef.current = panel
  }, [panel])

  useEffect(() => () => {
    if (clickTimer.current !== undefined) window.clearTimeout(clickTimer.current)
  }, [])

  useEffect(() => {
    void window.pixxy.settings.read()
      .then((saved) => {
        setSettings(saved)
        setName(saved.displayName)
        if (!saved.completedOnboarding || !saved.displayName.trim()) {
          setPanel('onboarding')
          window.pixxy.window.setSettingsOpen(true)
        }
      })
      .catch(() => {
        setPanel('onboarding')
        window.pixxy.window.setSettingsOpen(true)
      })
      .finally(() => setReady(true))
  }, [])

  useEffect(() => {
    if (!ready || animation !== 'walk') return

    const timer = window.setInterval(() => {
      if (movePendingRef.current || panelRef.current !== null) return
      movePendingRef.current = true
      void window.pixxy.window.moveBy(direction * PET_STEP)
        .then((result) => {
          if (result.hitBoundary) setDirection((value) => (value === 1 ? -1 : 1))
        })
        .finally(() => {
          movePendingRef.current = false
        })
    }, 45)

    return () => window.clearInterval(timer)
  }, [animation, direction, ready])

  useEffect(() => {
    if (!ready || !settings.completedOnboarding) return

    let cancelled = false
    const wait = (milliseconds: number) => new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds))
    const waitForSettingsToClose = async () => {
      while (!cancelled && panelRef.current !== null) await wait(120)
    }

    const run = async () => {
      await waitForSettingsToClose()
      if (cancelled) return

      setAnimation('wave')
      await wait(3000)
      if (cancelled) return

      setAnimation('idle')
      await wait(7500)

      while (!cancelled) {
        await waitForSettingsToClose()
        if (cancelled) break

        setDirection(Math.random() > 0.5 ? 1 : -1)
        setAnimation('walk')
        await wait(6500 + Math.round(Math.random() * 2500))
        if (cancelled) break

        setAnimation('idle')
        await wait(5500 + Math.round(Math.random() * 3000))
      }
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [ready, settings.completedOnboarding])

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
    setDragEnabled(false)
    window.pixxy.window.setSettingsOpen(false)
    setAnimation('wave')
  }

  async function resetProfile() {
    const saved = await window.pixxy.settings.update({
      completedOnboarding: false,
      displayName: '',
    })
    setSettings(saved)
    setName('')
    setDragEnabled(false)
    setPanel('onboarding')
    window.pixxy.window.setSettingsOpen(true)
  }

  async function restoreDefaults() {
    const saved = await window.pixxy.settings.update({
      roomTheme: 'meadow',
      alwaysOnTop: false,
      desktopAwarenessEnabled: false,
      launchAtLogin: false,
    })
    setSettings(saved)
  }

  function handlePetClick() {
    if (clickTimer.current !== undefined) window.clearTimeout(clickTimer.current)
    clickTimer.current = window.setTimeout(() => {
      setAnimation('wave')
      clickTimer.current = undefined
    }, 220)
  }

  function handlePetDoubleClick() {
    if (clickTimer.current !== undefined) {
      window.clearTimeout(clickTimer.current)
      clickTimer.current = undefined
    }
    setDragEnabled(true)
    setPanel('settings')
    window.pixxy.window.setSettingsOpen(true)
  }

  function closeSettings() {
    setPanel(null)
    setDragEnabled(false)
    window.pixxy.window.setSettingsOpen(false)
    setAnimation('idle')
  }

  if (!ready) return null

  // The supplied idle/walk sheets are 1376×768 with 8 frames arranged 4×2.
  // The supplied wave sheet is 8 frames arranged 8×1.
  const animationFrameGrid = animation === 'walk'
    ? { columns: 4, rows: 2, fps: 7 }
    : animation === 'wave'
      ? { columns: 8, rows: 1, fps: 4 }
      : { columns: 4, rows: 2, fps: 1 }

  return (
    <main className={`pixxy-shell theme-${settings.roomTheme} ${dragEnabled ? 'drag-enabled' : ''}`} aria-label="Pixxy desktop companion">
      <button
        className="pet"
        style={{ transform: `scaleX(${direction})` }}
        type="button"
        aria-label="Pixxy"
        onClick={handlePetClick}
        onDoubleClick={handlePetDoubleClick}
      >
        <SpriteAnimation
          src={animationSources[animation]}
          columns={animationFrameGrid.columns}
          rows={animationFrameGrid.rows}
          fps={animationFrameGrid.fps}
          loop={animation !== 'idle'}
          freezeFrame={animation === 'idle' ? 0 : undefined}
          width={190}
          height={205}
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
            <button className="close-button" type="button" aria-label="Close settings" onClick={closeSettings}>×</button>
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
            Pixxy palette
            <select value={settings.roomTheme} onChange={(event) => void update({ roomTheme: event.target.value as PixxySettings['roomTheme'] })}>
              <option value="meadow">Meadow</option>
              <option value="moonlight">Moonlight</option>
              <option value="sunset">Sunset</option>
              <option value="ocean">Ocean</option>
              <option value="lavender">Lavender</option>
              <option value="peach">Peach</option>
            </select>
          </label>

          <div className="settings-actions">
            <button type="button" className="secondary-action" onClick={() => void resetProfile()}>Reset profile</button>
            <button type="button" className="secondary-action" onClick={() => void restoreDefaults()}>Restore to defaults</button>
          </div>
        </section>
      )}
    </main>
  )
}
