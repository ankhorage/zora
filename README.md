# ZORA

<!-- markdownlint-disable MD013 MD033 -->

Opinionated React Native and React Native Web UI kit built on
`@ankhorage/surface`.

ZORA sits above Surface. Surface provides the foundation primitives, theme system,
and low-level controls; ZORA adds product-facing components, app layouts, and
ready-made patterns with stronger defaults.

## Install

```bash
bun add @ankhorage/zora
```

Peer dependencies:

- `react >=18.2.0`
- `react-native >=0.72.0`
- `@expo/vector-icons >=14.0.0` when using icon specs
- `expo-font >=14.0.4` when using runtime font registration

## Quick Start

Wrap your app in `ZoraProvider`, then import components from
`@ankhorage/zora`.

```tsx
import React from 'react';
import {
  AppBar,
  AppShell,
  Button,
  Card,
  Heading,
  IconButton,
  Page,
  PageHeader,
  Text,
  ZoraProvider,
} from '@ankhorage/zora';

export function App() {
  return (
    <ZoraProvider>
      <AppShell
        header={
          <AppBar
            leading={<IconButton icon={{ name: 'menu-outline' }} label="Menu" onPress={() => {}} />}
            title="Dashboard"
          />
        }
      >
        <Page header={<PageHeader title="Dashboard" description="Ready to build." />}>
          <Card
            actions={<Button>Continue</Button>}
            description="ZORA provides composed UI surfaces for apps."
            title="Welcome"
          >
            <Heading level={3}>Next steps</Heading>
            <Text tone="muted">Structured text comes from ZORA too.</Text>
          </Card>
        </Page>
      </AppShell>
    </ZoraProvider>
  );
}
```

## Scoped themes

ZORA supports nested theme scopes. A component may set `mode` and, later,
`themeId`; everything inside inherits the nearest scope.

```tsx
import React from 'react';
import { Button, Heading, Panel, Text, ZoraProvider, type ZoraTheme } from '@ankhorage/zora';

export function App({ appTheme }: { appTheme: ZoraTheme }) {
  return (
    <ZoraProvider theme={appTheme} initialMode="light">
      <Panel mode="dark">
        <Heading>Studio panel</Heading>
        <Text>Text inherits dark mode.</Text>
        <Button>Also scoped.</Button>
      </Panel>
    </ZoraProvider>
  );
}
```

ZORA themes use a single seed `primaryColor`. The selected primary color is preserved
identically for both light and dark mode. Color generation is handled by
`@ankhorage/color-theory` via Surface.

```tsx
<ZoraProvider
  theme={{
    id: 'studio',
    name: 'Studio',
    appCategory: 'developer_tools',
    primaryColor: '#0f766e',
    harmony: 'analogous',
  }}
>
  <App />
</ZoraProvider>
```

`mode` and `themeId` are available on public ZORA components through `ZoraBaseProps`.
Use component props for local component/subtree overrides.

Use `ZoraThemeScope` when the scope is conceptual and does not belong to one specific component:

```tsx
import React from 'react';
import { SidebarLayout, Text, ZoraProvider, ZoraThemeScope, type ZoraTheme } from '@ankhorage/zora';

export function App({ appTheme }: { appTheme: ZoraTheme }) {
  return (
    <ZoraProvider theme={appTheme} initialMode="light">
      <ZoraThemeScope mode="dark">
        <SidebarLayout sidebar={<Text>Sidebar</Text>}>
          <Text>Everything inside uses dark mode.</Text>
        </SidebarLayout>
      </ZoraThemeScope>
    </ZoraProvider>
  );
}
```

`themeId` currently accepts the inherited theme id. Full theme registries arrive in a later phase.

## Foundation primitives

ZORA re-exports selected Surface foundation primitives for app-facing layout
code:

```tsx
import { Box, Container, Grid, Heading, Stack, Text } from '@ankhorage/zora';
```

Use ZORA `Text` and `Heading` for typography. Use `Box`, `Stack`, `Grid`, and
`Container` for layout. Surface remains the lower-level render foundation and
should not be required in normal app-facing UI code.

## Navigation chrome (Expo Router)

ZORA provides product-facing navigation chrome that can be plugged into real
Expo Router / React Navigation navigators. Expo Router owns navigation mechanics
(state, linking, gestures); ZORA only renders the tab bar and drawer content.

`routeMap` is the primary source for icons, badges, disabled state, and explicit
labels. Navigator descriptor options are used as a label/title fallback only.

### Tabs

```tsx
import { Tabs } from 'expo-router';
import { ZoraTabBar, type ZoraNavigationRouteMap } from '@ankhorage/zora';

const routeMap: ZoraNavigationRouteMap = {
  index: { label: 'Home', icon: { name: 'home-outline' } },
  settings: { label: 'Settings', icon: { name: 'settings-outline' }, badge: '3' },
};

export default function Layout() {
  return <Tabs tabBar={(props) => <ZoraTabBar {...props} routeMap={routeMap} />} />;
}
```

### Drawer

```tsx
import { Drawer } from 'expo-router/drawer';
import { ZoraDrawerContent, type ZoraNavigationRouteMap } from '@ankhorage/zora';

const routeMap: ZoraNavigationRouteMap = {
  home: { label: 'Home', icon: { name: 'home-outline' } },
  account: { label: 'Account', icon: { name: 'person-outline' }, disabled: true },
};

export default function Layout() {
  return <Drawer drawerContent={(props) => <ZoraDrawerContent {...props} routeMap={routeMap} />} />;
}
```

## Shared Types

These unions appear across the catalogue:

- `ZoraTone` comes from Surface `ButtonProps['tone']`.
- `ZoraEmphasis` comes from Surface `ButtonProps['variant']`.
- `ZoraBadgeEmphasis` comes from Surface `BadgeProps['variant']`.
- `ZoraControlSize` comes from Surface `ButtonProps['size']`.
- `ZoraCardTone = 'default' | 'subtle' | 'outline'`.
- `ZoraContentWidth = 'narrow' | 'default' | 'wide'`.

Width presets:

- Dialog widths: `narrow=420`, `default=520`, `wide=560`.
- Page widths: `narrow=760`, `default=1040`, `wide=1280`.

## Component metadata

ZORA exports component metadata for tooling consumers. Authoring tools (including Studio) consume this metadata; ZORA is the canonical source of rules for ZORA UI components.

Usage example:

```ts
import { ZORA_COMPONENT_META } from '@ankhorage/zora';

const parent = ZORA_COMPONENT_META.PageSection;
const childKey = 'Button';

if (!parent.allowedChildren.includes(childKey)) {
  throw new Error(`Cannot drop ${childKey} into ${parent.name}.`);
}
```

Metadata model overview:

- `category`: which ZORA UI layer owns the component (`foundation`, `component`, `layout`, `pattern`).
- `directManifestNode`: whether the component is represented directly as a manifest node in v1.
- `allowedChildren`: which direct manifest nodes are valid nested children (composition / drop validation).
- `props`: serializable prop schema for authoring property panels.
- `blueprint`: insertion label/icon and manifest-friendly default props.
- `i18n`: metadata describing which props are i18n keys vs default text props.

<details>
<summary>Foundation</summary>

- `Box`
- `Center`
- `Container`
- `Divider`
- `Grid`
- `Inline`
- `Show`
- `Spacer`
- `Stack`
- `Surface`

</details>

<details>
<summary>Components</summary>

- `AppBar`
- `Avatar`
- `AvatarGroup`
- `Badge`
- `Button`
- `Card`
- `Checkbox`
- `CheckboxGroup`
- `Chip`
- `ChipGroup`
- `Drawer`
- `Form`
- `FormActions`
- `FormError`
- `FormField`
- `Heading`
- `Icon`
- `IconButton`
- `Image`
- `Input`
- `MediaCard`
- `MetricCard`
- `Modal`
- `NavigationItem`
- `NavigationList`
- `Progress`
- `Radio`
- `RadioGroup`
- `Rating`
- `SearchBar`
- `Select`
- `Tabs`
- `Text`
- `Textarea`
- `Toolbar`
- `ToolbarAction`

</details>

<details>
<summary>Layouts</summary>

- `AppShell`
- `AuthLayout`
- `Page`
- `PageHeader`
- `PageSection`
- `SettingsLayout`
- `SidebarLayout`
- `TopbarLayout`

</details>

<details>
<summary>Patterns</summary>

- `CollectionEditor`
- `ConfirmDialog`
- `DisclosureSection`
- `EmptyState`
- `FilterBar`
- `ForgotPasswordForm`
- `Hero`
- `ImagePreview`
- `ImageUploadField`
- `InspectorField`
- `List`
- `ListRow`
- `ListSection`
- `Notice`
- `OtpForm`
- `PaletteItem`
- `Panel`
- `PostCard`
- `ResponsivePanel`
- `SectionHeader`
- `SelectableItem`
- `SelectionProvider`
- `SettingsRow`
- `SignInForm`
- `SignUpForm`
- `SwitchField`
- `ThemeComposer`
- `TileGrid`
- `Timeline`
- `TreeItem`
- `TreeView`
- `ZoraDrawerContent`
- `ZoraTabBar`

</details>

## Components

### `Heading`

Structured titles with semantic levels, visual sizes, semantic tones, and
responsive props. Use `Heading` for titles and `Text` for body copy.

```tsx
<Heading level={1} size={{ base: 'h2', md: 'h1' }}>
  Build faster with ZORA
</Heading>

<Heading level={2} tone="primary">
  Create consistent screens
</Heading>
```

`level` expresses document hierarchy. `size` controls visual scale and can be
responsive for mobile and web layouts.

<details>
<summary>Props</summary>

ZORA props:

| Prop            | Type                                     | Default     | Notes                                                           |
| --------------- | ---------------------------------------- | ----------- | --------------------------------------------------------------- |
| `children`      | `React.ReactNode`                        | -           | Primary content.                                                |
| `text`          | `string`                                 | -           | Manifest-friendly content prop.                                 |
| `i18nKey`       | `string`                                 | -           | Runtime-resolved fallback key when no content prop is provided. |
| `level`         | `HeadingLevel`                           | `2`         | Semantic heading level from `1` through `6`.                    |
| `size`          | `Responsive<HeadingSize>`                | level size  | Visual scale: `display`, `h1` through `h6`.                     |
| `tone`          | `Responsive<HeadingTone>`                | `'default'` | Semantic text color.                                            |
| `align`         | `Responsive<HeadingAlign>`               | -           | Text alignment.                                                 |
| `weight`        | `Responsive<HeadingWeight>`              | recipe      | Optional structured weight override.                            |
| `italic`        | `boolean`                                | `false`     | Italic style.                                                   |
| `numberOfLines` | `number`                                 | -           | Native/web truncation line count.                               |
| `ellipsizeMode` | `'head' \| 'middle' \| 'tail' \| 'clip'` | -           | Truncation behavior.                                            |
| `selectable`    | `boolean`                                | -           | Allows text selection where supported.                          |
| `testID`        | `string`                                 | -           | Test id.                                                        |

