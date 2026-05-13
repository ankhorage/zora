# Storefront

Real Expo Router + React Native Web example app for ZORA.

This app proves a small shop `shopping_commerce` starter shape with homepage, catalog, cart, orders, and customer profile routes.

## Routes

- Home
- Products
- Cart
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

This app intentionally uses existing media cards and lists instead of local commerce wrappers. A richer storefront should introduce dedicated ZORA `ProductCard`, `ProductGrid`, `CartSummary`, and order/status patterns later.
