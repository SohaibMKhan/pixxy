import { useEffect, useRef, useState } from 'react'
import SpriteAnimation from './SpriteAnimation'
import idleSheet from './assets/animations/idle/pixxy_idle.png'
import waveSheet from './assets/animations/wave/pixxy_wave.png'

const initialSettings: PixxySettings = {
  profileVersion: 4,
  completedOnboarding: false,
  displayName: '',
  alwaysOnTop: false,
  launchAtLogin: false,
}

type AnimationName = 'idle' | 'wave'

const animationSources: Record<AnimationName, string> = {
  idle: idleSheet,
  wave: waveSheet,
}

const PET_WIDTH = 110
const PET_HEIGHT = 150
const DOUBLE_CLICK_WINDOW_MS = 320

type PixxyWindowWithDrag = typeof window.pixxy.window & {
  moveBy: (dx: number, dy: number) => void
}

function pixxyWindow() {
  return window.pixxy.window as PixxyWindowWithDrag
}

export default function App() {
  const [settings, setSettings] = useState<PixxySettings>(initialSettings)
  const [ready, setReady] = useState(false)
  const [panel, setPanel] = useState<'settings' | 'onboarding' | null>(null)
  const [name, setName] = useState('')
  const [animation, setAnimation] = useState<AnimationName>('idle')
  const [dragging, setDragging] = useState(false)

  const clickTimer = useRef<number | undefined>(undefined)
  const lastMouseDownAt = useRef(0)
  const draggingRef = useRef(false)
  const panelRef = useRef<typeof panel>(null)

  useEffect(() => {
    panelRef.current = panel
  }, [panel])

  useEffect(() => {
    draggingRef.current = dragging
  }, [dragging])

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
          window.pixxy.window.setMousePassthrough(false)
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
    const timer = window.setTimeout(() => {
      if (!cancelled) setAnimation('wave')
    }, 250)
    const idleTimer = window.setTimeout(() => {
      if (!cancelled) setAnimation('idle')
    }, 3500)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
      window.clearTimeout(idleTimer)
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
    window.pixxy.window.setSettingsOpen(false)
    window.pixxy.window.setMousePassthrough(false)
    setAnimation('wave')
  }

  async function resetProfile() {
    const saved = await window.pixxy.settings.update({
      completedOnboarding: false,
      displayName: '',
    })
    setSettings(saved)
    setName('')
    setPanel('onboarding')
    window.pixxy.window.setSettingsOpen(true)
    window.pixxy.window.setMousePassthrough(false)
  }

  async function restoreDefaults() {
    const saved = await window.pixxy.settings.update({
      alwaysOnTop: false,
      launchAtLogin: false,
    })
    setSettings(saved)
  }

  function startDrag(event: React.PointerEvent<HTMLButtonElement>) {
    if (event.button !== 0 || panelRef.current !== null) return

    const now = Date.now()
    const isDoubleClick = now - lastMouseDownAt.current <= DOUBLE_CLICK_WINDOW_MS
    lastMouseDownAt.current = now

    if (!isDoubleClick) {
      if (clickTimer.current !== undefined) window.clearTimeout(clickTimer.current)
      clickTimer.current = window.setTimeout(() => {
        setAnimation('wave')
        clickTimer.current = undefined
      }, 180)
      return
    }

    if (clickTimer.current !== undefined) {
      window.clearTimeout(clickTimer.current)
      clickTimer.current = undefined
    }

    draggingRef.current = true
    setDragging(true)
    window.pixxy.window.setMousePassthrough(false)
    event.currentTarget.setPointerCapture(event.pointerId)
    event.preventDefault()
  }

  function moveDrag(event: React.PointerEvent<HTMLButtonElement>) {
    if (!draggingRef.current) return
    const dx = event.movementX
    const dy = event.movementY
    if (dx !== 0 || dy !== 0) pixxyWindow().moveBy(dx, dy)
  }

  function finishDrag(event: React.PointerEvent<HTMLButtonElement>) {
    if (!draggingRef.current) return
    draggingRef.current = false
    setDragging(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  function handlePetContextMenu(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    if (draggingRef.current) return
    setPanel('settings')
    window.pixxy.window.setSettingsOpen(true)
    window.pixxy.window.setMousePassthrough(false)
  }

  function closeSettings() {
    setPanel(null)
    window.pixxy.window.setSettingsOpen(false)
    window.pixxy.window.setMousePassthrough(false)
    setAnimation('idle')
  }

  if (!ready) return null

  // pixxy_idle.png is 1408x768: 4 columns x 2 rows = 352x384 cells.
  // Using 6 columns creates fractional-width cells and slices adjacent poses.
  const animationFrameGrid = animation === 'wave'
    ? { columns: 8, rows: 1, fps: 3 }
    : { columns: 4, rows: 2, fps: 1 }

  return (
    <main className={`pixxy-shell${dragging ? ' drag-enabled' : ''}`} aria-label="Pixxy desktop companion">
      <button
        className="pet"
        type="button"
        aria-label="Pixxy"
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onContextMenu={handlePetContextMenu}
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
          <p className="supporting-copy">Pixxy starts quietly. You can enable useful desktop features later from Settings.</p>
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

          <div className="settings-actions">
            <button type="button" className="secondary-action" onClick={() => void resetProfile()}>Reset profile</button>
            <button type="button" className="secondary-action" onClick={() => void restoreDefaults()}>Restore to defaults</button>
          </div>
        </section>
      )}
    </main>
  )
}