No inherited props. `HeadingProps` is declared directly by ZORA to keep heading
usage structured and template-safe.

</details>

### `Text`

Structured body text with ZORA typography variants, semantic tones, and
responsive props.

```tsx
<Text variant="lead" tone="muted">
  Build product screens with structured, theme-aware copy.
</Text>

<Text variant={{ base: 'bodySmall', md: 'body' }} align={{ base: 'center', md: 'left' }}>
  Responsive text without raw styles.
</Text>
```

<details>
<summary>Props</summary>

ZORA props:

| Prop            | Type                                     | Default     | Notes                                                           |
| --------------- | ---------------------------------------- | ----------- | --------------------------------------------------------------- |
| `children`      | `React.ReactNode`                        | -           | Primary content.                                                |
| `text`          | `string`                                 | -           | Manifest-friendly content prop.                                 |
| `i18nKey`       | `string`                                 | -           | Runtime-resolved fallback key when no content prop is provided. |
| `variant`       | `Responsive<TextVariant>`                | `'body'`    | Typography recipe.                                              |
| `tone`          | `Responsive<TextTone>`                   | `'default'` | Semantic text color.                                            |
| `align`         | `Responsive<TextAlign>`                  | -           | Text alignment.                                                 |
| `weight`        | `Responsive<TextWeight>`                 | recipe      | Optional structured weight override.                            |
| `italic`        | `boolean`                                | `false`     | Italic style.                                                   |
| `numberOfLines` | `number`                                 | -           | Native/web truncation line count.                               |
| `ellipsizeMode` | `'head' \| 'middle' \| 'tail' \| 'clip'` | -           | Truncation behavior.                                            |
| `selectable`    | `boolean`                                | -           | Allows text selection where supported.                          |
| `testID`        | `string`                                 | -           | Test id.                                                        |

No inherited props. `TextProps` is declared directly by ZORA to keep text
structured and template-safe.

</details>

### `Button`

Action button with ZORA defaults for tone, emphasis, size, and icons.

```tsx
<Button leadingIcon={{ name: 'checkmark-circle-outline' }}>Save</Button>
```

<details>
<summary>Props</summary>

ZORA props:

| Prop           | Type              | Default     | Notes                                      |
| -------------- | ----------------- | ----------- | ------------------------------------------ |
| `children`     | `React.ReactNode` | -           | Button label or content.                   |
| `tone`         | `ZoraTone`        | `'primary'` | Passed to Surface as `tone`.               |
| `emphasis`     | `ZoraEmphasis`    | `'solid'`   | Passed to Surface as `variant`.            |
| `size`         | `ZoraControlSize` | `'l'`       | Passed to Surface as `size`.               |
| `leadingIcon`  | `ButtonIconSpec`  | -           | Surface icon spec rendered before content. |
| `trailingIcon` | `ButtonIconSpec`  | -           | Surface icon spec rendered after content.  |

Inherited props:

Inherits all Surface `ButtonProps` except `children`, `size`, `tone`, and
`variant`. This includes Surface button behavior such as `loading`,
`fullWidth`, pressability props, disabled state, accessibility props allowed by
Surface, and `testID`.

</details>

### `IconButton`

Compact icon-only button for toolbars, rows, and actions.

```tsx
<IconButton icon={{ name: 'trash-outline' }} label="Delete" tone="danger" />
```

<details>
<summary>Props</summary>

ZORA props:

| Prop       | Type              | Default     | Notes                              |
| ---------- | ----------------- | ----------- | ---------------------------------- |
| `icon`     | `ButtonIconSpec`  | -           | Required icon to render.           |
| `label`    | `string`          | -           | Required for `accessibilityLabel`. |
| `tone`     | `ZoraTone`        | `'neutral'` | Button tone.                       |
| `emphasis` | `ZoraEmphasis`    | `'ghost'`   | Button emphasis.                   |
| `size`     | `ZoraControlSize` | `'m'`       | Button size.                       |

Inherited props:

Inherits behavior from Surface `IconButton` including `disabled`, `loading`,
`onPress`, and `testID`.

</details>

### `Avatar`

User/profile image with name-based initials and optional icon fallback.

```tsx
<Avatar name="Zora Kit" />
<Avatar size="l" tone="primary" name="Fabio Gartenmann" />
```

<details>
<summary>Props</summary>

ZORA props:

| Prop           | Type                  | Default     | Notes                                           |
| -------------- | --------------------- | ----------- | ----------------------------------------------- |
| `source`       | `ImageSourcePropType` | -           | React Native `Image` source for the avatar.     |
| `name`         | `string`              | -           | Used to derive initials when `initials` absent. |
| `initials`     | `string`              | -           | Explicit initials override.                     |
| `iconFallback` | `ButtonIconSpec`      | -           | Optional icon spec when no source/initials.     |
| `label`        | `string`              | -           | Accessibility label for the rendered content.   |
| `size`         | `AvatarSize`          | `'m'`       | `xs`..`xl` size preset.                         |
| `shape`        | `AvatarShape`         | `'circle'`  | `circle` or `rounded`.                          |
| `tone`         | `ZoraTone`            | `'neutral'` | Drives background and fallback content tone.    |
| `testID`       | `string`              | -           | Test id.                                        |

Inherited props:

No inherited props. `AvatarProps` is declared directly by ZORA.

</details>

### `AvatarGroup`

Overlapping avatar stack with optional overflow label.

```tsx
<AvatarGroup
  items={[
    { id: '1', name: 'Ada Lovelace' },
    { id: '2', name: 'Grace Hopper', tone: 'success' },
  ]}
/>
```

<details>
<summary>Props</summary>

ZORA props:

| Prop            | Type                        | Default    | Notes                                |
| --------------- | --------------------------- | ---------- | ------------------------------------ |
| `items`         | `AvatarGroupItem[]`         | -          | Avatar sources and fallback fields.  |
| `max`           | `number`                    | `4`        | Max visible avatars before overflow. |
| `size`          | `AvatarSize`                | `'s'`      | Avatar size preset.                  |
| `shape`         | `AvatarShape`               | `'circle'` | Avatar shape preset.                 |
| `overflowLabel` | `(overflowCount) => string` | `+N`       | Overflow label formatter.            |
| `testID`        | `string`                    | -          | Test id.                             |

`AvatarGroupItem`:

| Prop           | Type                  | Notes                           |
| -------------- | --------------------- | ------------------------------- |
| `id`           | `string`              | Optional stable key.            |
| `source`       | `ImageSourcePropType` | Image source for the avatar.    |
| `name`         | `string`              | Used to derive initials.        |
| `initials`     | `string`              | Explicit initials override.     |
| `iconFallback` | `ButtonIconSpec`      | Optional icon fallback.         |
| `label`        | `string`              | Accessibility label.            |
| `tone`         | `ZoraTone`            | Overrides avatar tone per item. |

Inherited props:

No inherited props. `AvatarGroupProps` is declared directly by ZORA.

</details>

### `Badge`

Small status label with ZORA tone, emphasis, and size defaults.

```tsx
<Badge tone="success">Active</Badge>
```

<details>
<summary>Props</summary>

ZORA props:

| Prop       | Type                | Default     | Notes                                |
| ---------- | ------------------- | ----------- | ------------------------------------ |
| `children` | `React.ReactNode`   | -           | Rendered as Surface badge `content`. |
| `tone`     | `ZoraTone`          | `'primary'` | Passed to Surface as `tone`.         |
| `emphasis` | `ZoraBadgeEmphasis` | `'soft'`    | Passed to Surface as `variant`.      |
| `size`     | `ZoraControlSize`   | `'m'`       | Passed to Surface as `size`.         |

Inherited props:

Inherits all Surface `BadgeProps` except `content`, `size`, `tone`, and
`variant`. The remaining inherited prop is `testID`.

</details>

### `Card`

Composed content surface with optional header, actions, footer, and ZORA card
tones.

```tsx
<Card actions={<Button>Open</Button>} description="A reusable product surface." title="Project" />
```

<details>
<summary>Props</summary>

ZORA props:

| Prop          | Type              | Default     | Notes                                                                                    |
| ------------- | ----------------- | ----------- | ---------------------------------------------------------------------------------------- |
| `children`    | `React.ReactNode` | -           | Main card body.                                                                          |
| `title`       | `React.ReactNode` | -           | Header title.                                                                            |
| `description` | `React.ReactNode` | -           | Header description.                                                                      |
| `eyebrow`     | `React.ReactNode` | -           | Small muted text above the title.                                                        |
| `actions`     | `React.ReactNode` | -           | Header action area.                                                                      |
| `footer`      | `React.ReactNode` | -           | Footer area below body content.                                                          |
| `tone`        | `ZoraCardTone`    | `'default'` | Maps to Surface variants: `default -> raised`, `subtle -> subtle`, `outline -> outline`. |
| `compact`     | `boolean`         | `false`     | Uses tighter padding and heading scale.                                                  |

Inherited props:

Inherits all Surface `CardProps` except `children`, `p`, `radius`, `variant`, and
`style`. ZORA owns spacing, radius, and variant selection for this wrapper.

</details>

### `MediaCard`

Media-first card surface for listings, content previews, and catalog items.

```tsx
<MediaCard
  imageSource={require('./cover.png')}
  imageLabel="Cover image"
  title="MediaCard"
  description="Composes an image slot, header content, badges, actions, and footer metadata."
  badges={<Badge tone="primary">Featured</Badge>}
  footer={<Rating value={4.5} />}
  onPress={() => undefined}
/>
```

<details>
<summary>Props</summary>

ZORA props:

| Prop               | Type                  | Default     | Notes                                                      |
| ------------------ | --------------------- | ----------- | ---------------------------------------------------------- |
| `imageSource`      | `ImageSourcePropType` | -           | Image source (mutually exclusive with `image`).            |
| `imageLabel`       | `string`              | -           | Accessibility label for `imageSource`.                     |
| `image`            | `React.ReactNode`     | -           | Custom image slot (mutually exclusive with `imageSource`). |
| `imageAspectRatio` | `number`              | `16 / 9`    | Aspect ratio used when rendering `imageSource`.            |
| `title`            | `React.ReactNode`     | -           | Required title.                                            |
| `description`      | `React.ReactNode`     | -           | Optional description under the title.                      |
| `eyebrow`          | `React.ReactNode`     | -           | Optional caption above the title.                          |
| `badges`           | `React.ReactNode`     | -           | Optional badge/tags region near the title.                 |
| `actions`          | `React.ReactNode`     | -           | Optional trailing action area; disables `onPress`.         |
| `footer`           | `React.ReactNode`     | -           | Optional footer content under the body.                    |
| `children`         | `React.ReactNode`     | -           | Optional body content.                                     |
| `tone`             | `ZoraCardTone`        | `'default'` | Passed to the underlying `Card`.                           |
| `compact`          | `boolean`             | `false`     | Uses tighter spacing.                                      |
| `onPress`          | `() => void`          | -           | Makes the card pressable when no `actions` are present.    |
| `testID`           | `string`              | -           | Forwarded to the underlying `Card`.                        |

