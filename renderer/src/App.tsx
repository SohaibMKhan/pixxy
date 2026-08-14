import { useEffect, useRef, useState } from 'react'
import SpriteAnimation from './SpriteAnimation'
import idleSheet from './assets/animations/idle/pixxy_idle.png'
import waveSheet from './assets/animations/wave/pixxy_wave.png'
import walkSheet from './assets/animations/walk/pixxy_walk_8f.png'

const initialSettings: PixxySettings = {
  profileVersion: 3,
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

// The native window is intentionally close to Pixxy's visible bounds. The window
// itself is the moving hitbox; the sprite is never translated inside a large stage.
const PET_WIDTH = 110
const PET_HEIGHT = 150
const WALK_STEP = 5.2

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
          window.pixxy.window.setMousePassthrough(false)
        } else {
          window.pixxy.window.setMousePassthrough(true)
        }
      })
      .catch(() => {
        setPanel('onboarding')
        window.pixxy.window.setSettingsOpen(true)
        window.pixxy.window.setMousePassthrough(false)
      })
      .finally(() => setReady(true))
  }, [])

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

      // Launch: one readable wave, then a completely stationary idle pose.
      setAnimation('wave')
      await wait(3000)
      if (cancelled) return

      setAnimation('idle')
      await wait(8500)

      while (!cancelled) {
        await waitForSettingsToClose()
        if (cancelled) break

        setDirection(Math.random() > 0.5 ? 1 : -1)
        setAnimation('walk')
        await wait(7600 + Math.round(Math.random() * 1800))
        if (cancelled) break

        // Walking ends in a fixed frame. There is deliberately no idle sliding,
        // bounce, celebration or other autonomous animation in this pass.
        setAnimation('idle')
        await wait(6500 + Math.round(Math.random() * 3000))
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
    window.pixxy.window.setMousePassthrough(true)
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
    window.pixxy.window.setMousePassthrough(false)
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
    }, 180)
  }

  function handlePetDoubleClick() {
    if (clickTimer.current !== undefined) {
      window.clearTimeout(clickTimer.current)
      clickTimer.current = undefined
    }
    setDragEnabled(true)
    setPanel('settings')
    window.pixxy.window.setSettingsOpen(true)
    window.pixxy.window.setMousePassthrough(false)
  }

  function closeSettings() {
    setPanel(null)
    setDragEnabled(false)
    window.pixxy.window.setSettingsOpen(false)
    window.pixxy.window.setMousePassthrough(true)
    setAnimation('idle')
  }

  function handlePetMouseEnter() {
    if (panelRef.current === null && !dragEnabled) window.pixxy.window.setMousePassthrough(false)
  }

  function handlePetMouseLeave() {
    if (panelRef.current === null && !dragEnabled) window.pixxy.window.setMousePassthrough(true)
  }

  function handleWalkFrame() {
    if (animation !== 'walk' || panelRef.current !== null || movePendingRef.current) return

    movePendingRef.current = true
    void window.pixxy.window.moveBy(direction * WALK_STEP)
      .then((result) => {
        if (result.hitBoundary) setDirection((value) => (value === 1 ? -1 : 1))
      })
      .finally(() => {
        movePendingRef.current = false
      })
  }

  if (!ready) return null

  const animationFrameGrid = animation === 'walk'
    ? { columns: 4, rows: 2, fps: 7 }
    : animation === 'wave'
      ? { columns: 8, rows: 1, fps: 3 }
      : { columns: 4, rows: 2, fps: 1 }

  return (
    <main className={`pixxy-shell theme-${settings.roomTheme} ${dragEnabled ? 'drag-enabled' : ''}`} aria-label="Pixxy desktop companion">
      <button
        className="pet"
        style={{ transform: animation === 'walk' ? `scaleX(${direction})` : undefined }}
        type="button"
        aria-label="Pixxy"
        onMouseEnter={handlePetMouseEnter}
        onMouseLeave={handlePetMouseLeave}
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
          width={PET_WIDTH}
          height={PET_HEIGHT}
          onFrame={animation === 'walk' ? handleWalkFrame : undefined}
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
