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
  AppShell,
  Button,
  Card,
  Heading,
  Page,
  PageHeader,
  Text,
  Toolbar,
  ToolbarAction,
  ZoraProvider,
} from '@ankhorage/zora';

export function App() {
  return (
    <ZoraProvider>
      <AppShell
        header={
          <Toolbar>
            <ToolbarAction icon={{ name: 'menu-outline' }} label="Menu" />
          </Toolbar>
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

In Plan 2, `mode` is a declarative render-scope override. Calling `setMode` from
`useZoraTheme()` still targets the root theme provider.

## Foundation primitives

ZORA re-exports selected Surface foundation primitives for app-facing layout
code:

```tsx
import { Box, Container, Grid, Heading, Stack, Text } from '@ankhorage/zora';
```

Use ZORA `Text` and `Heading` for typography. Use `Box`, `Stack`, `Grid`, and
`Container` for layout. Surface remains the lower-level render foundation and
should not be required in normal app-facing UI code.

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

| Prop            | Type                                     | Default     | Notes                                        |
| --------------- | ---------------------------------------- | ----------- | -------------------------------------------- |
| `children`      | `React.ReactNode`                        | -           | Primary content.                             |
| `text`          | `string`                                 | -           | Manifest-friendly content prop.              |
| `i18nKey`       | `string`                                 | -           | Runtime-resolved fallback key when no content prop is provided.                    |
| `level`         | `HeadingLevel`                           | `2`         | Semantic heading level from `1` through `6`. |
| `size`          | `Responsive<HeadingSize>`                | level size  | Visual scale: `display`, `h1` through `h6`.  |
| `tone`          | `Responsive<HeadingTone>`                | `'default'` | Semantic text color.                         |
| `align`         | `Responsive<HeadingAlign>`               | -           | Text alignment.                              |
| `weight`        | `Responsive<HeadingWeight>`              | recipe      | Optional structured weight override.         |
| `italic`        | `boolean`                                | `false`     | Italic style.                                |
| `numberOfLines` | `number`                                 | -           | Native/web truncation line count.            |
| `ellipsizeMode` | `'head' \| 'middle' \| 'tail' \| 'clip'` | -           | Truncation behavior.                         |
| `selectable`    | `boolean`                                | -           | Allows text selection where supported.       |
| `testID`        | `string`                                 | -           | Test id.                                     |

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

| Prop            | Type                                     | Default     | Notes                                  |
| --------------- | ---------------------------------------- | ----------- | -------------------------------------- |
| `children`      | `React.ReactNode`                        | -           | Primary content.                       |
| `text`          | `string`                                 | -           | Manifest-friendly content prop.        |
| `i18nKey`       | `string`                                 | -           | Runtime-resolved fallback key when no content prop is provided.              |
| `variant`       | `Responsive<TextVariant>`                | `'body'`    | Typography recipe.                     |
| `tone`          | `Responsive<TextTone>`                   | `'default'` | Semantic text color.                   |
| `align`         | `Responsive<TextAlign>`                  | -           | Text alignment.                        |
| `weight`        | `Responsive<TextWeight>`                 | recipe      | Optional structured weight override.   |
| `italic`        | `boolean`                                | `false`     | Italic style.                          |
| `numberOfLines` | `number`                                 | -           | Native/web truncation line count.      |
| `ellipsizeMode` | `'head' \| 'middle' \| 'tail' \| 'clip'` | -           | Truncation behavior.                   |
| `selectable`    | `boolean`                                | -           | Allows text selection where supported. |
| `testID`        | `string`                                 | -           | Test id.                               |

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

| Prop           | Type              | Default | Notes                                    |
| -------------- | ----------------- | ------- | ---------------------------------------- |
| `size`         | `ZoraControlSize` | `'l'`   | Passed to Surface as `size`.             |
| `leadingIcon`  | `ButtonIconSpec`  | -       | Rendered as Surface `leadingAccessory`.  |
| `trailingIcon` | `ButtonIconSpec`  | -       | Rendered as Surface `trailingAccessory`. |

Inherited props:

Inherits all Surface `TextInputProps` except `leadingAccessory`, `size`, and
`trailingAccessory`. Surface `TextInputProps` also inherit React Native
`TextInputProps` except `defaultValue`, `editable`, `onChangeText`,
`placeholderTextColor`, `style`, `testID`, and `value`; Surface re-exposes
`value`, `defaultValue`, `onChangeText`, `placeholder`, `disabled`, `readOnly`,
`invalid`, `style`, and `testID`.

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
    primaryColor: '#0f766e',
    harmony: 'analogous',
    tone: 'jewel',
  }}
>
  <App />
</ZoraProvider>
```

<details>
<summary>Props</summary>

ZORA props:

| Prop          | Type                 | Default            | Notes                                  |
| ------------- | -------------------- | ------------------ | -------------------------------------- |
| `children`    | `React.ReactNode`    | -                  | Required app content.                  |
| `theme`       | `ZoraTheme`          | `zoraDefaultTheme` | App-facing theme seed for ZORA.        |
| `initialMode` | `'light' \| 'dark'`  | `'light'`          | Initial theme mode passed to Surface.  |

Inherited props:

No inherited props. `ZoraProviderProps` is declared directly by ZORA.

</details>

### `createZoraThemeConfig`

Creates a Surface-compatible `ThemeConfig` from a ZORA theme seed.

```tsx
const themeConfig = createZoraThemeConfig({
  id: 'studio',
  name: 'Studio',
  primaryColor: '#0f766e',
  harmony: 'analogous',
  tone: 'jewel',
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
  primaryColor: '#0f766e',
  harmony: 'analogous',
  tone: 'jewel',
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
