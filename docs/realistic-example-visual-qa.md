# Realistic example visual QA

Use this checklist when changing `examples/{category}/{example-id}` apps.

## Layout density

- Mobile screens should show meaningful content above the fold.
- Tablet and desktop widths should use horizontal space instead of stacking every card vertically.
- Repeated `ListSection` card rows should use the ZORA responsive list grid behavior instead of route-local wrappers.
- Metric/card overview sections should use `ScreenSection` responsive columns where the content is naturally parallel.

## Visual identity

- Every realistic example should define an app-level `ZoraTheme` in its root layout.
- Theme seeds should differ by app category and product feel.
- Repeated imagery across examples should be avoided when it makes apps feel generic.
- AppBar chrome should stay compact: title plus persistent actions such as the dark-mode toggle.
- Badges, counters, avatars, and large buttons belong in content sections, not in the AppBar.

## Constraints

- Use public `@ankhorage/zora` exports only.
- Do not import `@ankhorage/surface` directly from examples.
- Do not add `StyleSheet` or raw React Native layout hacks to examples.
- If a layout feels wrong, improve a ZORA component or pattern.
