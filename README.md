# Pixxy renderer assets

Canonical application assets for Pixxy.

- `character/reference/` — reference material; not directly rendered.
- `animations/<state>/` — animation sprite sheets/sequences.
- `expressions/` — facial/expression sprite sheet.
- `spritesheets/` — canonical sprite/component sheets.
- `effects/` — emotion/effect sprites.
- `accessories/` — accessory sprites.

Do not convert these PNG assets to video. The renderer should load/crop/animate the
PNG sprite sheets as needed.

Reference sheets are retained separately so implementation can distinguish
source-of-truth art references from runtime animation assets.