Inherited props:

No inherited props. `MediaCardProps` is declared directly by ZORA.

</details>

### `Image`

ZORA wrapper around the Surface `Image` primitive. Use this for theme-scoped image rendering in React Native and React Native Web.

```tsx
<Image
  alt="Example cover"
  aspectRatio={16 / 9}
  fit="cover"
  radius="l"
  source="https://example.com/cover.png"
/>
```

<details>
<summary>Props</summary>

ZORA props:

| Prop     | Type     | Default | Notes    |
| -------- | -------- | ------- | -------- |
| `testID` | `string` | -       | Test id. |

Inherited props:

Inherits all Surface `ImageProps` except `mode` and `themeId`. `source` accepts Surface `SurfaceImageSource` (string URL/uri or a React Native image source).

</details>

### `MetricCard`

Compact metric surface for dashboards, stats, and summary cards.

```tsx
<MetricCard
  label="Monthly active users"
  value="14.2k"
  delta="+4.1%"
  deltaTone="success"
  description="Last 30 days"
/>
```

<details>
<summary>Props</summary>

ZORA props:

| Prop          | Type              | Default     | Notes                                                   |
| ------------- | ----------------- | ----------- | ------------------------------------------------------- |
| `label`       | `React.ReactNode` | -           | Required label above the value.                         |
| `value`       | `React.ReactNode` | -           | Required metric value.                                  |
| `description` | `React.ReactNode` | -           | Optional supporting copy.                               |
| `icon`        | `ButtonIconSpec`  | -           | Optional icon shown next to the label.                  |
| `delta`       | `React.ReactNode` | -           | Optional delta badge content.                           |
| `deltaTone`   | `ZoraTone`        | `'neutral'` | Tone used for the delta `Badge`.                        |
| `actions`     | `React.ReactNode` | -           | Optional trailing action area; disables `onPress`.      |
| `tone`        | `ZoraCardTone`    | `'default'` | Passed to the underlying `Card`.                        |
| `compact`     | `boolean`         | `false`     | Uses tighter spacing.                                   |
| `onPress`     | `() => void`      | -           | Makes the card pressable when no `actions` are present. |
| `testID`      | `string`          | -           | Forwarded to the underlying `Card`.                     |

Inherited props:

No inherited props. `MetricCardProps` is declared directly by ZORA.

</details>

### `Progress`

Linear progress bar with semantic tone.

```tsx
<Progress value={72} />
<Progress tone="success" value={38} />
```

<details>
<summary>Props</summary>

ZORA props:

| Prop     | Type              | Default     | Notes                         |
| -------- | ----------------- | ----------- | ----------------------------- |
| `value`  | `number`          | -           | Current progress value.       |
| `max`    | `number`          | `100`       | Maximum value for completion. |
| `tone`   | `ZoraTone`        | `'primary'` | Fill tone.                    |
| `size`   | `ZoraControlSize` | `'m'`       | Controls bar height.          |
| `testID` | `string`          | -           | Test id.                      |

Inherited props:

No inherited props. `ProgressProps` is declared directly by ZORA.

</details>

### `Rating`

Readonly rating display rendered as star icons.

```tsx
<Rating value={4.5} />
```

<details>
<summary>Props</summary>

ZORA props:

| Prop     | Type              | Default     | Notes                  |
| -------- | ----------------- | ----------- | ---------------------- |
| `value`  | `number`          | -           | Current rating value.  |
| `max`    | `number`          | `5`         | Maximum rating value.  |
| `tone`   | `ZoraTone`        | `'warning'` | Tone for filled icons. |
| `size`   | `ZoraControlSize` | `'m'`       | Icon sizing preset.    |
| `testID` | `string`          | -           | Test id.               |

Inherited props:

No inherited props. `RatingProps` is declared directly by ZORA.

</details>

### `Input`

Text input wrapper with ZORA sizing and optional Surface icon specs.

```tsx
<Input
  autoCapitalize="none"
  keyboardType="email-address"
  leadingIcon={{ name: 'mail-outline' }}
  placeholder="you@example.com"
/>
```

<details>
<summary>Props</summary>

ZORA props:

| Prop             | Type                  | Default | Notes                                                                          |
| ---------------- | --------------------- | ------- | ------------------------------------------------------------------------------ |
| `size`           | `ZoraControlSize`     | `'l'`   | Passed to Surface as `size`.                                                   |
| `leadingIcon`    | `ButtonIconSpec`      | -       | Rendered as Surface `leadingAccessory`.                                        |
| `trailingIcon`   | `ButtonIconSpec`      | -       | Rendered as Surface `trailingAccessory`.                                       |
| `trailingAction` | `InputTrailingAction` | -       | Renders an icon-only trailing action (mutually exclusive with `trailingIcon`). |

Inherited props:

Inherits all Surface `TextInputProps` except `leadingAccessory`, `size`, and
`trailingAccessory`. Surface `TextInputProps` also inherit React Native
`TextInputProps` except `defaultValue`, `editable`, `onChangeText`,
`placeholderTextColor`, `style`, `testID`, and `value`; Surface re-exposes
`value`, `defaultValue`, `onChangeText`, `placeholder`, `disabled`, `readOnly`,
`invalid`, `style`, and `testID`.

</details>

### `SearchBar`

Controlled search input with leading search icon and optional clear action.

```tsx
<SearchBar value={query} onValueChange={setQuery} onSubmit={(value) => console.log(value)} />
```

<details>
<summary>Props</summary>

ZORA props:

| Prop            | Type                      | Default    | Notes                                         |
| --------------- | ------------------------- | ---------- | --------------------------------------------- |
| `value`         | `string`                  | -          | Current search query.                         |
| `onValueChange` | `(value: string) => void` | -          | Called when the query changes.                |
| `placeholder`   | `string`                  | `'Search'` | Placeholder text.                             |
| `onSubmit`      | `(value: string) => void` | -          | Called on submit (`returnKeyType="search"`).  |
| `onClear`       | `() => void`              | -          | Called after clearing the query.              |
| `clearable`     | `boolean`                 | `true`     | Shows clear action when `value` is non-empty. |
| `size`          | `ZoraControlSize`         | `'l'`      | Passed to the underlying `Input`.             |
| `disabled`      | `boolean`                 | -          | Disables the underlying `Input`.              |
| `readOnly`      | `boolean`                 | -          | Makes the underlying `Input` read-only.       |
| `testID`        | `string`                  | -          | Test id.                                      |

Inherited props:

No inherited props. `SearchBarProps` is declared directly by ZORA.

</details>

### `RadioGroup`

Single-selection control built on top of Surface `Radio`, designed for use inside `FormField`.

```tsx
<FormField label="Navigator type">
  <RadioGroup
    value="tabs"
    onValueChange={(value) => console.log(value)}
    options={[
      { value: 'tabs', label: 'Tabs' },
      { value: 'drawer', label: 'Drawer' },
    ]}
  />
</FormField>
```

<details>
<summary>Props</summary>

ZORA props:

| Prop            | Type                         | Default      | Notes                          |
| --------------- | ---------------------------- | ------------ | ------------------------------ |
| `value`         | `string`                     | -            | Currently selected value.      |
| `onValueChange` | `(value: string) => void`    | -            | Called when selection changes. |
| `options`       | `RadioGroupOption[]`         | -            | List of selectable options.    |
| `orientation`   | `'horizontal' \| 'vertical'` | `'vertical'` | Layout direction.              |
| `gap`           | `'xs' \| 's' \| 'm' \| 'l'`  | `'s'`        | Spacing between items.         |

Option shape:

```ts
type RadioGroupOption = {
  value: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
};
```

Inherited props:

Passes `tone`, `size`, `invalid`, `readOnly`, `disabled`, and `testID`
to underlying Surface `Radio` components.

</details>

---

### `CheckboxGroup`

Multi-selection control built on top of Surface `Checkbox`, for selecting multiple values.

```tsx
<FormField label="Features">
  <CheckboxGroup
    value={['a']}
    onValueChange={(value) => console.log(value)}
    options={[
      { value: 'a', label: 'Feature A' },
      { value: 'b', label: 'Feature B' },
    ]}
  />
</FormField>
```

<details>
<summary>Props</summary>

ZORA props:

| Prop            | Type                         | Default      | Notes                          |
| --------------- | ---------------------------- | ------------ | ------------------------------ |
| `value`         | `string[]`                   | -            | Array of selected values.      |
| `onValueChange` | `(value: string[]) => void`  | -            | Called when selection changes. |
| `options`       | `CheckboxGroupOption[]`      | -            | List of selectable options.    |
| `orientation`   | `'horizontal' \| 'vertical'` | `'vertical'` | Layout direction.              |
| `gap`           | `'xs' \| 's' \| 'm' \| 'l'`  | `'s'`        | Spacing between items.         |

Option shape:

```ts
type CheckboxGroupOption = {
  value: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
};
```

Inherited props:

Passes `tone`, `size`, `invalid`, `readOnly`, `disabled`, and `testID`
to underlying Surface `Checkbox` components.

</details>

### `Chip`

Compact filter/action token with optional icon and selected state.

```tsx
<Chip selected tone="primary" onPress={() => undefined}>
  Selected
</Chip>
```

<details>
<summary>Props</summary>

ZORA props:

| Prop       | Type              | Default     | Notes                                |
| ---------- | ----------------- | ----------- | ------------------------------------ |
| `children` | `React.ReactNode` | -           | Chip label content.                  |
| `icon`     | `ButtonIconSpec`  | -           | Optional leading icon spec.          |
| `selected` | `boolean`         | `false`     | Selected styling state.              |
| `tone`     | `ZoraTone`        | `'neutral'` | Selected tone.                       |
| `size`     | `ZoraControlSize` | `'s'`       | Padding and icon sizing.             |
| `disabled` | `boolean`         | `false`     | Disables interaction and mutes tone. |
| `onPress`  | `() => void`      | -           | Optional press handler.              |
| `testID`   | `string`          | -           | Test id.                             |

Inherited props:

No inherited props. `ChipProps` is declared directly by ZORA.

</details>

### `ChipGroup`

Controlled single- or multi-select chip set for filters and facets.

```tsx
<ChipGroup
  value="all"
  onValueChange={setValue}
  items={[
    { value: 'all', label: 'All' },
    { value: 'favorites', label: 'Favorites' },
  ]}
/>
```

<details>
<summary>Props</summary>

ZORA props:

| Prop            | Type                 | Default     | Notes                          |
| --------------- | -------------------- | ----------- | ------------------------------ |
| `items`         | `ChipGroupItem[]`    | -           | Rendered chips.                |
| `value`         | `string \| string[]` | -           | Selected value(s).             |
| `onValueChange` | `(value) => void`    | -           | Selection change handler.      |
| `multiple`      | `boolean`            | `false`     | Enables multi-select mode.     |
| `tone`          | `ZoraTone`           | `'neutral'` | Tone for selected chips.       |
| `size`          | `ZoraControlSize`    | `'s'`       | Chip size.                     |
| `wrap`          | `boolean`            | `true`      | Wrap chips on smaller screens. |
| `disabled`      | `boolean`            | -           | Disables all chips.            |
| `testID`        | `string`             | -           | Test id.                       |

