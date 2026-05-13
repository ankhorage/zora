# Marketplace

Real Expo Router + React Native Web example app for ZORA.

This app proves a marketplace-style `shopping_commerce` starter shape with browsing, search, listing creation, orders, and profile routes.

## Routes

- Browse
- Search
- Sell
- Orders
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

This app intentionally uses existing media cards and lists instead of local commerce wrappers. A richer marketplace should introduce dedicated ZORA `ProductCard`, `ProductGrid`, and order/status patterns later.
