# 🐾 Pixxy

> **A useful digital companion that lives on your desktop.**
>
> Pixxy is a Windows desktop companion designed to feel alive, be genuinely useful, and remain local-first. It combines a persistent desktop character with reminders, task-based progress, desktop awareness, file & folder awareness, and an optional local AI layer.

**🐾 The pet is the personality. The utility makes Pixxy useful. AI makes Pixxy smarter.**

<div align="center">

<img src="renderer/src/assets/character/reference/pixxy_approved_reference.png" alt="Pixxy character reference" width="420" />

*Canonical Pixxy character reference*

</div>

[What is Pixxy?](#-what-is-pixxy) • [Core Features](#-core-features) • [Architecture](#-architecture) • [Roadmap](#-roadmap) • [Development Workflow](#-development-workflow)

---

## ✨ What is Pixxy?

Pixxy is a **Windows desktop companion** that lives directly on the user's desktop. It is designed to be more than a decorative virtual pet: Pixxy can react to interaction, provide useful reminders, understand selected desktop context, help locate files and folders, react to supported AI-agent activity, and provide lightweight task-based motivation.

The AI layer is intentionally optional. Pixxy's core interaction, reminders, persistence, desktop awareness, file/folder awareness, and task-streak features are designed to work locally without requiring an LLM.

### Why Pixxy is different

| Traditional AI assistant | Pixxy |
| --- | --- |
| AI is the main product | 🐾 The character is the personality and interface |
| Often cloud-first | 🔒 Local-first by design |
| Mostly conversational | 🖥️ Lives directly on the desktop |
| Utility hidden behind a chat UI | ✨ Utility expressed through the companion |
| Generic notifications | 🐾 Contextual character reactions |
| No persistent visual presence | 👀 Persistent desktop presence |
| General productivity tools | 🎯 Task-based streaks and fixed rewards |
| AI must perform everything | ⚙️ Deterministic systems handle core behavior |

Pixxy takes inspiration from desktop companions such as Comnyang, while defining its own direction around **usefulness, local-first AI, task progression, desktop awareness, and a robot companion identity**.

---

## 🎯 Product Principles

> **Pixxy should never become simply “a cute UI around an LLM.”**

- 🐾 The character remains central.
- 🧠 AI is an intelligence layer, not the entire product.
- 🔒 Local-first data handling is the default.
- 👤 Users control what Pixxy remembers and observes.
- ⚙️ Core behavior is deterministic and independent of the LLM.
- 💤 Pixxy should feel alive without becoming annoying or intrusive.
- 🎯 Every utility feature should have a clear purpose.
- 🚫 No unnecessary pet-maintenance mechanics.
- 🚫 No autonomous wandering or constant walking.
- 🚀 Build the defined final product rather than repeatedly expanding an MVP.

---

## 🧩 Core Features

### 🐾 Desktop Companion

- Crisp pixel-art Pixxy character
- Stable idle behavior
- Natural blinking and subtle micro-motion
- 👀 Eye-follow behavior
- 👋 Wave reactions
- 🖱️ Hover-to-pet interaction
- 🖱️ Deliberate drag/repositioning
- ⌨️ Keyboard kneading reaction
- 🌡️ Overheat mode
- Right-click menu
- First-launch name setup
- Multiple Pixxy color variants

### ⏰ Useful Reminders

- 🧘 Stretch reminder
- 💧 Drink-water reminder
- 🔔 Custom message/time reminder
- Optional reminder sounds
- Snooze/dismiss behavior

### 🤖 AI-Agent Reactions

Pixxy can visually react to supported AI activity:

**THINKING ALONG**

When a supported AI agent is thinking or processing a task, Pixxy switches to a thinking state.

**AGENT DONE**

When the supported agent finishes a task, Pixxy performs a short happy-hop/success reaction and can optionally make a sound.

AI remains optional. Pixxy must remain useful with AI completely disabled.

### 📁 File & Folder Awareness

Pixxy can optionally maintain a **local index of user-selected folders** so it can answer natural-language questions such as:

> “Pixxy, where is my Power BI dashboard?”

Pixxy can search the local index and return the file's exact location.

The system is designed to:

- Index user-selected folders/drives locally
- Track file and folder names and paths
- Track relevant creation/modification information
- Detect relevant move, rename and deletion changes
- Search the index using natural-language queries
- Return exact file/folder paths
- Optionally open a file or containing folder when explicitly requested
- Keep the index local and privacy-controlled
- Avoid reading document contents merely to answer location questions

### 🎯 Task-Based Streaks

Pixxy does **not** use a traditional virtual-pet economy.

Instead:

- Users complete qualifying tasks
- Daily completion contributes to a streak
- Fixed milestones unlock predefined rewards
- Rewards can be cosmetic Pixxy variants, reactions, badges or other fixed unlocks
- 🪙 No coins
- 💰 No money system
- ⭐ No XP system
- 🎰 No random loot economy

---

## 🚫 Explicitly Removed From the Final Direction

The following systems are intentionally **not part of Pixxy's product direction**:

- ❌ Autonomous walking
- ❌ Rooms
- ❌ Room themes
- ❌ Furniture
- ❌ Inventory tied to a room
- ❌ Food / feeding logic
- ❌ Hunger
- ❌ Generic pet-maintenance needs
- ❌ Game engine
- ❌ Mini-games
- ❌ Coins
- ❌ XP
- ❌ Money/economy system
- ❌ Generic event engine for discoveries/gifts/surprises

This keeps Pixxy focused on being a **useful desktop companion** instead of becoming a large simulated-pet game.

---

## 🎬 Animation Philosophy

Pixxy should feel **alive, not like a looping movie reel**.

Autonomous walking has been intentionally removed. Pixxy should normally remain stationary and use a small set of meaningful reactions.

```text
Launch
  ↓
Wave once
  ↓
Stable idle
  ↓
Blink / subtle micro-motion
  ↓
User or system interaction
  ↓
Specific reaction
  ↓
Return cleanly to idle
```

Examples:

```text
IDLE → PET → IDLE

IDLE → THINKING → AGENT DONE → IDLE

IDLE → STRETCH → IDLE

IDLE → WATER REMINDER → IDLE

IDLE → MESSAGE REMINDER → IDLE
```

High-priority interactions interrupt low-priority idle behavior and then return cleanly to the previous state.

There should be **no oversized invisible container**, no desktop-blocking hitbox, no sliding sprite/movie-reel movement, and no visible clipping around Pixxy.

---

## 🖥️ Desktop Interaction Model

Pixxy is intended to coexist naturally with the Windows desktop.

### Interaction rules

- Pixxy stays at its chosen position by default.
- The interaction/hitbox closely follows the visible character.
- Everything outside the character remains clickable.
- Hovering over Pixxy's head can trigger petting.
- Single click can trigger a wave/attention reaction.
- Right-click opens the Pixxy menu.
- Deliberate dragging allows Pixxy to be repositioned.
- Settings must never leave an invisible blocking area after opening/closing.

The desktop should never feel like Pixxy has taken over half the screen.

---

## 🧠 Local AI Philosophy

Pixxy is designed to work **without an AI model**.

```text
                    PIXXY
                      │
        ┌─────────────┼─────────────┐
        │             │             │
   CHARACTER       UTILITY       AI BRIDGE
        │             │             │
   Idle / Pet      Reminders    Local LLM / Agents
   Wave / Eye      Tasks        Thinking / Done
   Reactions       Streaks      Context
   Palettes        File Search  Personality
        │             │             │
        └─────────────┼─────────────┘
                      ↓
                DESKTOP WORLD
                      │
               LOCAL PERSISTENCE
                      ↓
                    SQLite
```

The initial AI integration is planned around a provider interface with an **Ollama adapter** as the local-first route. The rest of Pixxy should not be tightly coupled to one AI runtime.

Runtime/model packaging and redistribution terms must be verified before shipping an installer that automatically installs AI components.

---

## 🏗️ Architecture

### Core systems

- **Desktop Companion Engine** — window behavior, interaction, positioning and desktop coexistence.
- **Character Engine** — idle, reactions, animation state and visual variants.
- **Reminder Engine** — stretch, water and custom message reminders.
- **Task & Streak Engine** — qualifying tasks, daily streaks and fixed unlocks.
- **Desktop Awareness Engine** — active application, idle time and selected high-level desktop context.
- **File & Folder Awareness Engine** — local index of user-selected folders for file-location questions.
- **Memory Engine** — local preferences and explicitly stored memories.
- **AI Bridge** — optional local LLM/agent provider integration.
- **UI Layer** — transparent desktop companion, right-click menu, settings and configuration.
- **Asset System** — canonical Pixxy character, animations, palettes, sounds and icons.
- **Persistence Layer** — SQLite local storage.

### Technology Stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| Desktop shell | **Electron** | Transparent window, tray and Windows integration |
| Frontend | **React + TypeScript** | UI and companion controls |
| Application logic | **Node.js + TypeScript** | Core services and orchestration |
| Database | **SQLite** | Local persistence |
| AI runtime | **Ollama adapter** | Optional local LLM integration |
| Assets | **PNG / SVG / Sprite Sheets** | Character and UI assets |
| Packaging | **Electron Builder** | Windows installer/executable |
| CI/CD | **GitHub Actions** | Automated Windows test builds and releases |

---

## 🗂️ Project Structure

```text
pixxy/
├── app/
│   └── main/                 # Electron main process and desktop shell
├── renderer/
│   └── src/
│       ├── assets/           # Canonical renderer assets
│       └── ...               # React renderer
├── database/                 # Local persistence layer
├── installer/                # Packaging / installer configuration
├── docs/                     # Product and execution documentation
├── .github/
│   └── workflows/            # GitHub Actions
└── package.json
```

The renderer asset pipeline is intentionally kept under `renderer/src/assets/` as the canonical location for Pixxy's visual assets.

---

## 🎨 Pixxy Character Design

Pixxy uses **crisp, modern pixel art** with a consistent silhouette, expressive face, controlled palette and transparent production assets.

The character pipeline is:

**Base character → expressions → poses → animation frames → effects → accessories**

<div align="center">

<img src="renderer/src/assets/character/reference/pixxy_approved_reference.png" alt="Canonical Pixxy character" width="420" />

**Canonical Pixxy character reference**

</div>

### Planned color variants

- 🟦 Default canonical Pixxy
- 🎨 Variant 2
- 🎨 Variant 3

The variants should preserve the same canonical character design rather than creating unrelated characters.

---

## 🖥️ Desktop Awareness

Pixxy can react to high-level desktop context such as:

- Active application/window
- Idle time
- Session duration
- Computer lock/unlock
- Startup/shutdown
- Application switching patterns
- Supported AI-agent activity

### File & Folder Awareness

File awareness is a dedicated part of desktop awareness.

Pixxy should be able to answer:

> “Where is my Pixxy blueprint?”

> “Where did I save the sales dashboard?”

> “Where is the folder for this project?”

The deterministic file-awareness service searches the local index. The AI layer can interpret the user's natural-language question and communicate the result, but the AI does not need to independently scan the filesystem.

### Privacy

File awareness should be **opt-in and scoped to user-selected folders/drives**. Basic location queries do not require reading document contents.

Pixxy should avoid collecting document contents, passwords, or sensitive content merely to provide file-location awareness.

---

## 🔒 Privacy by Design

Pixxy is intended to be **local-first**.

Users should be able to control whether Pixxy can:

- Remember things explicitly told to it
- Remember application activity
- Remember productivity patterns
- Remember conversations
- Automatically create memories
- Index selected folders
- View stored memories
- Delete individual memories
- Delete all Pixxy data
- Disable desktop awareness
- Disable AI integrations

The goal is for Pixxy to be useful without requiring users to surrender their data to a cloud service.

---

## 🗺️ Final Implementation Plan

The project is no longer being treated as an open-ended MVP. The following steps define the intended path to the final product.

### Step 1 — Scope & Cleanup

Remove the old room, game, food, hunger, economy, coin, XP, furniture and autonomous-walking systems from the active product direction.

### Step 2 — Desktop Shell & Hitbox

- Tight Pixxy interaction region
- No oversized invisible blocker
- Correct taskbar behavior
- Correct settings open/close behavior
- Clean dragging/repositioning
- Stable transparent window

### Step 3 — Character & Animation

- Stable idle
- Blink / subtle micro-motion
- Wave
- Eye follow
- Hover-to-pet
- Keyboard kneading
- Overheat mode
- Agent thinking
- Agent done
- Reminder reactions
- No autonomous walking

### Step 4 — Interaction System

- Right-click menu
- Single-click wave
- Hover petting
- Deliberate drag
- State priority/interruption system
- Clean return to idle

### Step 5 — Reminder Engine

- Stretch reminder
- Water reminder
- Custom message/time reminder
- Snooze/dismiss
- Optional sounds

### Step 6 — Task Streaks

- Qualifying daily tasks
- Consecutive-day streak
- Fixed milestone rewards
- Cosmetic/behavioral unlocks
- No coins
- No XP
- No money

### Step 7 — Pixxy Variants

- Preserve canonical design
- Add two additional crisp color variants
- Palette selection and persistence

### Step 8 — Desktop & File Awareness

- Active application detection
- Idle/session awareness
- User-selected folder indexing
- File/folder path search
- Move/rename/delete detection
- Natural-language file-location queries
- Privacy controls

### Step 9 — AI Bridge

- Provider interface
- Ollama integration
- Runtime detection
- Model configuration
- Context builder
- Thinking reaction
- Agent-done reaction
- Optional memory context

### Step 10 — Personalization & Polish

- First-launch name setup
- Settings
- Sound preferences
- Palette preferences
- Reminder preferences
- Startup option
- Taskbar/tray behavior
- DPI/scaling
- Multi-monitor testing
- Animation timing
- Pixel sharpness

### Step 11 — Automated Test Build

GitHub Actions compiles a Windows test artifact. The packaged application is downloaded and tested as the real user-facing build.

### Step 12 — Final Release

Only after the test build is stable and accepted:

```text
Final changes
    ↓
v0.1.0
    ↓
GitHub Actions
    ↓
Windows production build
    ↓
GitHub Release
    ↓
Users download Pixxy
```

---

## 🔄 Development Workflow

Pixxy uses a **GitHub-first workflow**.

```text
Changes
   ↓
GitHub main/source
   ↓
GitHub Actions
   ↓
Windows test build
   ↓
Download .exe/package
   ↓
Test Pixxy
   ↓
Report issues
   ↓
Fix
   ↺

When satisfied
   ↓
v0.1.0
   ↓
Production build
   ↓
GitHub Release
```

### Automated test builds

The Windows test build should run for **application-related changes**, while documentation-only changes such as `README.md` should not consume a Windows build.

Typical build-triggering paths include:

- `app/**`
- `renderer/**`
- runtime/application assets
- package/build configuration
- GitHub Actions build configuration

A manual workflow trigger remains available when a build is needed without an application change.

### Local development

Local development remains available for deeper debugging:

```bash
npm ci
npm run dev
```

The preferred product-testing loop is:

**GitHub → Actions → Windows artifact → test → feedback → fix.**

---

## 🧪 Definition of Done

Pixxy's final product direction is considered complete when:

- First launch asks for and persists the user's name.
- Pixxy is crisp and never visibly clipped.
- No oversized invisible hitbox blocks the desktop.
- Settings open/close without invisible UI leftovers.
- Pixxy does not autonomously walk.
- Eye-follow behavior feels natural.
- Hovering Pixxy's head pets it.
- Single click can trigger a wave.
- Right-click opens the menu.
- Dragging works deliberately without blocking the desktop.
- Keyboard kneading reacts correctly and returns to idle.
- Overheat mode triggers under its defined condition and exits cleanly.
- Stretch, water and message reminders work.
- Task streaks persist locally and unlock fixed rewards.
- At least three Pixxy color variants are selectable.
- File & Folder Awareness can locate files in user-selected indexed folders and return their paths accurately.
- AI thinking and task-complete reactions work when an adapter is connected.
- Pixxy remains useful with AI disabled.
- Packaged Windows test artifact launches correctly.
- Formal GitHub release installs/uninstalls cleanly.

---

## 📚 Documentation

| Document | Purpose |
| --- | --- |
| `docs/PIXXY_FINAL_PRODUCT_BLUEPRINT.md` | Final product direction and implementation blueprint |
| `docs/MVP_EXECUTION_PLAN.md` | Existing execution documentation during the transition |
| `renderer/src/assets/README.md` | Renderer asset pipeline and organization |
| `.github/workflows/build-test.yml` | Automated Windows test artifact workflow |
| `.github/workflows/build-and-release.yml` | Production release workflow |

---

## 🌱 Future Vision

Future versions may explore additional characters, richer personality, more desktop reactions, improved memory, voice interaction, optional encrypted sync and other extensions.

These are deliberately outside the current final-product implementation scope until the core Pixxy experience is stable.

---

## ⭐ The North Star

> **Pixxy should feel like a small digital companion that exists independently of the AI model — while actually helping you get things done.**

The core architecture is:

**Desktop Companion + Useful Utilities + Local AI**

Not a chatbot with a pet skin.

---

## 📜 License

License to be determined as the project matures.

---

<div align="center">

**🐾 PIXXY**  
*Useful desktop companion • Local-first • AI-enhanced*

**The pet is the personality. The utility makes Pixxy useful. The AI makes Pixxy smarter.**

</div>