Inherited props:

No inherited props. `ChipGroupProps` is declared directly by ZORA.

</details>

### `Textarea`

Multiline text input wrapper with ZORA sizing and optional Surface icon specs.

```tsx
<Textarea leadingIcon={{ name: 'document-text-outline' }} rows={5} />
```

<details>
<summary>Props</summary>

ZORA props:

| Prop           | Type              | Default | Notes                                    |
| -------------- | ----------------- | ------- | ---------------------------------------- |
| `size`         | `ZoraControlSize` | `'l'`   | Passed to Surface as `size`.             |
| `leadingIcon`  | `ButtonIconSpec`  | -       | Rendered as Surface `leadingAccessory`.  |
| `trailingIcon` | `ButtonIconSpec`  | -       | Rendered as Surface `trailingAccessory`. |

Inherited props:

Inherits all Surface `TextareaProps` except `leadingAccessory`, `size`, and
`trailingAccessory`. Surface `TextareaProps` extend Surface `TextInputProps`
except `multiline`, so React Native text input props are available through
Surface with the same Surface exclusions and re-exposed values listed for
`Input`.

</details>

### `Tabs`

Generic controlled tabs for navigation and filtering.

```tsx
<Tabs
  items={[
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
  ]}
  onValueChange={setValue}
  value={value}
/>
```

<details>
<summary>Props</summary>

ZORA props:

| Prop            | Type                                   | Default       | Notes                 |
| --------------- | -------------------------------------- | ------------- | --------------------- |
| `value`         | `string`                               | -             | Active tab value.     |
| `items`         | `TabItem[]`                            | -             | Array of tab objects. |
| `onValueChange` | `(value: string) => void`              | -             | Change handler.       |
| `variant`       | `'underline' \| 'pill' \| 'segmented'` | `'underline'` | Visual style.         |
| `size`          | `ZoraControlSize`                      | `'m'`         | Control size.         |

</details>

### `AppBar`

Product-facing top app bar backed by the Surface `AppBar` primitive.

Use it for screen-level chrome (title/subtitle + leading/trailing actions).
The optional overflow entrypoint is trigger-only: consumers decide whether to
open a menu, sheet, modal, or something else.

```tsx
<AppBar
  title="Inbox"
  subtitle="All conversations"
  leading={<IconButton icon={{ name: 'menu-outline' }} label="Open menu" onPress={openMenu} />}
  actions={<IconButton icon={{ name: 'search-outline' }} label="Search" onPress={openSearch} />}
  overflow={{ onPress: openOverflow, label: 'More actions' }}
/>
```

Selection mode is generic and prop-driven:

```tsx
<AppBar
  appMode={{ type: 'selection', label: 'Selected', count: 3, onCancel: exitSelection }}
  actions={
    <IconButton icon={{ name: 'trash-outline' }} label="Delete" tone="danger" onPress={del} />
  }
/>
```

<details>
<summary>Props</summary>

ZORA props:

| Prop          | Type                   | Default | Notes                                                             |
| ------------- | ---------------------- | ------- | ----------------------------------------------------------------- |
| `title`       | `React.ReactNode`      | -       | Primary title content.                                            |
| `subtitle`    | `React.ReactNode`      | -       | Optional secondary line.                                          |
| `leading`     | `React.ReactNode`      | -       | Optional leading content (e.g. back/menu button).                 |
| `actions`     | `React.ReactNode`      | -       | Optional trailing actions content.                                |
| `overflow`    | `AppBarOverflowAction` | -       | Optional overflow trigger entrypoint (no built-in menu behavior). |
| `appMode`     | `AppBarMode`           | -       | Default or selection-mode rendering.                              |
| `safeAreaTop` | `boolean`              | `true`  | Adds top safe-area padding when `SafeAreaProvider` is present.    |
| `divider`     | `boolean`              | `true`  | Whether to render a divider under the bar.                        |

Inherited props:

None. ZORA composes Surface internally and exposes a product API.

</details>

### `Toolbar`

Horizontal shell for actions and tools.

```tsx
<Toolbar>
  <ToolbarAction icon={{ name: 'add-outline' }} label="Add" />
  <ToolbarAction icon={{ name: 'search-outline' }} label="Search" />
</Toolbar>
```

<details>
<summary>Props</summary>

`Toolbar` props:

| Prop       | Type                            | Default    | Notes                                     |
| ---------- | ------------------------------- | ---------- | ----------------------------------------- |
| `children` | `React.ReactNode`               | -          | Toolbar content.                          |
| `position` | `'top' \| 'bottom' \| 'inline'` | `'inline'` | Layout position.                          |
| `floating` | `boolean`                       | `false`    | Whether the toolbar floats with a shadow. |
| `compact`  | `boolean`                       | `true`     | Tighter padding.                          |

`ToolbarAction` props:

| Prop      | Type             | Default | Notes                |
| --------- | ---------------- | ------- | -------------------- |
| `icon`    | `ButtonIconSpec` | -       | Required icon.       |
| `label`   | `string`         | -       | Accessibility label. |
| `active`  | `boolean`        | `false` | Highlighted state.   |
| `onPress` | `() => void`     | -       | Click handler.       |

</details>

### `Select`

Standard dropdown selector wrapping `@react-native-picker/picker`.

```tsx
<Select
  onValueChange={setValue}
  options={[
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
  ]}
  value={value}
/>
```

<details>
<summary>Props</summary>

ZORA props:

| Prop            | Type                      | Default | Notes                    |
| --------------- | ------------------------- | ------- | ------------------------ |
| `value`         | `string`                  | -       | Selected value.          |
| `options`       | `SelectOption[]`          | -       | Array of option objects. |
| `onValueChange` | `(value: string) => void` | -       | Change handler.          |
| `invalid`       | `boolean`                 | `false` | Error state styling.     |
| `disabled`      | `boolean`                 | `false` | Interaction state.       |

</details>

### `Modal`

Centered overlay shell with optional header, body, footer, and width preset.

```tsx
<Modal footer={<Button>Done</Button>} onDismiss={close} title="Details" visible={visible} />
```

<details>
<summary>Props</summary>

ZORA props:

| Prop          | Type               | Default     | Notes                                      |
| ------------- | ------------------ | ----------- | ------------------------------------------ |
| `children`    | `React.ReactNode`  | -           | Modal body.                                |
| `title`       | `React.ReactNode`  | -           | Header title.                              |
| `description` | `React.ReactNode`  | -           | Header description.                        |
| `footer`      | `React.ReactNode`  | -           | Footer area.                               |
| `width`       | `ZoraContentWidth` | `'default'` | Resolves to `420`, `520`, or `560` pixels. |

Inherited props:

Picks these Surface `ModalProps`: `closeOnBackdrop`, `onDismiss`, `testID`, and
`visible`.

</details>

### `Drawer`

Side overlay shell with optional header, body, and footer.

```tsx
<Drawer onDismiss={close} title="Filters" visible={visible}>
  {content}
</Drawer>
```

<details>
<summary>Props</summary>

ZORA props:

| Prop          | Type              | Default | Notes               |
| ------------- | ----------------- | ------- | ------------------- |
| `children`    | `React.ReactNode` | -       | Drawer body.        |
| `title`       | `React.ReactNode` | -       | Header title.       |
| `description` | `React.ReactNode` | -       | Header description. |
| `footer`      | `React.ReactNode` | -       | Footer area.        |

Inherited props:

Picks these Surface `DrawerProps`: `closeOnBackdrop`, `onDismiss`, `position`,
`testID`, and `visible`.

</details>

## Layouts

### `AppShell`

Theme-aware application root shell providing the structural frame for an app.
It defines the top-level layout slots (`header`, `body`, `footer`, `overlay`)
and ensures a full-height, flexible container.

Use it as the outer layout inside `ZoraProvider`. Combine it with layout
primitives like `SidebarLayout` or `Page` to structure inner content.

```tsx
<AppShell header={<Toolbar position="inline">{actions}</Toolbar>} footer={<BottomBar />}>
  <Page header={<PageHeader title="Dashboard" />}>{content}</Page>
</AppShell>
```

Example with overlay (e.g. mobile panel or drawer):

```tsx
<AppShell footer={<BottomBar />} overlay={isOpen ? <MyDrawer onClose={close} /> : null}>
  {content}
</AppShell>
```

<details>
<summary>Props</summary>

ZORA props:

| Prop        | Type                   | Default | Notes                                                                                |
| ----------- | ---------------------- | ------- | ------------------------------------------------------------------------------------ |
| `children`  | `React.ReactNode`      | -       | Main application content.                                                            |
| `header`    | `React.ReactNode`      | -       | Optional top section (e.g. toolbar or navigation).                                   |
| `footer`    | `React.ReactNode`      | -       | Optional bottom section (e.g. tab bar or actions).                                   |
| `overlay`   | `React.ReactNode`      | -       | Optional overlay layer rendered above content (e.g. drawer, modal, floating panels). |
| `style`     | `StyleProp<ViewStyle>` | -       | Style applied to the root container.                                                 |
| `bodyStyle` | `StyleProp<ViewStyle>` | -       | Style applied to the main content container.                                         |
| `testID`    | `string`               | -       | Forwarded to the root Surface container.                                             |

Inherited props:

No inherited props. `AppShellProps` is declared directly by ZORA.

</details>

---

### Design notes

- `AppShell` is a **structural primitive**, not a page layout.

- It does **not manage sidebars or content splits** — use `SidebarLayout` for that.

- It does **not provide theming** — wrap with `ZoraProvider`.

- `overlay` is rendered using absolute positioning and should be used for
  drawers, mobile panels, or floating UI.

- All inner content must support flexible layouts (`flex: 1`, `minHeight: 0`)
  to behave correctly inside the shell.

### `Page`

Constrained page container with optional header and footer slots.

```tsx
<Page header={<PageHeader title="Projects" />} width="wide">
  {content}
</Page>
```

<details>
<summary>Props</summary>

ZORA props:

| Prop       | Type               | Default     | Notes                                        |
| ---------- | ------------------ | ----------- | -------------------------------------------- |
| `children` | `React.ReactNode`  | -           | Page body.                                   |
| `header`   | `React.ReactNode`  | -           | Rendered above body content.                 |
| `footer`   | `React.ReactNode`  | -           | Rendered below body content.                 |
| `width`    | `ZoraContentWidth` | `'default'` | Resolves to `760`, `1040`, or `1280` pixels. |
| `testID`   | `string`           | -           | Forwarded to the root Surface container.     |

Inherited props:

No inherited props. `PageProps` is declared directly by ZORA.

</details>

### `PageHeader`

Top-level page heading with optional eyebrow, metadata, and actions.

