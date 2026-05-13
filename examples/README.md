# ZORA realistic example apps

The category folders in this directory contain real Expo Router applications grouped by existing app category.
They are product-shaped examples, not component catalogues.

The existing `examples/expo-showcase` app remains the component showcase. Use category folders to
prove that ZORA can build believable mobile and web apps without consumer-side styling hacks.

## Structure

```txt
examples/
  social_community/
    community-feed/
    photo-social/
    private-messaging/
    visual-discovery/
  shopping_commerce/
    marketplace/
    storefront/
  food_drink/
    restaurant/
    recipes/
  health_fitness/
    workout-tracker/
    habits/
  news_magazines/
    news-reader/
  developer_tools/
    saas-dashboard/
  expo-showcase/
```

## Implemented examples

- `social_community/community-feed`: Facebook-style community feed app.
- `social_community/photo-social`: Instagram-style visual social app.
- `social_community/private-messaging`: WhatsApp-style private messaging app.
- `social_community/visual-discovery`: Pinterest-style visual discovery app.
- `shopping_commerce/marketplace`: marketplace browse/search/sell/orders/profile app.
- `shopping_commerce/storefront`: small shop catalog/cart/orders/profile app.

## Scaffold a new app

From the ZORA repository root:

```bash
bun run scripts/scaffold-zora-example-app.ts social_community/community-feed "Community Feed"
```

The scaffold script creates a real Expo Router app under:

```txt
examples/<app-category>/<example-id>/
```

The generated example installs the published `@ankhorage/zora` package so it behaves like a real consumer app.

## Quality bar

Every realistic example app must:

- use real Expo Router route files
- use real `Tabs`, `Stack`, or other Expo Router layouts where appropriate
- support native and web preview
- use only public `@ankhorage/zora` UI exports
- avoid direct `@ankhorage/surface` imports
- avoid `StyleSheet`
- avoid local style workaround layers
- use realistic static data
- expose missing ZORA APIs as ZORA follow-up work instead of hiding gaps in the example

## Run an example

```bash
cd examples/social_community/community-feed
bun install
bunx expo start
```
