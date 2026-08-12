import { useEffect, useRef, useState } from 'react'
import SpriteAnimation from './SpriteAnimation'
import idleSheet from './assets/animations/idle/pixxy_idle.png'
import blinkSheet from './assets/animations/blink/pixxy_blink.png'
import bounceSheet from './assets/animations/bounce/pixxy_bounce.png'
import playfulSheet from './assets/animations/playful/pixxy_playful.png'
import waveSheet from './assets/animations/wave/pixxy_wave.png'
import walkSheet from './assets/animations/walk/pixxy_walk_8f.png'

const initialSettings: PixxySettings = {
  completedOnboarding: false,
  displayName: '',
  roomTheme: 'meadow',
  alwaysOnTop: false,
  desktopAwarenessEnabled: false,
  launchAtLogin: false,
}

type AnimationName = 'idle' | 'blink' | 'bounce' | 'playful' | 'walk' | 'wave'
type GestureName = Exclude<AnimationName, 'idle' | 'walk'>

const animationSources: Record<AnimationName, string> = {
  idle: idleSheet,
  blink: blinkSheet,
  bounce: bounceSheet,
  playful: playfulSheet,
  walk: walkSheet,
  wave: waveSheet,
}

const gestureDurations: Record<GestureName, number> = {
  blink: 1100,
  bounce: 1800,
  playful: 2400,
  wave: 2800,
}

const PET_WIDTH = 150
const PET_MARGIN = 14

function randomBetween(min: number, max: number) {
  return Math.round(min + Math.random() * (max - min))
}

function randomGesture(): GestureName {
  const gestures: GestureName[] = ['blink', 'bounce', 'playful', 'wave']
  return gestures[Math.floor(Math.random() * gestures.length)]
}

export default function App() {
  const [settings, setSettings] = useState<PixxySettings>(initialSettings)
  const [ready, setReady] = useState(false)
  const [panel, setPanel] = useState<'settings' | 'onboarding' | null>(null)
  const [name, setName] = useState('')
  const [animation, setAnimation] = useState<AnimationName>('idle')
  const [petX, setPetX] = useState(PET_MARGIN)
  const [direction, setDirection] = useState<1 | -1>(1)
  const clickTimer = useRef<number | undefined>(undefined)
  const petRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef(panel)
  const mouseIgnoredRef = useRef(true)

  useEffect(() => {
    panelRef.current = panel
  }, [panel])

  const setMouseIgnored = (ignore: boolean) => {
    if (mouseIgnoredRef.current === ignore) return
    mouseIgnoredRef.current = ignore
    window.pixxy?.window.setIgnoreMouseEvents(ignore)
  }

  useEffect(() => {
    if (!window.pixxy?.window) return
    if (panel !== null) setMouseIgnored(false)
  }, [panel])

  useEffect(() => {
    if (!window.pixxy?.settings) {
      setReady(true)
      return
    }

    void window.pixxy.settings.read()
      .then((saved) => {
        setSettings(saved)
        setName(saved.displayName)
        if (!saved.completedOnboarding || !saved.displayName.trim()) setPanel('onboarding')
      })
      .catch(() => setPanel('onboarding'))
      .finally(() => setReady(true))
  }, [])

  useEffect(() => () => {
    if (clickTimer.current !== undefined) window.clearTimeout(clickTimer.current)
  }, [])

  useEffect(() => {
    if (!ready) return

    const handleMouseMove = (event: MouseEvent) => {
      if (panelRef.current !== null) {
        setMouseIgnored(false)
        return
      }

      const rect = petRef.current?.getBoundingClientRect()
      const overPet = rect
        ? event.clientX >= rect.left
          && event.clientX <= rect.right
          && event.clientY >= rect.top
          && event.clientY <= rect.bottom
        : false

      setMouseIgnored(!overPet)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [ready])

  useEffect(() => {
    if (!ready || animation !== 'walk') return

    const timer = window.setInterval(() => {
      setPetX((current) => {
        const max = Math.max(PET_MARGIN, window.innerWidth - PET_WIDTH - PET_MARGIN)
        const next = current + direction * 1.65

        if (next <= PET_MARGIN) {
          setDirection(1)
          return PET_MARGIN
        }
        if (next >= max) {
          setDirection(-1)
          return max
        }
        return next
      })
    }, 45)

    return () => window.clearInterval(timer)
  }, [animation, direction, ready])

  useEffect(() => {
    if (!ready || !settings.completedOnboarding) return

    let cancelled = false
    const wait = (milliseconds: number) => new Promise<void>((resolve) => {
      window.setTimeout(resolve, milliseconds)
    })
    const waitForPanelToClose = async () => {
      while (!cancelled && panelRef.current !== null) await wait(100)
    }

    const run = async () => {
      await waitForPanelToClose()
      if (cancelled) return

      setAnimation('wave')
      await wait(2800)
      if (cancelled) return

      setAnimation('idle')
      await wait(randomBetween(5000, 7500))

      while (!cancelled) {
        await waitForPanelToClose()
        if (cancelled) break

        const shouldWalk = Math.random() < 0.52
        if (shouldWalk) {
          setDirection(Math.random() > 0.5 ? 1 : -1)
          setAnimation('walk')
          await wait(randomBetween(5000, 9000))
          if (cancelled) break
          setAnimation('idle')
          await wait(randomBetween(2500, 5000))
        } else {
          const gesture = randomGesture()
          setAnimation(gesture)
          await wait(gestureDurations[gesture])
          if (cancelled) break
          setAnimation('idle')
          await wait(randomBetween(4500, 8000))
        }
      }
    }

    void run()
    return () => { cancelled = true }
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
    setAnimation('wave')
    setMouseIgnored(true)
  }

  async function resetProfile() {
    const saved = await window.pixxy.settings.update({
      completedOnboarding: false,
      displayName: '',
    })
    setSettings(saved)
    setName('')
    setPanel('onboarding')
    setMouseIgnored(false)
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
    setMouseIgnored(false)
    setPanel('settings')
  }

  if (!ready) return null

  const isWalking = animation === 'walk'
  const animationFrameGrid = animation === 'wave'
    ? { columns: 8, rows: 1, fps: 4.5 }
    : { columns: 6, rows: 2, fps: animation === 'idle' ? 1 : 5 }

  return (
    <main className={`pixxy-shell theme-${settings.roomTheme}`} aria-label="Pixxy desktop companion">
      <button
        ref={petRef}
        className={`pet ${isWalking ? 'is-walking' : ''}`}
        style={{ left: `${petX}px`, transform: `scaleX(${direction})` }}
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
          width={150}
          height={190}
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
            <button className="close-button" type="button" aria-label="Close settings" onClick={() => {
              setPanel(null)
              setMouseIgnored(true)
            }}>×</button>
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