```tsx
<PageHeader actions={<Button>New</Button>} title="Projects" />
```

<details>
<summary>Props</summary>

ZORA props:

| Prop          | Type              | Default | Notes                                |
| ------------- | ----------------- | ------- | ------------------------------------ |
| `title`       | `React.ReactNode` | -       | Required page title.                 |
| `description` | `React.ReactNode` | -       | Supporting copy below title.         |
| `eyebrow`     | `React.ReactNode` | -       | Small muted text above title.        |
| `actions`     | `React.ReactNode` | -       | Action area opposite the heading.    |
| `meta`        | `React.ReactNode` | -       | Extra content below description.     |
| `testID`      | `string`          | -       | Forwarded to the root Surface stack. |

Inherited props:

No inherited props. `PageHeaderProps` is declared directly by ZORA.

</details>

### `PageSection`

Section wrapper that optionally renders a `SectionHeader`.

```tsx
<PageSection actions={<Button>Refresh</Button>} title="Recent activity">
  {content}
</PageSection>
```

<details>
<summary>Props</summary>

ZORA props:

| Prop          | Type              | Default | Notes                                              |
| ------------- | ----------------- | ------- | -------------------------------------------------- |
| `title`       | `React.ReactNode` | -       | Section title; when absent, no header is rendered. |
| `description` | `React.ReactNode` | -       | Passed to the section header.                      |
| `actions`     | `React.ReactNode` | -       | Passed to the section header.                      |
| `children`    | `React.ReactNode` | -       | Section body.                                      |
| `testID`      | `string`          | -       | Forwarded to the root Surface stack.               |

Inherited props:

No inherited props. `PageSectionProps` is declared directly by ZORA.

</details>

### `SidebarLayout`

Responsive shell with required sidebar, main content, and optional aside.

```tsx
<SidebarLayout sidebar={navigation} aside={details}>
  {content}
</SidebarLayout>
```

<details>
<summary>Props</summary>

ZORA props:

| Prop           | Type              | Default | Notes                                |
| -------------- | ----------------- | ------- | ------------------------------------ |
| `sidebar`      | `React.ReactNode` | -       | Required left column content.        |
| `children`     | `React.ReactNode` | -       | Main content.                        |
| `aside`        | `React.ReactNode` | -       | Optional right column content.       |
| `sidebarWidth` | `number`          | `280`   | Desktop sidebar width.               |
| `asideWidth`   | `number`          | `280`   | Desktop aside width.                 |
| `testID`       | `string`          | -       | Forwarded to the root Surface stack. |

Inherited props:

No inherited props. `SidebarLayoutProps` is declared directly by ZORA.

</details>

### `TopbarLayout`

Top navigation shell with optional sidebar composition.

```tsx
<TopbarLayout topbar={topbar} sidebar={sidebar}>
  {content}
</TopbarLayout>
```

<details>
<summary>Props</summary>

ZORA props:

| Prop       | Type              | Default | Notes                                                                        |
| ---------- | ----------------- | ------- | ---------------------------------------------------------------------------- |
| `topbar`   | `React.ReactNode` | -       | Required topbar content.                                                     |
| `children` | `React.ReactNode` | -       | Main content.                                                                |
| `sidebar`  | `React.ReactNode` | -       | Optional sidebar; when present, content is rendered through `SidebarLayout`. |
| `testID`   | `string`          | -       | Forwarded to the root Surface stack.                                         |

Inherited props:

No inherited props. `TopbarLayoutProps` is declared directly by ZORA.

</details>

### `SettingsLayout`

Reusable settings shell with page header, sidebar, and content region.

```tsx
<SettingsLayout actions={<Button>Save</Button>} sidebar={nav} title="Settings">
  {content}
</SettingsLayout>
```

<details>
<summary>Props</summary>

ZORA props:

| Prop          | Type              | Default | Notes                                                         |
| ------------- | ----------------- | ------- | ------------------------------------------------------------- |
| `title`       | `React.ReactNode` | -       | Optional page title; when absent, no page header is rendered. |
| `description` | `React.ReactNode` | -       | Header description.                                           |
| `sidebar`     | `React.ReactNode` | -       | Required settings navigation or context sidebar.              |
| `children`    | `React.ReactNode` | -       | Settings content.                                             |
| `actions`     | `React.ReactNode` | -       | Header action area.                                           |
| `testID`      | `string`          | -       | Forwarded to `Page`.                                          |

Inherited props:

No inherited props. `SettingsLayoutProps` is declared directly by ZORA.

</details>

### `AuthLayout`

Centered authentication-style shell for sign-in, onboarding, and recovery
screens.

```tsx
<AuthLayout description="Sign in to continue" title="Welcome back">
  {form}
</AuthLayout>
```

<details>
<summary>Props</summary>

ZORA props:

| Prop          | Type              | Default | Notes                                 |
| ------------- | ----------------- | ------- | ------------------------------------- |
| `title`       | `React.ReactNode` | -       | Card title.                           |
| `description` | `React.ReactNode` | -       | Card description.                     |
| `eyebrow`     | `React.ReactNode` | -       | Card eyebrow.                         |
| `children`    | `React.ReactNode` | -       | Form or auth content.                 |
| `footer`      | `React.ReactNode` | -       | Card footer.                          |
| `testID`      | `string`          | -       | Forwarded to the root Surface center. |

Inherited props:

No inherited props. `AuthLayoutProps` is declared directly by ZORA.

</details>

## Patterns

### `FormField`

Form field wrapper with rich label composition, description, helper text, and
Surface field state.

```tsx
<FormField helperText="We only use this for sign-in." label="Email">
  <Input keyboardType="email-address" />
</FormField>
```

<details>
<summary>Props</summary>

ZORA props:

| Prop          | Type              | Default | Notes                                      |
| ------------- | ----------------- | ------- | ------------------------------------------ |
| `label`       | `React.ReactNode` | -       | Required field label.                      |
| `description` | `React.ReactNode` | -       | Rendered under the label.                  |
| `helperText`  | `React.ReactNode` | -       | Passed to Surface `Field` as `helperText`. |

Inherited props:

Picks these Surface `FieldProps`: `children`, `disabled`, `errorText`,
`invalid`, `readOnly`, `required`, and `testID`.

</details>

### `Hero`

Landing-page and section hero pattern with structured title copy, actions,
optional media, and responsive layout behavior.

```tsx
<Hero
  eyebrow="New release"
  title="Build product screens faster"
  description="Use a responsive hero pattern with strong defaults for landing pages, dashboards, and app sections."
  primaryAction={{ label: 'Get started', onPress: () => undefined }}
  secondaryAction={{ label: 'View docs', onPress: () => undefined }}
/>
```

With media:

```tsx
<Hero
  eyebrow="ZORA Pattern"
  title="Compose responsive product introductions"
  description="Hero combines ZORA typography, actions, layout, and card surfaces into one app-facing pattern."
  layout="split"
  primaryAction={{ label: 'Start building', onPress: () => undefined }}
  secondaryAction={{ label: 'Browse patterns', onPress: () => undefined }}
  media={
    <Card title="Theme-aware by default" tone="outline">
      <Text tone="muted">
        Use the media slot for previews, screenshots, metrics, or illustration cards.
      </Text>
    </Card>
  }
/>
```

<details>
<summary>Props</summary>

ZORA props:

| Prop              | Type              | Default    | Notes                                                     |
| ----------------- | ----------------- | ---------- | --------------------------------------------------------- |
| `title`           | `React.ReactNode` | -          | Required main hero title.                                 |
| `description`     | `React.ReactNode` | -          | Supporting copy below the title.                          |
| `eyebrow`         | `React.ReactNode` | -          | Small label above the title.                              |
| `primaryAction`   | `HeroAction`      | -          | Primary CTA rendered as a ZORA `Button`.                  |
| `secondaryAction` | `HeroAction`      | -          | Secondary CTA rendered as a softer ZORA `Button`.         |
| `media`           | `React.ReactNode` | -          | Optional media slot rendered beside or above the content. |
| `footer`          | `React.ReactNode` | -          | Optional supporting footer content below the actions.     |
| `align`           | `HeroAlign`       | `'start'`  | Content alignment: `'start'` or `'center'`.               |
| `layout`          | `HeroLayout`      | `'split'`  | Layout strategy: `'stack'`, `'split'`, or `'mediaFirst'`. |
| `tone`            | `HeroTone`        | `'subtle'` | Card tone: `'default'`, `'subtle'`, or `'outline'`.       |
| `compact`         | `boolean`         | `false`    | Uses tighter spacing and a smaller desktop title size.    |
| `testID`          | `string`          | -          | Test id forwarded to the underlying card surface.         |

`HeroAction`:

| Prop       | Type              | Default                   | Notes                              |
| ---------- | ----------------- | ------------------------- | ---------------------------------- |
| `label`    | `React.ReactNode` | -                         | Button label/content.              |
| `onPress`  | `() => void`      | -                         | Press handler.                     |
| `tone`     | `ZoraTone`        | primary / neutral by role | Optional button tone override.     |
| `emphasis` | `ZoraEmphasis`    | solid / soft by role      | Optional button emphasis override. |
| `disabled` | `boolean`         | `false`                   | Disables the rendered action.      |

Inherited props:

No inherited props. `HeroProps` is declared directly by ZORA to keep the
pattern structured, theme-aware, and template-safe.

</details>

### `ImagePreview`

Provider-neutral image preview surface that renders `ZoraImageAsset` values.

- `kind: 'url'` renders directly from `url`.
- `kind: 'storage'` renders only when `publicUrl` is provided (ZORA never resolves storage URLs).

```tsx
<ImagePreview asset={{ kind: 'url', url: 'https://example.com/photo.jpg', alt: 'Photo' }} />
```

<details>
<summary>Props</summary>

ZORA props:

| Prop               | Type                     | Default   | Notes                                   |
| ------------------ | ------------------------ | --------- | --------------------------------------- |
| `asset`            | `ZoraImageAsset \| null` | -         | Rendered asset reference.               |
| `aspectRatio`      | `number`                 | `1`       | Aspect ratio for the preview container. |
| `fit`              | `ImageFit`               | `'cover'` | Surface resize mode.                    |
| `emptyTitle`       | `React.ReactNode`        | -         | Empty state title.                      |
| `emptyDescription` | `React.ReactNode`        | -         | Empty state description.                |
| `testID`           | `string`                 | -         | Test id.                                |

Inherited props:

No inherited props. `ImagePreviewProps` is declared directly by ZORA.

</details>

### `ImageUploadField`

Field UX for selecting, previewing, uploading, replacing, and removing images. All picking/upload/removal behavior is injected via callbacks.

```tsx
const [asset, setAsset] = React.useState<ZoraImageAsset | null>(null);

<ImageUploadField
  label="Project image"
  accept="image/*"
  maxSizeBytes={5_000_000}
  value={asset}
  onChange={setAsset}
  onPick={pickImage}
  onUpload={uploadImage}
/>;
```

Upload progress is transient UI state reported through `onUpload(picked, { setProgress })`.

