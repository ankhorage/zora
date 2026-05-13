# Visual Discovery

Real Expo Router + React Native Web example app for ZORA.

This app proves a Pinterest-style `social_community` starter shape with discover, boards, saved items, trends, and profile routes.

## Routes

- Discover
- Boards
- Saved
- Trends
- Profile

## Run

```bash
bun install
bunx expo start
```

## Rules

- Uses real Expo Router route files.
- Uses public `@ankhorage/zora` exports for UI.
- Does not use `StyleSheet`.
- Does not import `@ankhorage/surface`.
- Installs the published `@ankhorage/zora` package.

## ZORA pressure point

This app intentionally uses existing media cards and lists instead of local layout hacks. A richer Pinterest-style product should introduce a dedicated ZORA `Wall`, `Masonry`, or visual grid pattern later.
