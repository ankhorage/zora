# Restaurant

Real Expo Router + React Native Web example app for ZORA.

This app proves a restaurant `food_drink` starter shape with home, menu, reservations, orders, and guest profile routes.

## Routes

- Home
- Menu
- Reservations
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

This app intentionally uses existing media cards, forms, and lists instead of local restaurant wrappers. A richer restaurant app should introduce dedicated ZORA `MenuItem`, `DietaryBadge`, `ReservationSummary`, and restaurant order/status patterns later.