<details>
<summary>Props</summary>

ZORA props:

| Prop           | Type                                     | Default | Notes                                            |
| -------------- | ---------------------------------------- | ------- | ------------------------------------------------ |
| `value`        | `ZoraImageAsset \| null`                 | -       | Controlled asset value.                          |
| `onChange`     | `(next: ZoraImageAsset \| null) => void` | -       | Controlled value updater.                        |
| `label`        | `React.ReactNode`                        | -       | Field label (required).                          |
| `description`  | `React.ReactNode`                        | -       | Description under the label.                     |
| `helperText`   | `React.ReactNode`                        | -       | Helper text under the field.                     |
| `errorText`    | `React.ReactNode`                        | -       | External error; overrides internal errors.       |
| `disabled`     | `boolean`                                | `false` | Disables replace/remove (preview stays).         |
| `readOnly`     | `boolean`                                | `false` | Disables replace/remove (preview stays).         |
| `accept`       | `string`                                 | -       | Accepted media hint + best-effort validation.    |
| `maxSizeBytes` | `number`                                 | -       | Best-effort size validation.                     |
| `onPick`       | `() => Promise<ZoraPickedImage \| null>` | -       | Picker callback (required).                      |
| `onUpload`     | Upload callback                          | -       | Optional upload; if omitted, pick becomes value. |
| `onRemove`     | Remove callback                          | -       | Optional removal hook before clearing.           |

Inherited props:

No inherited props. `ImageUploadFieldProps` is declared directly by ZORA.

</details>

### `Notice`

Semantic notice surface with badge eyebrow, optional body, and actions.

```tsx
<Notice actions={<Button>Review</Button>} title="Publish pipeline ready" tone="success" />
```

<details>
<summary>Props</summary>

ZORA props:

| Prop          | Type              | Default     | Notes                               |
| ------------- | ----------------- | ----------- | ----------------------------------- |
| `title`       | `React.ReactNode` | -           | Required notice title.              |
| `description` | `React.ReactNode` | -           | Notice description.                 |
| `children`    | `React.ReactNode` | -           | Optional body content.              |
| `actions`     | `React.ReactNode` | -           | Optional action area.               |
| `tone`        | `ZoraTone`        | `'primary'` | Drives the badge eyebrow tone.      |
| `testID`      | `string`          | -           | Forwarded to the underlying `Card`. |

Inherited props:

No inherited props. `NoticeProps` is declared directly by ZORA.

</details>

### `Panel`

Named composition surface that currently forwards to `Card`.

```tsx
<Panel description="Release details" title="Release Candidate">
  {content}
</Panel>
```

<details>
<summary>Props</summary>

ZORA props:

| Prop          | Type              | Default     | Notes                             |
| ------------- | ----------------- | ----------- | --------------------------------- |
| `title`       | `React.ReactNode` | -           | Header title.                     |
| `description` | `React.ReactNode` | -           | Header description.               |
| `eyebrow`     | `React.ReactNode` | -           | Small muted text above the title. |
| `actions`     | `React.ReactNode` | -           | Header action area.               |
| `footer`      | `React.ReactNode` | -           | Footer area below body content.   |
| `children`    | `React.ReactNode` | -           | Panel body.                       |
| `tone`        | `ZoraCardTone`    | `'default'` | Same tone behavior as `Card`.     |
| `compact`     | `boolean`         | `false`     | Same compact behavior as `Card`.  |
| `testID`      | `string`          | -           | Forwarded through `Card`.         |

Inherited props:

No inherited props. `PanelProps` is declared directly by ZORA.

</details>

### `PostCard`

Reusable social/content post surface with author identity, optional media,
interaction actions, and lightweight comment previews.

`PostCard` owns the anatomy of one post. It does not own feed rendering,
virtualization, pagination, pull-to-refresh, search/filter state, data fetching,
or realtime behavior. Compose multiple posts with `Stack` for short/static
groups, or use an app-owned `FlatList` for long dynamic feeds.

```tsx
import { IconButton, PostCard, Stack } from '@ankhorage/zora';

export function PostsPreview() {
  return (
    <Stack gap="m">
      <PostCard
        author={{
          name: 'Ada Lovelace',
          subtitle: '@ada · 2h',
          avatar: { name: 'Ada Lovelace', tone: 'primary' },
        }}
        headerAction={
          <IconButton icon={{ name: 'ellipsis-horizontal-outline' }} label="More post options" />
        }
        text="Working on a reusable social pattern for ZORA."
        actions={[
          { id: 'like', label: 'Like', icon: { name: 'heart-outline' }, count: 24 },
          {
            id: 'comment',
            label: 'Comment',
            icon: { name: 'chatbubble-outline' },
            count: 5,
          },
          { id: 'share', label: 'Share', icon: { name: 'share-outline' } },
        ]}
        comments={[
          {
            id: 'comment-1',
            author: {
              name: 'Grace Hopper',
              subtitle: '1h',
              avatar: { name: 'Grace Hopper', tone: 'success' },
            },
            text: 'The card/list boundary feels right.',
          },
        ]}
      />

      <PostCard
        compact
        tone="subtle"
        author={{
          name: 'Build system',
          subtitle: 'Today · release notes',
          avatar: { initials: 'CI', label: 'Build system', tone: 'neutral' },
        }}
        text="Compact density works well for notification-style posts."
      />
    </Stack>
  );
}
```

<details>
<summary>Props</summary>

ZORA props:

| Prop           | Type                               | Default     | Notes                                                              |
| -------------- | ---------------------------------- | ----------- | ------------------------------------------------------------------ |
| `author`       | `PostAuthor`                       | -           | Required author identity with name, optional subtitle, and avatar. |
| `text`         | `React.ReactNode`                  | -           | Main post copy.                                                    |
| `children`     | `React.ReactNode`                  | -           | Optional custom body content rendered after `text`.                |
| `media`        | `PostCardMedia \| PostCardMedia[]` | -           | Optional source-backed media or custom media slot.                 |
| `actions`      | `PostAction[]`                     | `[]`        | Optional interaction row actions such as like/comment/share.       |
| `comments`     | `PostCommentPreview[]`             | `[]`        | Optional lightweight comment preview rows.                         |
| `headerAction` | `React.ReactNode`                  | -           | Optional trailing header action; disables card-level `onPress`.    |
| `footer`       | `React.ReactNode`                  | -           | Optional footer content below actions/comments.                    |
| `tone`         | `ZoraCardTone`                     | `'default'` | Passed to the underlying `Card`.                                   |
| `compact`      | `boolean`                          | `false`     | Uses tighter spacing and smaller avatar defaults.                  |
| `onPress`      | `() => void`                       | -           | Makes the card pressable when no `headerAction` is present.        |
| `testID`       | `string`                           | -           | Forwarded to the underlying card.                                  |

`PostAuthor`:

| Prop       | Type               | Notes                                     |
| ---------- | ------------------ | ----------------------------------------- |
| `name`     | `React.ReactNode`  | Display name.                             |
| `subtitle` | `React.ReactNode`  | Optional handle, timestamp, or meta text. |
| `avatar`   | `PostAuthorAvatar` | Optional avatar configuration.            |

`PostAuthorAvatar`:

| Prop       | Type                  | Notes                                      |
| ---------- | --------------------- | ------------------------------------------ |
| `source`   | `ImageSourcePropType` | Optional avatar image source.              |
| `name`     | `string`              | Used for fallback initials when available. |
| `initials` | `string`              | Explicit fallback initials.                |
| `label`    | `string`              | Accessibility label.                       |
| `size`     | `AvatarSize`          | Optional avatar size override.             |
| `shape`    | `AvatarShape`         | Optional avatar shape override.            |
| `tone`     | `ZoraTone`            | Optional fallback tone.                    |

`PostCardMedia`:

| Prop          | Type                  | Notes                                                |
| ------------- | --------------------- | ---------------------------------------------------- |
| `source`      | `ImageSourcePropType` | Source-backed media. Requires `label`.               |
| `label`       | `string`              | Accessibility label for source-backed media.         |
| `aspectRatio` | `number`              | Optional aspect ratio. Defaults to `16 / 9`.         |
| `children`    | `React.ReactNode`     | Custom media slot, mutually exclusive with `source`. |

`PostAction`:

| Prop       | Type              | Notes                                    |
| ---------- | ----------------- | ---------------------------------------- |
| `id`       | `string`          | Stable action key.                       |
| `label`    | `string`          | Action label.                            |
| `icon`     | `ButtonIconSpec`  | Optional leading icon.                   |
| `count`    | `React.ReactNode` | Optional count rendered after the label. |
| `selected` | `boolean`         | Uses primary/soft action styling.        |
| `disabled` | `boolean`         | Disables the action.                     |
| `onPress`  | `() => void`      | Optional press handler.                  |

`PostCommentPreview`:

| Prop     | Type              | Notes                                   |
| -------- | ----------------- | --------------------------------------- |
| `id`     | `string`          | Stable comment key.                     |
| `author` | `PostAuthor`      | Optional comment author.                |
| `text`   | `React.ReactNode` | Comment preview text.                   |
| `meta`   | `React.ReactNode` | Optional timestamp or comment metadata. |
| `action` | `React.ReactNode` | Optional custom comment action.         |

Inherited props:

No raw style escape hatch is exposed by `PostCard`. It uses the underlying ZORA
`Card`, `Avatar`, `Text`, `Button`, and layout primitives internally.

</details>

### `SectionHeader`

Reusable section heading with optional eyebrow, description, and actions.

```tsx
<SectionHeader actions={<Badge>Live</Badge>} title="Activity" />
```

<details>
<summary>Props</summary>

ZORA props:

| Prop          | Type              | Default | Notes                                |
| ------------- | ----------------- | ------- | ------------------------------------ |
| `title`       | `React.ReactNode` | -       | Required heading title.              |
| `description` | `React.ReactNode` | -       | Supporting copy.                     |
| `eyebrow`     | `React.ReactNode` | -       | Small muted text above the title.    |
| `actions`     | `React.ReactNode` | -       | Action area opposite the heading.    |
| `testID`      | `string`          | -       | Forwarded to the root Surface stack. |

Inherited props:

No inherited props. `SectionHeaderProps` is declared directly by ZORA.

</details>

### `FilterBar`

Composable row for search + chips + trailing actions.

```tsx
<FilterBar leading={<SearchBar value={query} onValueChange={setQuery} />}>
  <ChipGroup value="all" onValueChange={setFilter} items={[{ value: 'all', label: 'All' }]} />
</FilterBar>
```

<details>
<summary>Props</summary>

ZORA props:

| Prop       | Type              | Default | Notes                          |
| ---------- | ----------------- | ------- | ------------------------------ |
| `leading`  | `React.ReactNode` | -       | Optional leading content.      |
| `children` | `React.ReactNode` | -       | Main filter controls.          |
| `trailing` | `React.ReactNode` | -       | Optional trailing content.     |
| `wrap`     | `boolean`         | `true`  | Wraps content on small widths. |
| `testID`   | `string`          | -       | Test id.                       |

