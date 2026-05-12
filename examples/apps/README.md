# ZORA realistic example apps

The apps in this folder are real Expo Router applications grouped by existing app category.
They are product-shaped examples, not component catalogues.

The existing `examples/expo-showcase` app remains the component showcase. Use this folder to
prove that ZORA can build believable mobile and web apps without consumer-side styling hacks.

## Structure

```txt
examples/
  apps/
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
```

## Scaffold a new app

From the ZORA repository root:

```bash
bun run scripts/scaffold-zora-example-app.ts social_community/community-feed "Community Feed"
```

The scaffold script creates a real Expo Router app under:

```txt
examples/apps/<app-category>/<example-id>/
```

By default the generated example depends on the local ZORA package with
`file:../../../../`. Use `--published` to create a consumer-style app that depends on the
published package instead:

```bash
bun run scripts/scaffold-zora-example-app.ts shopping_commerce/marketplace "Marketplace" --published
```

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
cd examples/apps/social_community/community-feed
bun install
bunx expo start
```
