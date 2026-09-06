# Separate runtime assets from screen evidence

Read this reference for `interactive`, `screen`, `screens`, and `template`. Every icon and real image
region used in a designed screen must have a separately usable asset before screen delivery and
template promotion. Reuse one file for repeated content across screens and states.

## Asset-first design

During interactive configuration, inventory the intended icon and image regions alongside the
screen list. Configuration alone may leave files planned. Once the requested screen production
starts, produce the individual assets as part of that same deliverable. An explicit request for
assets during `interactive` also authorizes producing them; keep unresolved design choices visible.

For direct `template` requests, perform the same asset preparation before scaffolding, even when
no concept screens exist. A request that already authorizes creation does not require another
confirmation merely for these normal asset preparation steps.

- SVG icons: author real vector paths, or reuse matching licensed vector artwork with attribution.
  Keep a consistent viewBox, geometry and stroke weight. Use `currentColor` for themeable icons.
  Do not wrap a raster crop or embedded PNG in an SVG. A raster image generator cannot produce
  true SVG geometry; use vector authoring and validate the XML with an available XML tool.
- Photos, covers, avatars, logos and illustrations: generate or reuse each distinct image as a
  separate file with the required crop, resolution and transparency. Use an available image
  generation/editing tool for new raster content. Do not claim generation when that tool is absent.
  Preserve suitable user-supplied source assets. For an existing screen image, extract only the
  image region when its quality is sufficient; otherwise regenerate that region separately.
- Generate assets before concept screens. Supply those files as image references when creating
  the screens and inspect that the resulting content matches. For exact fidelity, render a ZORA
  composition using the files. A concept model's approximation is not proof of exact reuse.
- Inspect each separate file and the screens visually. If a concept introduces another icon or
  image, produce that asset and reconcile the inventory before calling the screen deliverable
  complete. Do not substitute the whole screen image for application content.

Keep one portable design directory until template promotion:

```text
design-assets.json
assets/screens/home.png
assets/images/cover.png
assets/images/svg/book.svg
```

Use a task-specific artifact directory for screen-only work. Do not scaffold a template just to
store its assets. Carry this same bundle into `template`; do not generate a second inconsistent set.
Changing an asset or screen region invalidates its previous visual review and affected references.

## Asset bundle contract

`design-assets.json` is a handoff inventory, not runtime manifest authority. Source paths are
relative to its directory; targets are relative to the future template root. Record every runtime
use as a JSON pointer to the `{ "mediaId": "..." }` reference in the planned/final manifest.
The normal app model and component schemas still come from the installed owners.

```json
{
  "assets": [
    {
      "mediaId": "book-icon",
      "role": "icon",
      "sourcePath": "assets/images/svg/book.svg",
      "targetPath": "assets/images/svg/book.svg",
      "contentType": "image/svg+xml",
      "usages": ["/navigator/routes/0/icon/source"]
    },
    {
      "mediaId": "book-cover",
      "role": "image",
      "sourcePath": "assets/images/cover.png",
      "targetPath": "assets/images/cover.png",
      "contentType": "image/png",
      "usages": ["/screens/home/root/children/0/props/source"]
    }
  ],
  "screens": [{ "sourcePath": "assets/screens/home.png", "targetPath": "assets/screens/home.png" }]
}
```

The pointers above are examples; use the actual topology. Empty arrays explicitly declare no
runtime assets or no screen evidence. Supported portable image files are SVG, PNG, JPEG and WebP.
Preserve source attribution, generation prompts, region purpose, visual review and dimensions in
the design artifact's `assets.entries`; do not infer those facts from a filename.

Before handing off screens, run:

```text
bun .agents/skills/zora-designer/scripts/asset-bundle.ts path/to/design-assets.json
```

This checks the files, path confinement, duplicates, basic image signatures and standalone SVG
shape. It does not decode images, parse all XML, assess visual quality or prove runtime rendering.
Perform those relevant visual/XML checks separately and record their evidence. Missing assets
block asset completion, not unrelated configuration discussion.

## Manifest and template promotion

Register every bundle asset in `manifest.media.assets` as `kind: image`, with matching `id`,
`contentType` and bundled `source.path`. SVG icons belong under `assets/images/svg/`; other images
belong under `assets/images/`. Screen evidence stays under `assets/screens/` and is never media.

Use the existing ZORA `Icon` with `source: { mediaId }` for these SVGs, including navigator icons.
Use ZORA `Image` with its owner-supported media source for application imagery, or an exact semantic
component's supported media prop. Do not add an SVG provider or a separate SVG component. Named
font icons remain valid for existing designs when requested, but do not substitute them for the
separate SVG assets of this workflow. Inspect current owner metadata and runtime media resolution.

Run the bundle checker with `manifest.json` to check registered assets and actual reference paths.
Pass the same file as `assetBundlePath` to the scaffolder:

```json
{
  "targetDirectory": "/path/to/templates",
  "category": "books_reading",
  "slug": "reader",
  "assetBundlePath": "/path/to/design/design-assets.json",
  "manifest": {}
}
```

Replace the example empty manifest with the complete release-valid owner manifest. The scaffolder
validates and reads all asset bytes before creating output, copies them to their checked targets,
and returns every created file. It fails on missing files, dangling media references, unused bundle
entries, mismatched registrations or invalid paths. Owner release validation remains mandatory.

After scaffolding, inspect the exported template artifact and verify generated runtime usage through
the consuming app's media resolver. A passing bundle/manifest check alone does not prove that Studio
or another consumer renders the files. Report missing consumer support explicitly; never call an
untested runtime path verified.

For generated applications, verify that the installed runtime preserves image media references
until media resolution (`@ankhorage/runtime` 2.2.6 or newer). The Icon manifest node and normal
container support for Icon/Image require ZORA 4.2.0 or newer; the owner helper enforces this minimum.
