# Pixxy MVP Execution Plan

## Product Boundary

Pixxy is a Windows desktop virtual pet that remains useful without an AI model. The MVP is complete when a user can install the app, interact with a persistent animated companion, see its deterministic needs and moods change, earn and spend coins, play one mini-game, and opt into high-level desktop-aware reactions.

Local AI is optional. It must never own pet state, rewards, gameplay, persistence, or privacy enforcement.

## Architecture Decisions

| Area | MVP decision |
| --- | --- |
| Desktop runtime | Electron with a transparent, frameless pet window and tray integration |
| Renderer | React + TypeScript |
| Domain logic | TypeScript services shared between Electron processes where practical |
| Persistence | SQLite, stored locally per user |
| Desktop context | Explicitly enabled, high-level app name and idle/session signals only |
| AI | Optional Ollama provider behind an interface; rule-based fallback is required |
| Packaging | Electron Builder for a Windows installer |

## Milestones

### M0: Product and Technical Foundation

Deliverables:

- PRD with target user, first-run flow, privacy defaults, and MVP exclusions.
- Interaction map for desktop pet, room, settings, mini-game, and onboarding.
- Character visual brief and asset specification.
- Repository standards: TypeScript, linting, formatting, tests, CI, and release conventions.

Exit criteria:

- No MVP feature lacks an owner, acceptance criteria, or privacy decision.
- Visual direction and the initial Pixxy asset approach are approved.

### M1: Desktop Shell and First-Run Experience

Deliverables:

- Electron + React application scaffold.
- Transparent, frameless, draggable pet window with selectable scale and always-on-top setting.
- System tray actions: show/hide, pause, settings, and exit.
- Onboarding that gathers a display name, initial room selection, and explicit desktop-awareness consent.
- Windows startup option.

Exit criteria:

- A clean local launch presents Pixxy on the desktop and can be controlled from the tray.
- Window behavior works at common Windows DPI settings and on a second monitor.

### M2: Pet Engine and Persistence

Deliverables:

- Versioned pet-state schema with hunger, energy, happiness, social, curiosity, boredom, coins, XP, and personality traits.
- Deterministic time-based need decay and interaction effects.
- Ordered mood rules with a clear fallback state.
- SQLite migrations, repositories, and recovery-safe initialization.
- Basic pet interactions: feed, play, rest, and talk.

Exit criteria:

- State evolves while the app runs and across relaunches.
- Mood changes are reproducible from the same state and remain independent of AI availability.

### M3: Core Visual Experience

Deliverables:

- Modular Pixxy asset pipeline: base body, expression layers, animation frames, accessories.
- MVP animations: idle, blink, walk, happy, sad, sleep, eat, and surprise.
- Basic room scene with at least a background and a small initial furniture set.
- Animation state mapping driven by the pet engine.

Exit criteria:

- Pixxy is readable at its smallest supported desktop scale.
- Mood and interaction changes visibly affect animation and expression.

### M4: Desktop Awareness and Privacy

Deliverables:

- Opt-in active-application and idle/session tracking.
- Rule-based reactions for a small, configurable app list.
- Privacy settings to enable/disable each signal and clear collected activity data.
- Quiet hours and reaction-frequency limits.

Exit criteria:

- With consent disabled, no desktop context is collected or used.
- With consent enabled, reactions are contextual but rate-limited and do not inspect document contents, keystrokes, passwords, or sensitive content.

### M5: Economy, Room, and One Mini-Game

Deliverables:

- XP, coins, daily return reward, achievements, and inventory persistence.
- Furniture unlocking and placement in the room.
- A polished `Catch the Falling Food` game with scoring, high score, rewards, and post-game Pixxy reaction.

Exit criteria:

- Rewards cannot be duplicated by relaunching the app.
- The game is responsive, short, replayable, and does not degrade desktop-pet performance.

### M6: Memory and Optional Local AI

Deliverables:

- Local user preferences, explicit facts, interaction history, and memories with view/delete/clear controls.
- AI provider interface, Ollama adapter, runtime detection, model configuration, and conversation UI.
- Context builder that includes only permitted relevant memories, pet mood, and desktop context.
- Fully functional non-AI conversational fallback using authored rule-based responses.

Exit criteria:

- Pixxy works when Ollama is unavailable, offline, or disabled.
- All stored memories can be inspected and removed by the user.

### M7: Packaging, QA, and Beta

Deliverables:

- Windows installer and uninstaller.
- Upgrade path and first-run reliability tests.
- Manual QA matrix: offline, restart, sleep/wake, multi-monitor, DPI, low-memory, database failures, privacy, and AI unavailable.
- Small beta release and feedback triage.

Exit criteria:

- The installer succeeds on a clean Windows machine and removes the app cleanly.
- All MVP definition-of-done items from the blueprint are verified.

## Initial Backlog Order

1. Create the Electron/React/TypeScript scaffold and baseline quality tooling.
2. Implement the desktop window, tray, onboarding, and settings shell.
3. Implement SQLite initialization and the pet state/mood engine with unit tests.
4. Integrate the first Pixxy assets and interaction animations.
5. Add consent-gated desktop awareness and rule-based reactions.
6. Add room, economy, and the mini-game.
7. Add memory controls and optional Ollama integration.
8. Package, test, and run a beta.

## Decisions Needed Before M1

- Confirm the initial visual direction: classic pixel art or modern pixel-art hybrid.
- Confirm whether Pixxy begins as one fixed species/character or needs cosmetic variants in the MVP.
- Confirm the default desktop behavior: always-on-top by default or opt-in during onboarding.
- Confirm whether the first beta is strictly Windows 10/11 x64.
- Provide the preferred GitHub workflow after GitHub CLI is installed/authenticated, or authorize use of the existing `SohaibMKhan/pixxy` remote.

## Explicit Non-Goals

Evolution, multiple species, cloud sync, mobile applications, multiplayer, voice, large agent workflows, broad desktop surveillance, and automatic AI-runtime/model redistribution are deferred beyond the MVP.
