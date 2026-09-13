---
'@ankhorage/zora': major
---

Move DatePicker, TimePicker, Hero, MissingElement, and the Skeleton loading building blocks to canonical feature ownership.

DatePicker and TimePicker are now direct manifest nodes backed by the shared Surface BottomSheet controller. DatePicker values, bounds, and change events now use local `YYYY-MM-DD` strings instead of `Date` objects so manifest state remains JSON serializable.

Skeleton components are now direct manifest nodes for custom loading layouts. DataTable also continues to render SkeletonList automatically while loading.
