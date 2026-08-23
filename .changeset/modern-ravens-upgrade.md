---
'@ankhorage/zora': major
---

Move ZORA to the React 19.2.3, React Native 0.86.2, React Native Web 0.21, and
Surface 3 platform. Icons now use Surface's discriminated scoped-RNVI contract,
including explicit FontAwesome5/6 variants, and Expo vector-icon/font peers are
removed.

Gradient rendering is now host-injected through `GradientRendererProvider`, so
the portable ZORA runtime no longer requires `expo-linear-gradient`. Expo apps
can adapt that package at their application boundary.
