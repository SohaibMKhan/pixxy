# Pixxy

Pixxy is a desktop-first AI virtual pet and companion for Windows.

The goal is simple: Pixxy should feel like a small character that actually lives on your desktop rather than another application window.

## Current development workflow

The repository is the source of truth for development.

```text
GitHub main/source
      ↓
GitHub Actions test build
      ↓
Windows artifact (.exe / installer)
      ↓
Test Pixxy
      ↓
Fix and repeat
      ↓
v0.1.0 release
```

During development, Windows test builds are produced automatically when application-related files change on `main`. Documentation-only changes do not trigger the test build.

You can also manually run the test workflow from GitHub Actions.

## Project structure

```text
pixxy/
├── app/                         # Electron main-process and application modules
├── renderer/                    # Pixxy renderer/UI
│   └── src/
│       └── assets/              # Canonical renderer assets
├── assets/                      # Supporting/source asset area
├── docs/                        # Project documentation
├── installer/                   # Installer-related files
├── .github/workflows/           # CI and release workflows
├── package.json
├── electron.vite.config.ts
└── electron-builder.yml
```

## Pixxy assets

The canonical runtime character assets are maintained under:

```text
renderer/src/assets/
```

The asset library contains Pixxy character references, animation sheets, expressions, effects, accessories, and spritesheets.

## Development

Install dependencies:

```bash
npm ci
```

Run the desktop application locally:

```bash
npm run dev
```

Run the type checker:

```bash
npm run typecheck
```

Build the production application:

```bash
npm run dist
```

## Test builds

The GitHub Actions workflow:

```text
.github/workflows/build-test.yml
```

creates a Windows test artifact named:

```text
pixxy-windows-test
```

The artifact is intended for testing and is not the public release.

## Releases

Public releases are reserved for version tags such as:

```text
v0.1.0
v0.1.1
v0.2.0
```

The release workflow builds the Windows release and publishes the resulting files as GitHub Release assets.

## Status

Pixxy is currently under active MVP development. Desktop behavior, character animation, interaction, settings, palettes, and the AI companion layer are being developed incrementally.
