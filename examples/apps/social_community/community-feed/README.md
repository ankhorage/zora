# Community Feed

Real Expo Router + React Native Web example app for ZORA.

This app proves a Facebook-style `social_community` starter shape with real route files and real ZORA navigation chrome.

## Routes

- Feed
- Groups
- Messages
- Profile
- Settings

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
- Uses the local ZORA package through `file:../../../../`.
