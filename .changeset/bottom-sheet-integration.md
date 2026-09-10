---
'@ankhorage/zora': major
---

Integrate the Surface 4 BottomSheet runtime into `ZoraProvider`, expose the supported controller API
through `@ankhorage/zora/bottom-sheet`, migrate the date and time pickers, and remove the obsolete
`ActionSheet` and `ActionSheetItem` exports. Expo hosts must now install the gesture-handler,
Reanimated, and Worklets peers and own `GestureHandlerRootView` outside `ZoraProvider`.
