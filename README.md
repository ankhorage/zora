# ZORA

**ZORA** = **ZerO-config React-native design system Architecture**

An opinionated UI kit for **React Native + Web**, built on top of `@ankhorage/surface`.

ZORA gives you ready-to-use, production-grade UI patterns with a consistent design language — without forcing a complex setup.

---

## What is ZORA?

ZORA is the **design system layer** on top of Surface.

- **Surface** → foundation (primitives, tokens, interactions)
- **ZORA** → UI kit (patterns, layouts, polished components)

Think:

- Surface = engine  
- ZORA = car

---

## Why the name "Zora"?

**Zora** is a Slavic name meaning **dawn**, **sunrise**, or **aurora**.

That fits the package well: Surface is the foundation, while ZORA is the layer where that foundation becomes visible, expressive, and product-ready.

---

## Why use it?

Surface gives you flexibility.  
ZORA gives you **speed and consistency**.

With ZORA you get:

- prebuilt UI patterns
- opinionated defaults
- consistent spacing, colors, and typography
- ready-to-use layouts
- production-ready components

---

## Quick example

```tsx
import { Page, PageHeader, FormField, Input, Button } from '@ankhorage/zora'

export function Login() {
  return (
    <Page>
      <PageHeader title="Sign in" />

      <FormField label="Email">
        <Input placeholder="you@example.com" />
      </FormField>

      <FormField label="Password">
        <Input secureTextEntry />
      </FormField>

      <Button tone="primary">Sign in</Button>
    </Page>
  )
}
```

---

## What you get

### Core components

- Button
- Input / Textarea
- Card
- Modal / Drawer
- Badge

### Patterns

- FormField
- Panel
- Notice
- EmptyState
- ConfirmDialog
- SettingsRow

### Layouts

- Page
- PageHeader
- PageSection
- SidebarLayout
- TopbarLayout
- SettingsLayout
- AuthLayout

---

## Philosophy

### 1. Opinionated by default

ZORA reduces decision fatigue with strong defaults.

### 2. Built on Surface

No duplicated logic — everything composes on `@ankhorage/surface`.

### 3. Cross-platform first

Works with:

- React Native
- Expo
- React Native Web

### 4. Composable

You can always drop down to Surface if needed.

---

## What ZORA is NOT

- ❌ Not a low-code system
- ❌ Not a backend framework
- ❌ Not a navigation/router solution
- ❌ Not tied to a specific product

---

## Relationship to Studio

ZORA is designed to be used by Studio as a **design-system preset**, not as a hard dependency.

Studio can:

- render Surface-based apps
- render ZORA-based apps
- switch between design systems

---

## Installation

```bash
bun add @ankhorage/zora @ankhorage/surface
```

---

## Expo example

There is a runnable Expo showcase app in [`examples/expo-showcase`](./examples/expo-showcase).

Because the example uses the local repo package via `file:../..`, build ZORA first so the package `dist/` exists, then install and start the Expo app:

```bash
bun install
bun run build

cd examples/expo-showcase
npm install
npm run start
```

Useful variants:

```bash
npm run ios
npm run android
npm run web
```

The showcase uses all current ZORA exports:

- core components
- patterns
- layouts
- `ZoraProvider` with `createZoraTheme(...)`

---

## Status

- v0.0.1 – Bootstrap phase

---

## License

MIT
