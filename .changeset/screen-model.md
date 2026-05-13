---
'@ankhorage/zora': minor
---

Replace the web-oriented `Page` / `PageHeader` / `PageSection` layout model with the native-app-oriented `Screen` / `ScreenSection` model.

`Screen` is the default scroll owner for normal app screens, while `AppBar` owns the active screen title and screen-level actions. `ScreenSection` replaces page sections as the content grouping primitive inside app screens.
