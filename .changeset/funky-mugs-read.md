---
'@ankhorage/zora': patch
---

Fix infinite render loop in Modal and Drawer

Stabilizes onDismiss handling to prevent repeated state updates causing
"Maximum update depth exceeded" errors when opening overlays.
