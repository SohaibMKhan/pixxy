# Pixxy — Final Product Execution Plan

> This is the implementation sequence for the final Pixxy product. Pixxy is not being developed as an MVP; the repository will move toward the defined final product while every major step remains testable through GitHub Actions.

## Working Rule

We implement one step at a time, push to `main`, let GitHub Actions produce a Windows test artifact, test it, fix issues, and only proceed when the current step is stable.

Final release happens only after the complete Definition of Done is satisfied.

---

## Step 1 — Foundation Reset & Final Product Alignment

- Remove obsolete MVP concepts from the active application path:
  - walking/autonomous movement
  - rooms and room themes
  - food/hunger logic
  - games
  - coins/XP/economy
  - obsolete celebration/event behavior
- Keep Pixxy as a small transparent desktop companion with a tight interaction boundary.
- Establish the final settings/profile model.
- Keep onboarding/name setup.
- Keep right-click as the primary menu interaction.
- Preserve drag as an intentional interaction without creating an oversized invisible desktop-blocking region.
- Establish the final asset/animation contract.
- Verify startup, tray behavior, taskbar presence and transparent-window behavior.

## Step 2 — Character & Interaction System

- Final crisp Pixxy sprite integration.
- Idle, blink, wave, pet, happy/agent-done, thinking, keyboard-kneading and overheat reactions.
- Natural eye-follow behavior.
- Hover-on-head petting interaction.
- Single-click interaction behavior.
- Right-click menu.
- Controlled drag behavior.
- Eliminate sprite-sheet/canvas sliding and clipping problems.

## Step 3 — Profile, Settings & Personalization

- First-launch name setup.
- Profile persistence.
- Reset profile.
- Restore defaults.
- Three Pixxy color palettes.
- Always-on-top setting.
- Launch-at-startup setting.
- Clear separation between the character interaction area and settings UI.

## Step 4 — Reminder & Utility Engine

- Stretch reminder.
- Water reminder.
- User-defined time/message reminder.
- Notification/sound behavior.
- Reminder scheduling and persistence.
- Quiet/disable controls where appropriate.

## Step 5 — Desktop Awareness Engine

- Active application awareness.
- Idle/session awareness.
- Keyboard activity signal for kneading.
- High-load/context signal for overheat mode.
- Privacy-first opt-in controls.
- No keystroke/content capture.

## Step 6 — File & Folder Awareness

- User-selected folder/drive indexing.
- Local file/folder metadata index.
- File and folder name/path search.
- Rename/move/delete detection.
- Natural-language location questions.
- Exact path responses.
- Optional explicit open-file/open-folder action.
- Local-only storage and privacy controls.
- No document-content indexing for basic location questions.

## Step 7 — Local AI Layer

- AI provider abstraction.
- Ollama adapter.
- Runtime/model availability detection.
- Local context builder.
- Pixxy personality/system prompt.
- Conversation interface.
- AI fallback when the model is unavailable.
- File/folder awareness tool access.
- Desktop-awareness context only when permitted.

## Step 8 — AI-Linked Character Reactions

- Thinking Along reaction while a supported AI task is processing.
- Agent Done happy hop/reaction when a supported AI task completes.
- Context-appropriate Pixxy reactions without interrupting normal utility behavior.
- Deterministic fallback behavior when AI is disabled.

## Step 9 — Task Streak & Fixed Rewards

- Define supported task/progress signals.
- Daily streak tracking.
- Streak persistence in SQLite/local storage.
- Fixed non-monetary reward milestones.
- Reward/unlock presentation.
- No coins, XP economy or virtual currency.

## Step 10 — Persistence & Data Management

- SQLite/local persistence layer.
- Profile state.
- Settings.
- Reminders.
- Streaks/rewards.
- File index metadata.
- AI-related local preferences/memory where enabled.
- Reset/delete controls.
- Migration/versioning.

## Step 11 — Privacy & Safety Controls

- Explicit desktop-awareness permission/control.
- Explicit folder-indexing scope.
- Clear explanation of what Pixxy observes/stores.
- No keystroke logging.
- No password/sensitive-content collection.
- No document-content scanning for location-only queries.
- Local-first storage.
- Delete/reset mechanisms.

## Step 12 — UI Polish & Product Experience

- Final visual hierarchy.
- Right-click menu polish.
- Reminder UI.
- Settings/profile UX.
- AI interaction UX.
- File-location response UX.
- Reward/streak UX.
- Accessibility and keyboard navigation where relevant.
- DPI/scaling and multi-monitor behavior.

## Step 13 — Automated Testing & Reliability

- Unit tests for core services.
- Persistence tests.
- Reminder tests.
- File-index tests.
- AI adapter tests with mocked provider behavior.
- Desktop-awareness tests where practical.
- Interaction regression tests.
- Build/typecheck/test validation in GitHub Actions.

## Step 14 — Windows Packaging & Test Releases

- Electron Builder configuration.
- Windows installer.
- Clean-install testing.
- Upgrade testing.
- Uninstall testing.
- Offline behavior testing.
- Startup behavior testing.
- Test artifact generated automatically after source changes.

## Step 15 — Final QA & Release Candidate

- Full Definition of Done review.
- Test on clean Windows environment.
- Test normal desktop applications.
- Test multi-monitor/DPI scenarios.
- Test privacy controls.
- Test AI disabled.
- Test AI enabled with local runtime.
- Test file/folder awareness.
- Test reminders and streaks.
- Fix all release-blocking issues.

## Step 16 — v1.0 Release

- Freeze release candidate.
- Tag release.
- GitHub Actions builds the Windows installer.
- Publish the final GitHub release.
- Attach installer artifacts.
- Update release notes.
- Keep source repository clean: build/release artifacts remain CI outputs, not tracked source files.

---

## GitHub Workflow

```text
Change one implementation step
        ↓
Push/commit to main
        ↓
GitHub Actions
        ↓
Windows test artifact
        ↓
Download + test Pixxy
        ↓
Fix issues if required
        ↓
Repeat until stable
        ↓
Next implementation step
        ↓
Final QA
        ↓
v1.0.0 tag
        ↓
GitHub Release + Windows installer
```

## Current Status

**Step 1 — Foundation Reset & Final Product Alignment: STARTING**

The repository currently contains earlier experimental pet behavior and settings concepts. These are being treated as implementation debt and will be replaced/removed according to this final plan rather than carried into the finished product.
