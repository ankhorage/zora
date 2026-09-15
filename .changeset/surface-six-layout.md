---
'@ankhorage/zora': major
---

Adopt the released Surface 6 native-named layout boundary. `View`, `ScrollView`, `Grid`, and `Divider` are the canonical ZORA layout primitives, while `AppShell`, `Screen`, and `ScreenSection` now live under the layout feature.

Remove the redundant `Box`, `Stack`, `Container`, `Center`, `Inline`, `Spacer`, and `Show` exports together with the specialized `SettingsLayout`, `SidebarLayout`, and `TopbarLayout` wrappers. Replace `TileGrid` with `Grid` and `SettingsRow` with `ListRow`; `ContentRail` and `PaletteItem` retain their public names under dedicated feature owners.

Update the component registry, authoring metadata, examples, acceptance coverage, and generated Paradox documentation for the new Surface 6 architecture.
