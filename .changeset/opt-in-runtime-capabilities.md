---
'@ankhorage/zora': major
---

Make toast and native bottom-sheet runtime hosts explicit `ZoraProvider` capabilities, migrate Toast to feature ownership, and render DatePicker/TimePicker through platform-specific hosts with BottomSheet on native and Popover on web.

BREAKING CHANGE: `ZoraProvider` no longer installs `BottomSheetProvider` automatically. Native apps using BottomSheet-backed interactions must enable `<ZoraProvider bottomSheet>`. Enable `<ZoraProvider toast>` or pass toast provider options when descendants use `useToast()`.