Inherited props:

No inherited props. `FilterBarProps` is declared directly by ZORA.

</details>

### `SelectionProvider` / `useSelection` / `SelectableItem`

Scoped selection state for contextual app bar workflows. Selection state is local interaction state and must not live in `ZoraProvider`.

Basic usage (selection mode for `AppBar` stays prop-driven):

```tsx
function SelectionHeader() {
  const selection = useSelection();

  return (
    <AppBar
      title={selection.hasSelection ? undefined : 'Inbox'}
      appMode={
        selection.hasSelection
          ? {
              type: 'selection',
              label: 'Selected',
              count: selection.selectedCount,
              onCancel: selection.clear,
            }
          : undefined
      }
    />
  );
}

<SelectionProvider mode="single">
  <SelectionHeader />
  <SelectableItem id="message-1" trigger="press">
    {({ selected }) => <Card compact title={selected ? 'Selected' : 'Tap to select'} />}
  </SelectableItem>
</SelectionProvider>;
```

Trigger strategies:

- `trigger="press"` selects on press.
- `trigger="longPress"` selects on long press.
- `trigger="manual"` does not bind automatic triggers; consumers call `select`, `toggle`, or `clear` explicitly.

Nested providers are isolated by default: `useSelection()` always reads the nearest `SelectionProvider`.

<details>
<summary>Props</summary>

`SelectionProvider` props:

| Prop                 | Type                               | Default    | Notes                                             |
| -------------------- | ---------------------------------- | ---------- | ------------------------------------------------- |
| `children`           | `React.ReactNode`                  | -          | Required region subtree.                          |
| `selectedIds`        | `readonly string[]`                | -          | Controlled selected ids (string ids).             |
| `defaultSelectedIds` | `readonly string[]`                | -          | Uncontrolled initial selected ids.                |
| `mode`               | `'single' \| 'multi'`              | `'single'` | Selection mode.                                   |
| `disabled`           | `boolean`                          | `false`    | Disables selection updates (select/toggle/clear). |
| `onSelectionChange`  | `(ids: readonly string[]) => void` | -          | Called on selection changes (no-op ignored).      |

`SelectableItem` props:

| Prop       | Type                                                     | Default    | Notes                                                                                                                   |
| ---------- | -------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------- |
| `id`       | `string`                                                 | -          | Required item id.                                                                                                       |
| `trigger`  | `'press' \| 'longPress' \| 'manual'`                     | `'manual'` | Automatic selection trigger strategy.                                                                                   |
| `disabled` | `boolean`                                                | `false`    | Disables item `select`/`toggle` and automatic triggers (render-prop `clear()` still works unless provider is disabled). |
| `children` | `ReactNode \| (state: SelectableItemState) => ReactNode` | -          | Render-prop receives selection state and helpers.                                                                       |

Accessibility note:

- For `trigger="manual"`, `SelectableItem` renders no interactive wrapper and does not apply accessibility props automatically. Consumers are responsible for `accessibilityState`, roles, and handlers.

</details>

### `List`

List wrapper that renders `ListRow` items with dividers or spacing, or accepts custom children.

```tsx
<List
  items={[
    { title: 'Account', description: 'Profile and security', onPress: () => undefined },
    { title: 'Notifications', trailing: <Badge>On</Badge> },
  ]}
/>
```

<details>
<summary>Props</summary>

ZORA props:

| Prop         | Type              | Default     | Notes                                                 |
| ------------ | ----------------- | ----------- | ----------------------------------------------------- |
| `items`      | `ListRowProps[]`  | -           | Items mode. Mutually exclusive with `children`.       |
| `children`   | `React.ReactNode` | -           | Custom children mode.                                 |
| `rowVariant` | `ListRowVariant`  | `'divider'` | Default variant applied when an item omits `variant`. |
| `compact`    | `boolean`         | `false`     | Default compact value applied to rows.                |
| `testID`     | `string`          | -           | Test id.                                              |

Behavior notes:

- In items mode, ZORA inserts `Divider` between `variant="divider"` rows and `Spacer` between `variant="card"` rows.

Inherited props:

No inherited props. `ListProps` is declared directly by ZORA.

</details>

### `ListRow`

Single list row with leading/trailing slots, optional metadata, and a structured action model.

```tsx
<ListRow title="Profile" description="Update your details" onPress={() => undefined} />
```

<details>
<summary>Props</summary>

ZORA props:

| Prop          | Type              | Default     | Notes                                                            |
| ------------- | ----------------- | ----------- | ---------------------------------------------------------------- |
| `title`       | `React.ReactNode` | -           | Required row title.                                              |
| `description` | `React.ReactNode` | -           | Supporting description.                                          |
| `meta`        | `React.ReactNode` | -           | Small secondary metadata below description.                      |
| `leading`     | `React.ReactNode` | -           | Leading slot (icon/avatar/media).                                |
| `trailing`    | `React.ReactNode` | -           | Trailing slot (badges/meta).                                     |
| `variant`     | `ListRowVariant`  | `'divider'` | `divider` or `card`.                                             |
| `compact`     | `boolean`         | `false`     | Uses tighter padding and typography spacing.                     |
| `selected`    | `boolean`         | `false`     | Selected styling state.                                          |
| `disabled`    | `boolean`         | `false`     | Disables interaction and mutes presentation.                     |
| `onPress`     | `() => void`      | -           | Makes the row pressable. Mutually exclusive with `action`.       |
| `action`      | `React.ReactNode` | -           | Trailing interactive content. Mutually exclusive with `onPress`. |
| `testID`      | `string`          | -           | Test id.                                                         |

Inherited props:

No inherited props. `ListRowProps` is declared directly by ZORA.

</details>

### `ListSection`

Section wrapper for list content with an optional `SectionHeader`.

```tsx
<ListSection title="Settings" items={[{ title: 'Account' }]} />
```

<details>
<summary>Props</summary>

ZORA props:

| Prop          | Type              | Default     | Notes                                                 |
| ------------- | ----------------- | ----------- | ----------------------------------------------------- |
| `title`       | `React.ReactNode` | -           | Optional section title (renders `SectionHeader`).     |
| `description` | `React.ReactNode` | -           | Optional section description.                         |
| `eyebrow`     | `React.ReactNode` | -           | Optional eyebrow above the title.                     |
| `actions`     | `React.ReactNode` | -           | Optional trailing header actions.                     |
| `items`       | `ListRowProps[]`  | -           | Items mode list content.                              |
| `children`    | `React.ReactNode` | -           | Custom children mode list content.                    |
| `rowVariant`  | `ListRowVariant`  | `'divider'` | Default variant applied when an item omits `variant`. |
| `compact`     | `boolean`         | `false`     | Default compact value applied to rows.                |
| `testID`      | `string`          | -           | Test id.                                              |

Inherited props:

No inherited props. `ListSectionProps` is declared directly by ZORA.

</details>

### `Timeline`

Vertical-only timeline pattern for onboarding steps, order tracking, and activity sequences.

```tsx
<Timeline
  items={[
    { id: '1', title: 'Order placed', meta: '09:15', status: 'success' },
    { id: '2', title: 'In transit', meta: '11:42', status: 'primary' },
    { id: '3', title: 'Requires attention', meta: 'Today', status: 'warning' },
  ]}
/>
```

<details>
<summary>Props</summary>

ZORA props:

| Prop      | Type             | Default | Notes                                         |
| --------- | ---------------- | ------- | --------------------------------------------- |
| `items`   | `TimelineItem[]` | -       | Ordered timeline items (vertical-only in v1). |
| `compact` | `boolean`        | `false` | Uses tighter spacing between items.           |
| `testID`  | `string`         | -       | Test id.                                      |

Item shape:

```ts
type TimelineItem = {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  status?: ZoraTone;
  icon?: ButtonIconSpec;
};
```

Inherited props:

No inherited props. `TimelineProps` is declared directly by ZORA.

</details>

### `SettingsRow`

Compact settings row with optional metadata, control, and press handling.

```tsx
<SettingsRow control={<Switch value={enabled} />} title="Notifications" />
```

<details>
<summary>Props</summary>

ZORA props:

| Prop          | Type              | Default | Notes                                       |
| ------------- | ----------------- | ------- | ------------------------------------------- |
| `title`       | `React.ReactNode` | -       | Required row title.                         |
| `description` | `React.ReactNode` | -       | Row description.                            |
| `meta`        | `React.ReactNode` | -       | Small muted metadata below the row content. |
| `control`     | `React.ReactNode` | -       | Trailing control or action content.         |
| `onPress`     | `() => void`      | -       | Makes the underlying card pressable.        |
| `disabled`    | `boolean`         | `false` | Forwarded to the underlying card.           |
| `testID`      | `string`          | -       | Forwarded to the underlying card.           |

Inherited props:

No inherited props. `SettingsRowProps` is declared directly by ZORA.

</details>

### `EmptyState`

No-data surface with title, optional supporting text, actions, and footer.

```tsx
<EmptyState
  primaryAction={{ label: 'Create project', onPress: createProject }}
  title="Nothing here yet"
/>
```

<details>
<summary>Props</summary>

ZORA props:

| Prop              | Type               | Default | Notes                                                                                                   |
| ----------------- | ------------------ | ------- | ------------------------------------------------------------------------------------------------------- |
| `title`           | `React.ReactNode`  | -       | Required empty-state title.                                                                             |
| `description`     | `React.ReactNode`  | -       | Supporting copy.                                                                                        |
| `eyebrow`         | `React.ReactNode`  | -       | Card eyebrow.                                                                                           |
| `primaryAction`   | `EmptyStateAction` | -       | Primary action button.                                                                                  |
| `secondaryAction` | `EmptyStateAction` | -       | Secondary action button; defaults to `tone="neutral"` and `emphasis="soft"` when omitted on the action. |
| `footer`          | `React.ReactNode`  | -       | Footer content below actions.                                                                           |
| `testID`          | `string`           | -       | Forwarded to the underlying card.                                                                       |

`EmptyStateAction`:

| Prop       | Type              | Default | Notes            |
| ---------- | ----------------- | ------- | ---------------- |
| `label`    | `React.ReactNode` | -       | Button label.    |
| `onPress`  | `() => void`      | -       | Button handler.  |
| `tone`     | `ZoraTone`        | -       | Button tone.     |
| `emphasis` | `ZoraEmphasis`    | -       | Button emphasis. |

Inherited props:

No inherited props. `EmptyStateProps` and `EmptyStateAction` are declared
directly by ZORA.

</details>

### `ConfirmDialog`

Narrow confirmation modal for destructive or high-signal decisions.

```tsx
<ConfirmDialog
  confirmLabel="Archive"
  confirmTone="danger"
  onCancel={close}
  onConfirm={archive}
  title="Archive project?"
  visible={visible}
/>
```

<details>
<summary>Props</summary>

ZORA props:

