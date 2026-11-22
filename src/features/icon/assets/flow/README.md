# Flow node-kind SVG assets

This is a reviewed visual-asset set for [ZORA issue #1275](https://github.com/ankhorage/zora/issues/1275). It is intentionally not a Flow renderer, runtime kind contract, or icon registry.

`manifest.json` is the canonical inventory: it provides the semantic ID, human-readable accessible label, asset path, description, and reference status for every icon. The 12 source-grounded semantic IDs are `trigger`, `schedule`, `webhook`, `manual`, `content-input`, `transform`, `ai-agent`, `approval`, `publish`, `analytics`, `condition`, and `loop`. `schedule` aliases `trigger.svg`; it does not duplicate the bolt glyph.

The remaining ten IDs are marked `proposed`. They are asset proposals only and must not become Flow runtime or persisted Contract values without separate approval.

All glyphs are original Ankhorage artwork based on *Ankhorage Process Engine Showcase.png* (1448x1086, SHA-256 `7069dfce205fb3238f270d2a8ee4b81f415c956a8e9878b778ca5a90ec8d096c`); no third-party glyphs are reused. Each self-contained SVG has a 24x24 viewBox, uses a 1.85 round outline with `currentColor`, and includes `title` and `desc` elements. The backing tile belongs to the future Flow node or palette owner, not the SVG.

`contact-sheet.svg` is visual review evidence, not a runtime asset. Existing ZORA `Icon` remains the published Surface-backed media primitive; these source SVG paths are deliberately not wired to a Flow UI or registry here.
