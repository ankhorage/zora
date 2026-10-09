# Explorer GridView migration

Issue #519 makes `Explorer`, `MediaExplorer`, and `FileExplorer` the single first-party ZORA
catalogue presentation. They compose `TileGrid`, which renders through the published
`@ankhorage/grid-view` viewport, culling, and reveal APIs.

## Inventory and disposition

| Surface                                     | Owner                           | Disposition                                                                          |
| ------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------ |
| `Explorer`, `MediaExplorer`, `FileExplorer` | ZORA                            | Canonical TileGrid consumer                                                          |
| `Uploader` app-owned collection selection   | ZORA                            | Uses `Explorer`; validation, upload, progress, and remove stay with Uploader         |
| `expo-image-picker`                         | Operating-system picker adapter | Retained intentionally; it is protected system UI, not a ZORA gallery                |
| `expo-document-picker`                      | Operating-system picker adapter | Retained intentionally; it is protected system UI, not a ZORA file browser           |
| `Grid`                                      | ZORA layout primitive           | Retained intentionally; it has no browsing, viewport, or selection semantics         |
| `MediaCard` and `PaletteItem`               | ZORA presentation components    | Retained intentionally; neither owns a catalogue, tile selection, or viewport engine |

The source and example inventory found no earlier first-party media gallery, file browser, or tile
selection engine to delete. No duplicate engine remains: selection delegates to
`@ankhorage/utility/selection`, and viewport geometry/culling/reveal delegates to published
`@ankhorage/grid-view`.

## Provider boundary

Providers retain cursors, permission objects, native assets, and mutations. Explorer receives only
serializable `ExplorerItem` rows plus projected `granted`, `limited`, `denied`, or `unavailable`
access state. Its `onLoadMore` callback asks an application provider for another page without
passing a cursor or native object through the public UI contract.

`examples/grid-workspaces` exercises paged 10,000-item media, limited and denied access, file
selection, and an Uploader that receives an Explorer-selected normalized asset. It intentionally
does not model lasso, drag-and-drop, move, or reorder: no current ZORA Explorer consumer exposes a
provider mutation capability, so fabricating one here would violate the provider boundary.