| Prop              | Type              | Default     | Notes                                      |
| ----------------- | ----------------- | ----------- | ------------------------------------------ |
| `visible`         | `boolean`         | -           | Required modal visibility.                 |
| `title`           | `React.ReactNode` | -           | Required dialog title.                     |
| `description`     | `React.ReactNode` | -           | Dialog description.                        |
| `children`        | `React.ReactNode` | -           | Dialog body.                               |
| `confirmLabel`    | `React.ReactNode` | `'Confirm'` | Confirm button label.                      |
| `cancelLabel`     | `React.ReactNode` | `'Cancel'`  | Cancel button label.                       |
| `confirmTone`     | `ZoraTone`        | `'danger'`  | Confirm button tone.                       |
| `confirmEmphasis` | `ZoraEmphasis`    | `'solid'`   | Confirm button emphasis.                   |
| `busy`            | `boolean`         | `false`     | Passed to the confirm button as `loading`. |
| `closeOnBackdrop` | `boolean`         | `true`      | Passed to the underlying modal.            |
| `onConfirm`       | `() => void`      | -           | Confirm button handler.                    |
| `onCancel`        | `() => void`      | -           | Cancel button and modal dismiss handler.   |
| `testID`          | `string`          | -           | Forwarded to the underlying modal.         |

Confirm dialogs always use `Modal` with `width="narrow"`.

Inherited props:

No inherited props. `ConfirmDialogProps` is declared directly by ZORA.

</details>

### `DisclosureSection`

Collapsible section for property groups and settings.

```tsx
<DisclosureSection title="Advanced Settings">{content}</DisclosureSection>
```

<details>
<summary>Props</summary>

ZORA props:

| Prop           | Type                      | Default | Notes                 |
| -------------- | ------------------------- | ------- | --------------------- |
| `title`        | `React.ReactNode`         | -       | Section title.        |
| `description`  | `React.ReactNode`         | -       | Subheading text.      |
| `defaultOpen`  | `boolean`                 | `true`  | Initial state.        |
| `open`         | `boolean`                 | -       | Controlled state.     |
| `onOpenChange` | `(open: boolean) => void` | -       | Toggle handler.       |
| `actions`      | `React.ReactNode`         | -       | Extra header actions. |

</details>

### `ResponsivePanel`

Side panel that adapts to screen size (inline or overlay).

```tsx
<ResponsivePanel onOpenChange={setOpen} open={open} title="Inspector">
  {content}
</ResponsivePanel>
```

<details>
<summary>Props</summary>

ZORA props:

| Prop           | Type                      | Default    | Notes                    |
| -------------- | ------------------------- | ---------- | ------------------------ |
| `open`         | `boolean`                 | -          | Required visibility.     |
| `onOpenChange` | `(open: boolean) => void` | -          | Required change handler. |
| `side`         | `'left' \| 'right'`       | `'right'`  | Layout side.             |
| `desktopMode`  | `'inline' \| 'floating'`  | `'inline'` | Desktop rendering style. |
| `mobileMode`   | `'drawer' \| 'modal'`     | `'drawer'` | Mobile rendering style.  |

</details>

### `InspectorField`

Dense form field optimized for property panels.

```tsx
<InspectorField
  control={<IconButton icon={{ name: 'refresh-outline' }} label="Reset" />}
  label="Opacity"
>
  <Input value="100%" />
</InspectorField>
```

<details>
<summary>Props</summary>

ZORA props:

| Prop       | Type              | Default | Notes                  |
| ---------- | ----------------- | ------- | ---------------------- |
| `label`    | `React.ReactNode` | -       | Field label.           |
| `control`  | `React.ReactNode` | -       | Trailing control slot. |
| `children` | `React.ReactNode` | -       | Main editor content.   |

Inherits all `FormField` props.

</details>

### `SwitchField`

Labeled boolean toggle row.

```tsx
<SwitchField label="Enable Notifications" onValueChange={setVal} value={val} />
```

<details>
<summary>Props</summary>

ZORA props:

| Prop            | Type                       | Default | Notes             |
| --------------- | -------------------------- | ------- | ----------------- |
| `label`         | `React.ReactNode`          | -       | Required label.   |
| `description`   | `React.ReactNode`          | -       | Subheading text.  |
| `value`         | `boolean`                  | -       | Required state.   |
| `onValueChange` | `(value: boolean) => void` | -       | Required handler. |

</details>

### `TreeView`

Hierarchical list for navigation and layers.

```tsx
<TreeView
  nodes={[{ id: '1', label: 'Folder', children: [{ id: '2', label: 'File' }] }]}
  onSelect={(id) => console.log(id)}
/>
```

<details>
<summary>Props</summary>

ZORA props:

| Prop          | Type                   | Default | Notes                 |
| ------------- | ---------------------- | ------- | --------------------- |
| `nodes`       | `TreeItemNode[]`       | -       | Required tree data.   |
| `selectedId`  | `string`               | -       | Active node.          |
| `expandedIds` | `string[]`             | -       | Controlled expansion. |
| `onSelect`    | `(id: string) => void` | -       | Click handler.        |

</details>

### `TileGrid` / `PaletteItem`

Grid-based selection for palettes and toolboxes.

```tsx
<TileGrid>
  <PaletteItem title="Red" onPress={() => setCol('red')} />
  <PaletteItem title="Blue" onPress={() => setCol('blue')} />
</TileGrid>
```

<details>
<summary>Props</summary>

`TileGrid` props:

| Prop      | Type                     | Default        | Notes        |
| --------- | ------------------------ | -------------- | ------------ |
| `columns` | `number \| 'responsive'` | `'responsive'` | Grid layout. |

`PaletteItem` props:

| Prop       | Type              | Default | Notes              |
| ---------- | ----------------- | ------- | ------------------ |
| `title`    | `React.ReactNode` | -       | Item title.        |
| `selected` | `boolean`         | `false` | Highlighted state. |
| `onPress`  | `() => void`      | -       | Click handler.     |

</details>

### `CollectionEditor`

Generic visual shell for editing ordered collections.

```tsx
<CollectionEditor
  items={items}
  renderItem={({ item }) => <Text>{item.name}</Text>}
  onAdd={() => add()}
  onRemove={(index) => remove(index)}
/>
```

<details>
<summary>Props</summary>

ZORA props:

| Prop         | Type                      | Default | Notes                   |
| ------------ | ------------------------- | ------- | ----------------------- |
| `items`      | `readonly T[]`            | -       | Required collection.    |
| `renderItem` | `(props) => ReactNode`    | -       | Required item renderer. |
| `onAdd`      | `() => void`              | -       | Add handler.            |
| `onRemove`   | `(index: number) => void` | -       | Remove handler.         |
| `onMove`     | `(from, to) => void`      | -       | Reorder handler.        |

</details>

### `ThemeComposer`

Interactive pattern for editing a `ZoraTheme` seed and previewing the result live.
Pass your current theme as `value` and handle updates through `onChange`. Wrap both
in a `ZoraProvider` so the preview area reflects every change immediately.

```tsx
const [theme, setTheme] = React.useState<ZoraTheme>({
  id: 'my-app',
  name: 'My App',
  appCategory: 'developer_tools',
  primaryColor: '#0f766e',
  harmony: 'analogous',
});
const [mode, setMode] = React.useState<ZoraThemeMode>('light');

return (
  <ZoraProvider theme={theme} initialMode={mode}>
    <ThemeComposer
      value={theme}
      onChange={setTheme}
      mode={mode}
      onModeChange={setMode}
      onSubmit={(t) => saveTheme(t)}
    />
  </ZoraProvider>
);
```

<details>
<summary>Props</summary>

ZORA props:

| Prop            | Type                            | Default          | Notes                                                |
| --------------- | ------------------------------- | ---------------- | ---------------------------------------------------- |
| `value`         | `ZoraTheme`                     | -                | Required controlled theme seed.                      |
| `onChange`      | `(theme: ZoraTheme) => void`    | -                | Required. Fires on every valid change.               |
| `mode`          | `ZoraThemeMode`                 | -                | Current light/dark mode shown in the mode toggle.    |
| `onModeChange`  | `(mode: ZoraThemeMode) => void` | -                | Called when the user switches the mode toggle.       |
| `onSubmit`      | `(theme: ZoraTheme) => void`    | -                | Optional. Renders an "Apply theme" button if set.    |
| `appCategories` | `readonly AppCategory[]`        | `APP_CATEGORIES` | Optional override for the app category options list. |
| `testID`        | `string`                        | -                | Forwarded to the root element and child test points. |

</details>

## Theme

### `ZoraProvider`

Theme provider that creates the ZORA theme and passes it to Surface
`ThemeProvider`.

```tsx
<ZoraProvider initialMode="dark">
  <App />
</ZoraProvider>
```

Pass a theme seed to define your app theme:

```tsx
<ZoraProvider
  initialMode="dark"
  theme={{
    id: 'studio',
    name: 'Studio',
    appCategory: 'developer_tools',
    primaryColor: '#0f766e',
    harmony: 'analogous',
  }}
>
  <App />
</ZoraProvider>
```

<details>
<summary>Props</summary>

ZORA props:

| Prop          | Type                | Default            | Notes                                 |
| ------------- | ------------------- | ------------------ | ------------------------------------- |
| `children`    | `React.ReactNode`   | -                  | Required app content.                 |
| `theme`       | `ZoraTheme`         | `zoraDefaultTheme` | App-facing theme seed for ZORA.       |
| `initialMode` | `'light' \| 'dark'` | `'light'`          | Initial theme mode passed to Surface. |

Inherited props:

No inherited props. `ZoraProviderProps` is declared directly by ZORA.

</details>

### `createZoraThemeConfig`

Creates a `ThemeConfig` (from `@ankhorage/contracts`) from a ZORA theme seed.
The primary color is preserved identically for both light and dark mode configs.
Color generation is handled downstream by `@ankhorage/color-theory` via Surface.

```tsx
const themeConfig = createZoraThemeConfig({
  id: 'studio',
  name: 'Studio',
  appCategory: 'developer_tools',
  primaryColor: '#0f766e',
  harmony: 'analogous',
});
```

<details>
<summary>API</summary>

```ts
function createZoraThemeConfig(theme?: ZoraTheme): ThemeConfig;
```

</details>

### `zoraDefaultTheme`

Default ZORA theme seed.

<details>
<summary>Value</summary>

```ts
const zoraDefaultTheme: ZoraTheme = {
  id: 'zora',
  name: 'ZORA',
  appCategory: 'developer_tools',
  primaryColor: '#0f766e',
  harmony: 'analogous',
};
```

</details>

## Example App

A complete Expo showcase lives in `examples/expo-showcase`. It renders the
current ZORA components, layouts, patterns, and theme entry points, including
light/dark mode through `AppShell`.

Run it locally:

```bash
cd examples/expo-showcase
bun install
bun run web
```

The example imports `@ankhorage/zora` and demonstrates the package API in
`examples/expo-showcase/App.tsx`.

## Changelog

Version history is maintained in [CHANGELOG.md](./CHANGELOG.md).

## License

MIT
