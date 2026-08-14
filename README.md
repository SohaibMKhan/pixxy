# 🐾 Pixxy

> **A tiny digital life that lives on your desktop.**
>
> A desktop-first virtual pet and local AI companion that remembers you, reacts to your activity, grows with you, and remains useful even when AI is turned off.

**🐾 The pet is the product. AI makes the pet smarter and more alive.**

<div align="center">

<img src="renderer/src/assets/character/reference/pixxy_approved_reference.png" alt="Pixxy character reference" width="420" />

*Current canonical Pixxy character reference — crisp pixel-art desktop companion.*

</div>

[What is Pixxy?](#-what-is-pixxy) • [MVP](#-mvp) • [Architecture](#-architecture) • [Roadmap](#-roadmap) • [Development Workflow](#-development-workflow)

---

## ✨ What is Pixxy?

Pixxy is a **Windows desktop virtual pet + digital companion**. It appears directly on your desktop as a small animated creature with needs, moods, personality, memory, a room, games, rewards, and evolving behavior.

The AI layer is intentionally optional. Pixxy's core pet mechanics, state, games, economy, events, animations, and privacy controls work without an LLM.

💡 **Why Pixxy is different**

| Traditional AI chatbot | Pixxy |
| --- | --- |
| AI is the product | 🐾 The virtual pet is the product |
| Usually cloud-first | 🔒 Local-first by design |
| Stateless conversations | 🧠 Persistent local memory |
| Avatar around a chatbot | 🌎 A persistent digital world |
| AI controls behavior | ⚙️ Deterministic pet engine controls core state |
| Little reason to return | 🎮 Games, rewards, room, progression |
| Passive interaction | 🖥️ Optional desktop awareness |

---

## 🎯 Product Principles

> **Pixxy should never become simply “a cute UI around an LLM.”**

- 🐾 Pixxy must remain fun with AI completely disabled.
- 🧠 AI is an intelligence layer, not the entire product.
- 🔒 Local-first data handling is the default.
- 👤 Users control what Pixxy remembers and observes.
- ⚙️ Core pet state is deterministic and independent of the LLM.
- 💤 Pixxy should feel alive without becoming annoying or intrusive.
- 🚀 Ship a small, polished, installable MVP before expanding the scope.

---

## 🧩 Core Systems

- **Pet Engine** — needs, moods, state transitions, personality, evolution.
- **Desktop Engine** — high-level active-app, idle-time, session and desktop-state awareness.
- **Memory Engine** — local memories, preferences, projects and interactions.
- **AI Engine** — optional local LLM conversation and contextual responses.
- **Game Engine** — mini-games and gameplay mechanics.
- **Economy Engine** — XP, coins, rewards and unlockables.
- **Event Engine** — discoveries, gifts, surprises and scripted events.
- **UI Layer** — transparent pet window, room, menus, dashboard and settings.
- **Asset System** — characters, animations, furniture, rooms, sounds and icons.

---

## 🚀 MVP

The first release is deliberately small.

### Must Have

- 🖥️ Transparent desktop pet window
- 🐹 Pixxy character
- ✨ Idle animation
- 🖱️ Click interaction
- 🏠 Basic room
- 🍎 Hunger
- ⚡ Energy
- ❤️ Happiness
- 😊 Mood engine
- 💾 Basic local memory
- 🗃️ SQLite persistence
- 🖥️ Application awareness
- 💬 Rule-based reactions
- 🪙 Coins
- 🎮 One polished mini-game
- ⚙️ Settings
- 🪟 Windows startup option
- 🧠 Optional local AI

### Explicitly out of MVP

Evolution • Multiple species • Large furniture catalogue • Mobile app • Multiplayer • Cloud sync • Large agentic system • Voice assistant • Many mini-games • Social network

---

## 🧠 Local AI Philosophy

Pixxy is designed to work **without an AI model**.

```text
                 PIXXY
                   │
          ┌────────┴────────┐
          │                 │
     VIRTUAL PET         LOCAL AI
          │                 │
     Needs / Mood      Conversation
     Room / Games      Memory / Context
     Economy           Personality
     Events
          │
          └───────┬─────────┘
                  ↓
             DESKTOP WORLD
```

The initial AI integration is planned around an **Ollama adapter**, behind a provider interface so the rest of the application is not tightly coupled to one runtime.

Runtime/model packaging and redistribution terms must be verified before shipping an installer that automatically installs AI components.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| Desktop shell | **Electron** | Transparent window, tray, Windows integration |
| Frontend | **React + TypeScript** | UI, room, menus, settings, dashboard |
| Application logic | **Node.js + TypeScript** | Pet engine, services, orchestration |
| Database | **SQLite** | Local persistent storage |
| AI runtime | **Ollama adapter** | Local LLM integration |
| Assets | **PNG / SVG / Sprite Sheets** | Character, room, furniture and UI |
| Packaging | **Electron Builder** | Windows installer/executable |
| CI/CD | **GitHub Actions** | Automated Windows test builds and releases |

---

## 🗂️ Current Project Structure

```text
pixxy/
├── app/
│   └── main/                 # Electron main process and desktop shell
├── renderer/
│   └── src/
│       ├── assets/           # Canonical renderer assets
│       └── ...               # React renderer
├── database/                 # Local database layer
├── installer/                # Packaging / installer configuration
├── docs/                     # Product and execution documentation
├── .github/
│   └── workflows/            # GitHub Actions CI/CD
└── package.json
```

The renderer asset pipeline is intentionally kept under `renderer/src/assets/` so the desktop renderer has one clear canonical location for Pixxy's visual assets.

---

## 🗺️ Roadmap

### Phase 0 — 📋 Product Specification

- Detailed PRD
- Pixxy personality definition
- Target audience
- Privacy model
- MVP boundaries
- UI/UX flow
- Pet mechanics
- Technical architecture

### Phase 1 — 🎨 Character & Visual Assets

- Visual brief
- Character concepts
- Final design
- Character sheet
- Expression sheet
- Animation references
- Transparent base assets
- Sprite sheets
- Initial room
- Furniture and UI assets

**Current focus:** finalizing the production-quality Pixxy character assets and integrating them into the desktop pet behavior system.

### Phase 2 — 🖥️ Desktop Shell

- Electron project
- Transparent frameless window
- Always-on-top option
- Controlled desktop interaction area
- Natural bottom-area movement
- Dragging behavior
- Scaling
- System tray
- Hide/show
- Startup option

### Phase 3 — 🐾 Pet Engine

- Pet state model
- Hunger
- Energy
- Happiness
- Social / curiosity / boredom
- Mood rules
- State transitions
- Mood-driven animation
- Natural autonomous behavior
- Interruptible user interactions

### Phase 4 — 💾 Database & Persistence

- SQLite schema
- Database initialization
- Repositories/services
- Pet state persistence
- User settings persistence
- Coins and XP persistence
- Room persistence
- Events and achievements
- Restart persistence tests

### Phase 5 — 🖥️ Desktop Awareness

- Active application detection
- Idle detection
- Session tracking
- Lock/unlock awareness
- Privacy controls
- Rule-based reactions
- Multi-application testing

### Phase 6 — 🧠 Personality & Memory

- Personality traits
- Interaction history
- Explicit memory creation
- Memory retrieval
- Memory management UI
- Memory deletion
- Behavior connection

### Phase 7 — 🏠 Room & Economy

- Room scene
- Furniture placement
- Inventory
- XP
- Coins
- Achievements
- Unlockable items
- Productivity rewards

### Phase 8 — 🎮 Mini-Game

**First game: Catch the Falling Food**

- Controls
- Scoring
- Rewards
- High score
- Pixxy reactions
- Performance testing

### Phase 9–10 — 🤖 Local AI & Personality

- AI provider interface
- Ollama integration
- Runtime detection
- Model configuration
- Context builder
- Pixxy system/personality prompt
- Conversation UI
- AI fallback behavior
- Mood/personality injection
- Memory context
- Desktop context where permitted
- Response limits

### Phase 11–13 — 📦 Installer, QA & Beta

- Production build
- Windows installer
- Prerequisite checks
- Hardware detection
- Optional AI setup
- Clean install testing
- Upgrade testing
- Offline testing
- Multi-monitor testing
- DPI/scaling testing
- Privacy audit
- Beta release
- Feedback loop

---

## 🔄 Development Workflow

Pixxy uses a **GitHub-first development workflow**. For the current testing phase, changes are made in GitHub and GitHub Actions compiles a Windows test artifact automatically. Local compilation is optional and mainly reserved for deeper debugging when needed.

```text
Changes
   ↓
GitHub main/source
   ↓
GitHub Actions
   ↓
Windows test build
   ↓
pixxy-windows-test artifact
   ↓
Download + test .exe/package
   ↓
Feedback
   ↓
Fix
   ↺

When stable
   ↓
v0.1.0
   ↓
Production GitHub Actions build
   ↓
Windows installer/release
```

### Automatic test builds

The Windows test build is configured to run automatically when **application-related files** change on `main`, such as:

- `app/**`
- `renderer/**`
- runtime/application assets
- package/build configuration
- GitHub Actions build configuration

Documentation-only changes such as `README.md` do **not** need to consume a Windows build.

A manual workflow trigger remains available when a build is needed without an application change.

### Local development

Local development is still supported for debugging:

```bash
npm ci
npm run dev
```

The normal product-testing loop, however, is GitHub → Actions → Windows artifact → test → feedback → fix.

---

## 🎨 Pixxy Character Design

Pixxy's visual direction is **crisp modern pixel art** with a consistent silhouette, expressive face, controlled palette and transparent production assets.

The character pipeline is modular:

**Base character → expressions → poses → animation frames → effects → accessories**

### Character example

<div align="center">

<img src="renderer/src/assets/character/reference/pixxy_approved_reference.png" alt="Canonical Pixxy character example" width="420" />

**Canonical Pixxy character example**

</div>

The repository also contains the broader character reference material and animation asset pipeline. As the final transparent PNG assets are uploaded, the production folders will become the source of truth for runtime animation.

### Planned character families

- 👋 Wave
- 🧍 Idle / neutral
- 🚶 Walk
- 👀 Blink
- 🎉 Celebrate
- 🎮 Play
- 🍎 Eat
- 😴 Sleep
- ✨ Special effects / reactions

The desktop MVP intentionally keeps autonomous behavior focused on a small number of natural gestures rather than constantly playing large or distracting animations.

---

## 🕹️ Desktop Pet Behavior

The desktop pet should feel **alive, not like a looping movie reel**.

The intended behavior model is:

```text
Launch
  ↓
Wave once
  ↓
Stable idle
  ↓
Occasional blink / small gesture
  ↓
Walk naturally across the allowed bottom area
  ↓
Turn at boundary
  ↓
Stable idle / short gesture
  ↓
Repeat naturally
```

User interaction interrupts the autonomous flow cleanly:

```text
Autonomous behavior
        ↓
     User click
        ↓
  Interaction gesture
        ↓
Resume previous behavior
```

The character should never visually appear trapped inside a large invisible box, and the desktop should remain clickable outside the small interaction region around Pixxy.

---

## 🔒 Privacy by Design

Pixxy is intended to be **local-first**.

Users should be able to control whether Pixxy can:

- Remember things explicitly told to it
- Remember application activity
- Remember productivity patterns
- Remember conversations
- Automatically create memories
- View stored memories
- Delete individual memories
- Delete all Pixxy data

### 🚫 MVP does not need

Pixxy should avoid collecting **document contents, keystrokes, passwords, or sensitive content**. Desktop awareness should focus on high-level signals and remain opt-in/configurable.

---

## 🎮 Core Pet Mechanics

| Need | Range | Example state |
| --- | --- | --- |
| Hunger | 0–100 | Hungry below threshold |
| Energy | 0–100 | Sleepy below threshold |
| Happiness | 0–100 | Excited when high |
| Social | 0–100 | Lonely when low |
| Curiosity | 0–100 | Drives exploration |
| Boredom | 0–100 | Drives interaction |

Mood is **state-driven**, not LLM-driven.

```text
Hunger < 20       → Hungry
Energy < 15       → Sleepy
Happiness > 80
+ Energy > 50     → Excited
Social < 20       → Lonely
Healthy state     → Happy
```

---

## 🖥️ Desktop Awareness

Pixxy may react to high-level signals such as:

- Active application/window
- Idle time
- Session duration
- Computer lock/unlock
- Startup/shutdown
- Application switching patterns

Examples:

> **VS Code** → “Coding again?”  
> **Power BI** → “Dashboard time!”  
> **Excel** → “Rows and columns... exciting.”  
> **Spotify** → “Okay, DJ.”  
> **Long focus session** → “You've been working for a while.”

These reactions can initially be completely rule-based.

---

## 🪙 Progression

### XP

- Focus session
- Complete a task
- Daily streak
- Return to Pixxy
- Take a healthy break
- Unlock achievements

### Coins

| Action | Reward |
| --- | ---: |
| 30-minute focus session | +10 |
| Complete task | +20 |
| Daily login | +5 |
| Mini-game | +2 |
| Achievement | +50 |

Coins can unlock hats, accessories, plants, furniture, room themes and special items.

---

## 🛡️ Definition of Done — MVP

- Installs successfully on a clean Windows machine
- Appears as a transparent desktop companion
- Has polished idle and interaction animations
- Pet state changes over time
- Mood changes according to state
- User interactions affect Pixxy
- State persists after restart
- Basic desktop context detection works when enabled
- Selected applications trigger local reactions
- User earns and spends coins
- One mini-game is playable
- Basic memory works locally
- Privacy controls are visible and functional
- Pixxy works without an AI model
- Optional local AI works for conversation
- Production installer installs/uninstalls cleanly

---

## 📚 Documentation

| Document | Purpose |
| --- | --- |
| `docs/MVP_EXECUTION_PLAN.md` | Current product execution plan and staged implementation |
| `renderer/src/assets/README.md` | Renderer asset pipeline and organization |
| `.github/workflows/build-test.yml` | Automated Windows test artifact workflow |
| `.github/workflows/build-and-release.yml` | Production release workflow |

---

## 🌱 Future Vision

### V1

Evolution, more rooms, accessories, games, improved memory, better AI, sound and themes.

### V2

Multiple species, personality variations, dynamic world, stories, events and collectibles.

### V3

Optional mobile companion, encrypted sync, voice interaction, multiple Pixxies and optional community features.

---

## ⭐ The North Star

> **Pixxy should feel like a small digital life that exists independently of the AI model.**

The strongest architecture is therefore:

**Virtual Pet + Local AI + Desktop World**

Not a chatbot with a pet skin.

---

## 📜 License

License to be determined as the project matures.

---

<div align="center">

**🐾 PIXXY**  
*Desktop-first local AI companion*

Built around a simple idea:

**The pet is the product. The AI makes the pet smarter and more alive.**

</div>
