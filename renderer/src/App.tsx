import { useEffect, useRef, useState } from 'react'
import SpriteAnimation from './SpriteAnimation'
import idleSheet from './assets/animations/idle/pixxy_idle.png'
import blinkSheet from './assets/animations/blink/pixxy_blink.png'
import bounceSheet from './assets/animations/bounce/pixxy_bounce.png'
import celebrationSheet from './assets/animations/celebration/pixxy_celebration.png'
import eatingSheet from './assets/animations/eating/pixxy_eating.png'
import playfulSheet from './assets/animations/playful/pixxy_playful.png'
import sleepSheet from './assets/animations/sleep/pixxy_sleep.png'
import walkSheet from './assets/animations/walk/pixxy_walk_8f.png'
import waveSheet from './assets/animations/wave/pixxy_wave.png'

const initialSettings: PixxySettings = {
  completedOnboarding: false,
  displayName: '',
  roomTheme: 'meadow',
  alwaysOnTop: false,
  desktopAwarenessEnabled: false,
  launchAtLogin: false,
}

type AnimationName = 'idle' | 'blink' | 'bounce' | 'celebration' | 'eating' | 'playful' | 'sleep' | 'walk' | 'wave'

const animationSources: Record<AnimationName, string> = {
  idle: idleSheet,
  blink: blinkSheet,
  bounce: bounceSheet,
  celebration: celebrationSheet,
  eating: eatingSheet,
  playful: playfulSheet,
  sleep: sleepSheet,
  walk: walkSheet,
  wave: waveSheet,
}

const gestureDurations: Record<Exclude<AnimationName, 'idle' | 'walk'>, number> = {
  blink: 900,
  bounce: 1500,
  celebration: 1900,
  eating: 2400,
  playful: 2200,
  sleep: 4200,
  wave: 1700,
}

function randomBetween(min: number, max: number) {
  return Math.round(min + Math.random() * (max - min))
}

function randomGesture(): Exclude<AnimationName, 'idle' | 'walk'> {
  const gestures: Array<Exclude<AnimationName, 'idle' | 'walk'>> = [
    'blink', 'bounce', 'playful', 'eating', 'wave', 'celebration', 'sleep',
  ]
  return gestures[Math.floor(Math.random() * gestures.length)]
}

export default function App() {
  const [settings, setSettings] = useState<PixxySettings>(initialSettings)
  const [ready, setReady] = useState(false)
  const [panel, setPanel] = useState<'settings' | 'onboarding' | null>(null)
  const [name, setName] = useState('')
  const [animation, setAnimation] = useState<AnimationName>('idle')
  const [petX, setPetX] = useState(50)
  const [direction, setDirection] = useState<1 | -1>(1)
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

  useEffect(() => {
    if (!ready || panel !== null || animation !== 'walk') return

    const timer = window.setInterval(() => {
      setPetX((current) => {
        const width = 190
        const max = Math.max(16, window.innerWidth - width - 16)
        const next = current + direction * 2.2
        if (next <= 16) {
          setDirection(1)
          return 16
        }
        if (next >= max) {
          setDirection(-1)
          return max
        }
        return next
      })
    }, 40)

    return () => window.clearInterval(timer)
  }, [animation, direction, panel, ready])

  useEffect(() => {
    if (!ready || panel !== null || !settings.completedOnboarding) return

    let cancelled = false
    const wait = (milliseconds: number) => new Promise<void>((resolve) => {
      window.setTimeout(resolve, milliseconds)
    })

    const run = async () => {
      setAnimation('wave')
      await wait(1700)
      if (cancelled) return

      setAnimation('idle')
      await wait(randomBetween(3500, 5500))

      while (!cancelled) {
        const shouldWalk = Math.random() < 0.55
        if (shouldWalk) {
          setDirection(Math.random() > 0.5 ? 1 : -1)
          setAnimation('walk')
          await wait(randomBetween(4200, 8000))
          if (cancelled) break
          setAnimation('idle')
          await wait(randomBetween(1600, 3000))
        } else {
          const gesture = randomGesture()
          setAnimation(gesture)
          await wait(gestureDurations[gesture])
          if (cancelled) break
          setAnimation('idle')
          await wait(randomBetween(2200, 5000))
        }
      }
    }

    void run()
    return () => { cancelled = true }
  }, [panel, ready, settings.completedOnboarding])

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
    setPanel('settings')
  }

  if (!ready) return null

  const isWalking = animation === 'walk'
  const animationFrameGrid = animation === 'wave' ? { columns: 8, rows: 1, fps: 8 } : { columns: 4, rows: 2, fps: 6 }

  return (
    <main className={`pixxy-shell theme-${settings.roomTheme}`} aria-label="Pixxy desktop companion">
      <button
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
          loop={animation === 'idle' || animation === 'walk'}
          width={190}
          height={225}
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
