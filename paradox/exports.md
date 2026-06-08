# Public API

## ActionSheet

Kind: `value`
Module: `src/components/action-sheet/ActionSheet.tsx`
Source: `src/components/action-sheet/ActionSheet.tsx:14:14`

Presents a modal bottom sheet with a list of actions.

## ActionSheetItem

Kind: `value`
Module: `src/components/action-sheet/ActionSheetItem.tsx`
Source: `src/components/action-sheet/ActionSheetItem.tsx:35:14`

Renders a single selectable action row within an `ActionSheet`.

## ActionSheetItemProps

Kind: `type`
Module: `src/components/action-sheet/types.ts`
Source: `src/components/action-sheet/types.ts:16:1`

### Members

| Name        | Kind     | Type                                                                                                                                          | Required | Description |
| ----------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| color       | property | `"primary" \| "secondary" \| "tertiary" \| "quaternary" \| "neutral" \| "success" \| "warning" \| "error" \| "info" \| "danger" \| undefined` | no       |             |
| description | property | `React.ReactNode`                                                                                                                             | no       |             |
| disabled    | property | `boolean \| undefined`                                                                                                                        | no       |             |
| icon        | property | `ButtonIconSpec \| undefined`                                                                                                                 | no       |             |
| label       | property | `React.ReactNode`                                                                                                                             | yes      |             |
| leading     | property | `React.ReactNode`                                                                                                                             | no       |             |
| mode        | property | `ZoraThemeMode \| undefined`                                                                                                                  | no       |             |
| onPress     | property | `(() => void) \| undefined`                                                                                                                   | no       |             |
| selected    | property | `boolean \| undefined`                                                                                                                        | no       |             |
| testID      | property | `string \| undefined`                                                                                                                         | no       |             |
| themeId     | property | `string \| undefined`                                                                                                                         | no       |             |
| trailing    | property | `React.ReactNode`                                                                                                                             | no       |             |

## ActionSheetProps

Kind: `type`
Module: `src/components/action-sheet/types.ts`
Source: `src/components/action-sheet/types.ts:11:1`

### Members

| Name            | Kind     | Type                         | Required | Description |
| --------------- | -------- | ---------------------------- | -------- | ----------- |
| cancelLabel     | property | `React.ReactNode`            | no       |             |
| children        | property | `React.ReactNode`            | no       |             |
| closeOnBackdrop | property | `boolean \| undefined`       | no       |             |
| description     | property | `React.ReactNode`            | no       |             |
| mode            | property | `ZoraThemeMode \| undefined` | no       |             |
| onDismiss       | property | `(() => void) \| undefined`  | no       |             |
| testID          | property | `string \| undefined`        | no       |             |
| themeId         | property | `string \| undefined`        | no       |             |
| title           | property | `React.ReactNode`            | no       |             |
| visible         | property | `boolean`                    | yes      |             |

## AppBar

Kind: `value`
Module: `src/components/app-bar/AppBar.tsx`
Source: `src/components/app-bar/AppBar.tsx:136:14`

Renders a top app bar with title/subtitle and optional leading/trailing actions.

## AppBarMode

Kind: `unknown`
Module: `src/components/app-bar/types.ts`
Source: `src/components/app-bar/types.ts:6:1`

## AppBarOverflowAction

Kind: `type`
Module: `src/components/app-bar/types.ts`
Source: `src/components/app-bar/types.ts:19:1`

### Members

| Name     | Kind     | Type                          | Required | Description |
| -------- | -------- | ----------------------------- | -------- | ----------- |
| disabled | property | `boolean \| undefined`        | no       |             |
| icon     | property | `ButtonIconSpec \| undefined` | no       |             |
| label    | property | `string \| undefined`         | no       |             |
| onPress  | property | `() => void`                  | yes      |             |

## AppBarProps

Kind: `type`
Module: `src/components/app-bar/types.ts`
Source: `src/components/app-bar/types.ts:26:1`

### Members

| Name        | Kind     | Type                                | Required | Description |
| ----------- | -------- | ----------------------------------- | -------- | ----------- |
| actions     | property | `React.ReactNode`                   | no       |             |
| appMode     | property | `AppBarMode \| undefined`           | no       |             |
| children    | property | `React.ReactNode`                   | no       |             |
| divider     | property | `boolean \| undefined`              | no       |             |
| leading     | property | `React.ReactNode`                   | no       |             |
| mode        | property | `ZoraThemeMode \| undefined`        | no       |             |
| overflow    | property | `AppBarOverflowAction \| undefined` | no       |             |
| safeAreaTop | property | `boolean \| undefined`              | no       |             |
| subtitle    | property | `React.ReactNode`                   | no       |             |
| testID      | property | `string \| undefined`               | no       |             |
| themeId     | property | `string \| undefined`               | no       |             |
| title       | property | `React.ReactNode`                   | no       |             |

## AppShell

Kind: `value`
Module: `src/layout/app-shell/AppShell.tsx`
Source: `src/layout/app-shell/AppShell.tsx:48:14`

Root application shell with stable header, content, footer, and overlay slots.

`AppShell` provides the top-level layout frame for cross-platform apps while
leaving navigation, toolbars, and overlays composable through explicit slots.

## AppShellProps

Kind: `type`
Module: `src/layout/app-shell/types.ts`
Source: `src/layout/app-shell/types.ts:5:1`

### Members

| Name     | Kind     | Type                         | Required | Description |
| -------- | -------- | ---------------------------- | -------- | ----------- |
| children | property | `React.ReactNode`            | no       |             |
| footer   | property | `React.ReactNode`            | no       |             |
| header   | property | `React.ReactNode`            | no       |             |
| mode     | property | `ZoraThemeMode \| undefined` | no       |             |
| overlay  | property | `React.ReactNode`            | no       |             |
| testID   | property | `string \| undefined`        | no       |             |
| themeId  | property | `string \| undefined`        | no       |             |

## AuthFormBaseProps

Kind: `type`
Module: `src/patterns/auth/types.ts`
Source: `src/patterns/auth/types.ts:9:1`

### Members

| Name        | Kind     | Type                         | Required | Description |
| ----------- | -------- | ---------------------------- | -------- | ----------- |
| disabled    | property | `boolean \| undefined`       | no       |             |
| error       | property | `React.ReactNode`            | no       |             |
| loading     | property | `boolean \| undefined`       | no       |             |
| mode        | property | `ZoraThemeMode \| undefined` | no       |             |
| submitLabel | property | `React.ReactNode`            | no       |             |
| testID      | property | `string \| undefined`        | no       |             |
| themeId     | property | `string \| undefined`        | no       |             |

## AuthIdentifierKind

Kind: `unknown`
Module: `src/patterns/auth/types.ts`
Source: `src/patterns/auth/types.ts:7:1`

## Avatar

Kind: `value`
Module: `src/components/avatar/Avatar.tsx`
Source: `src/components/avatar/Avatar.tsx:146:14`

Displays a user or entity avatar with image support and initials fallback.

## AvatarGroup

Kind: `value`
Module: `src/components/avatar-group/AvatarGroup.tsx`
Source: `src/components/avatar-group/AvatarGroup.tsx:77:14`

Renders a compact group of avatars with optional overflow handling.

## AvatarGroupItem

Kind: `type`
Module: `src/components/avatar-group/types.ts`
Source: `src/components/avatar-group/types.ts:8:1`

### Members

| Name         | Kind     | Type                                                                                                                                          | Required | Description |
| ------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| color        | property | `"primary" \| "secondary" \| "tertiary" \| "quaternary" \| "neutral" \| "success" \| "warning" \| "error" \| "info" \| "danger" \| undefined` | no       |             |
| iconFallback | property | `ButtonIconSpec \| undefined`                                                                                                                 | no       |             |
| id           | property | `string \| undefined`                                                                                                                         | no       |             |
| initials     | property | `string \| undefined`                                                                                                                         | no       |             |
| label        | property | `string \| undefined`                                                                                                                         | no       |             |
| name         | property | `string \| undefined`                                                                                                                         | no       |             |
| source       | property | `ImageSourcePropType \| undefined`                                                                                                            | no       |             |

## AvatarGroupProps

Kind: `type`
Module: `src/components/avatar-group/types.ts`
Source: `src/components/avatar-group/types.ts:18:1`

### Members

| Name          | Kind     | Type                                               | Required | Description |
| ------------- | -------- | -------------------------------------------------- | -------- | ----------- |
| items         | property | `readonly AvatarGroupItem[]`                       | yes      |             |
| max           | property | `number \| undefined`                              | no       |             |
| mode          | property | `ZoraThemeMode \| undefined`                       | no       |             |
| overflowLabel | property | `((overflowCount: number) => string) \| undefined` | no       |             |
| shape         | property | `AvatarShape \| undefined`                         | no       |             |
| size          | property | `AvatarSize \| undefined`                          | no       |             |
| testID        | property | `string \| undefined`                              | no       |             |
| themeId       | property | `string \| undefined`                              | no       |             |

## AvatarProps

Kind: `type`
Module: `src/components/avatar/types.ts`
Source: `src/components/avatar/types.ts:11:1`

### Members

| Name         | Kind     | Type                                                                                                                                          | Required | Description |
| ------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| color        | property | `"primary" \| "secondary" \| "tertiary" \| "quaternary" \| "neutral" \| "success" \| "warning" \| "error" \| "info" \| "danger" \| undefined` | no       |             |
| iconFallback | property | `ButtonIconSpec \| undefined`                                                                                                                 | no       |             |
| initials     | property | `string \| undefined`                                                                                                                         | no       |             |
| label        | property | `string \| undefined`                                                                                                                         | no       |             |
| mode         | property | `ZoraThemeMode \| undefined`                                                                                                                  | no       |             |
| name         | property | `string \| undefined`                                                                                                                         | no       |             |
| shape        | property | `AvatarShape \| undefined`                                                                                                                    | no       |             |
| size         | property | `AvatarSize \| undefined`                                                                                                                     | no       |             |
| source       | property | `ImageSourcePropType \| undefined`                                                                                                            | no       |             |
| testID       | property | `string \| undefined`                                                                                                                         | no       |             |
| themeId      | property | `string \| undefined`                                                                                                                         | no       |             |

## AvatarShape

Kind: `unknown`
Module: `src/components/avatar/types.ts`
Source: `src/components/avatar/types.ts:9:1`

## AvatarSize

Kind: `unknown`
Module: `src/components/avatar/types.ts`
Source: `src/components/avatar/types.ts:7:1`

## Badge

Kind: `value`
Module: `src/components/badge/Badge.tsx`
Source: `src/components/badge/Badge.tsx:33:14`

Shows a small status, label, or count indicator.

## BadgeProps

Kind: `type`
Module: `src/components/badge/types.ts`
Source: `src/components/badge/types.ts:7:1`

### Members

| Name     | Kind     | Type                                                                                                                                          | Required | Description |
| -------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| children | property | `React.ReactNode`                                                                                                                             | no       |             |
| color    | property | `"primary" \| "secondary" \| "tertiary" \| "quaternary" \| "neutral" \| "success" \| "warning" \| "error" \| "info" \| "danger" \| undefined` | no       |             |
| mode     | property | `ZoraThemeMode \| undefined`                                                                                                                  | no       |             |
| size     | property | `ZoraControlSize \| undefined`                                                                                                                | no       |             |
| testID   | property | `string \| undefined`                                                                                                                         | no       |             |
| themeId  | property | `string \| undefined`                                                                                                                         | no       |             |
| variant  | property | `ZoraBadgeVariant \| undefined`                                                                                                               | no       |             |

## BarcodeScannerView

Kind: `value`
Module: `src/patterns/scanner/BarcodeScannerView.tsx`
Source: `src/patterns/scanner/BarcodeScannerView.tsx:127:14`

Composed ZORA scanner shell for barcode scanning experiences.

`BarcodeScannerView` is camera-adapter-neutral: pass an `expo-camera`, web,
or test camera element through `camera`; keep permission and fallback UI here.

## BarcodeScannerViewProps

Kind: `type`
Module: `src/patterns/scanner/types.ts`
Source: `src/patterns/scanner/types.ts:32:1`

### Members

| Name                   | Kind     | Type                                                                  | Required | Description |
| ---------------------- | -------- | --------------------------------------------------------------------- | -------- | ----------- |
| camera                 | property | `React.ReactNode`                                                     | no       |             |
| children               | property | `React.ReactNode`                                                     | no       |             |
| cornerLabel            | property | `React.ReactNode`                                                     | no       |             |
| deniedPermissionLabel  | property | `React.ReactNode`                                                     | no       |             |
| description            | property | `React.ReactNode`                                                     | no       |             |
| manualEntryLabel       | property | `React.ReactNode`                                                     | no       |             |
| mode                   | property | `ZoraThemeMode \| undefined`                                          | no       |             |
| onBarcodeScanned       | property | `((result: BarcodeScanResult) => void \| Promise<void>) \| undefined` | no       |             |
| onManualEntry          | property | `(() => void \| Promise<void>) \| undefined`                          | no       |             |
| onRequestPermission    | property | `(() => void \| Promise<void>) \| undefined`                          | no       |             |
| overlayDescription     | property | `React.ReactNode`                                                     | no       |             |
| overlayTitle           | property | `React.ReactNode`                                                     | no       |             |
| permissionStatus       | property | `CameraPermissionStatus`                                              | yes      |             |
| requestPermissionLabel | property | `React.ReactNode`                                                     | no       |             |
| testID                 | property | `string \| undefined`                                                 | no       |             |
| themeId                | property | `string \| undefined`                                                 | no       |             |
| title                  | property | `React.ReactNode`                                                     | no       |             |

## BarcodeScanResult

Kind: `type`
Module: `src/patterns/scanner/types.ts`
Source: `src/patterns/scanner/types.ts:8:1`

### Members

| Name  | Kind     | Type                  | Required | Description |
| ----- | -------- | --------------------- | -------- | ----------- |
| type  | property | `string \| undefined` | no       |             |
| value | property | `string`              | yes      |             |

## Box

Kind: `value`
Module: `src/foundation/Box.tsx`
Source: `src/foundation/Box.tsx:18:14`

Base layout primitive for themed spacing, color, border, flex, and responsive props.

## BoxProps

Kind: `type`
Module: `src/foundation/Box.tsx`
Source: `src/foundation/Box.tsx:7:1`

### Members

| Name               | Kind     | Type                                                                                                                             | Required | Description |
| ------------------ | -------- | -------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| accessibilityLabel | property | `string \| undefined`                                                                                                            | no       |             |
| accessibilityRole  | property | `import("/Users/a_rtiphishl_e/git/zora/node_modules/react-native/types/index").AccessibilityRole \| undefined`                   | no       |             |
| accessibilityState | property | `import("/Users/a_rtiphishl_e/git/zora/node_modules/react-native/types/index").AccessibilityState \| undefined`                  | no       |             |
| accessible         | property | `boolean \| undefined`                                                                                                           | no       |             |
| alignSelf          | property | `Responsive<"auto" \| import("/Users/a_rtiphishl_e/git/zora/node_modules/react-native/types/index").FlexAlignType \| undefined>` | no       |             |
| bg                 | property | `Responsive<ColorValue> \| undefined`                                                                                            | no       |             |
| borderColor        | property | `Responsive<ColorValue> \| undefined`                                                                                            | no       |             |
| borderWidth        | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| bottom             | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| children           | property | `React.ReactNode`                                                                                                                | no       |             |
| flex               | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| flexBasis          | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| flexGrow           | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| flexShrink         | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| height             | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| left               | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| m                  | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| maxHeight          | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| maxWidth           | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| mb                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| minHeight          | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| minWidth           | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| ml                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| mode               | property | `ZoraThemeMode \| undefined`                                                                                                     | no       |             |
| mr                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| mt                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| mx                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| my                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| opacity            | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| overflow           | property | `Responsive<"visible" \| "hidden" \| "scroll" \| undefined>`                                                                     | no       |             |
| p                  | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| pb                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| pl                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| pointerEvents      | property | `"none" \| "auto" \| "box-none" \| "box-only" \| undefined`                                                                      | no       |             |
| position           | property | `Responsive<"absolute" \| "relative" \| "static" \| undefined>`                                                                  | no       |             |
| pr                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| pt                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| px                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| py                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| radius             | property | `Responsive<RadiusValue> \| undefined`                                                                                           | no       |             |
| right              | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| style              | property | `StyleProp<ViewStyle>`                                                                                                           | no       |             |
| testID             | property | `string \| undefined`                                                                                                            | no       |             |
| themeId            | property | `string \| undefined`                                                                                                            | no       |             |
| top                | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| width              | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| zIndex             | property | `Responsive<number> \| undefined`                                                                                                | no       |             |

## BreadcrumbItem

Kind: `type`
Module: `src/components/breadcrumbs/types.ts`
Source: `src/components/breadcrumbs/types.ts:6:1`

### Members

| Name     | Kind     | Type                          | Required | Description |
| -------- | -------- | ----------------------------- | -------- | ----------- |
| disabled | property | `boolean \| undefined`        | no       |             |
| icon     | property | `ButtonIconSpec \| undefined` | no       |             |
| id       | property | `string`                      | yes      |             |
| label    | property | `React.ReactNode`             | yes      |             |
| onPress  | property | `(() => void) \| undefined`   | no       |             |

## Breadcrumbs

Kind: `value`
Module: `src/components/breadcrumbs/Breadcrumbs.tsx`
Source: `src/components/breadcrumbs/Breadcrumbs.tsx:146:14`

Renders a breadcrumb trail for hierarchical navigation.

## BreadcrumbsProps

Kind: `type`
Module: `src/components/breadcrumbs/types.ts`
Source: `src/components/breadcrumbs/types.ts:14:1`

### Members

| Name      | Kind     | Type                         | Required | Description |
| --------- | -------- | ---------------------------- | -------- | ----------- |
| compact   | property | `boolean \| undefined`       | no       |             |
| disabled  | property | `boolean \| undefined`       | no       |             |
| items     | property | `readonly BreadcrumbItem[]`  | yes      |             |
| maxItems  | property | `number \| undefined`        | no       |             |
| mode      | property | `ZoraThemeMode \| undefined` | no       |             |
| separator | property | `React.ReactNode`            | no       |             |
| testID    | property | `string \| undefined`        | no       |             |
| themeId   | property | `string \| undefined`        | no       |             |

## Button

Kind: `value`
Module: `src/components/button/Button.tsx`
Source: `src/components/button/Button.tsx:34:14`

Theme-aware action control for primary, secondary, destructive, and neutral actions.

Use `Button` for explicit user actions that should follow ZORA's semantic color,
variant, and size recipes across React Native and React Native Web.

## ButtonGroup

Kind: `value`
Module: `src/components/button-group/ButtonGroup.tsx`
Source: `src/components/button-group/ButtonGroup.tsx:108:14`

Groups multiple `Button` elements with consistent spacing and alignment.

## ButtonGroupAlign

Kind: `unknown`
Module: `src/components/button-group/types.ts`
Source: `src/components/button-group/types.ts:6:1`

## ButtonGroupOrientation

Kind: `unknown`
Module: `src/components/button-group/types.ts`
Source: `src/components/button-group/types.ts:7:1`

## ButtonGroupProps

Kind: `type`
Module: `src/components/button-group/types.ts`
Source: `src/components/button-group/types.ts:9:1`

### Members

| Name        | Kind     | Type                                                                                                                                                                                                                 | Required | Description |
| ----------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| align       | property | `ButtonGroupAlign \| undefined`                                                                                                                                                                                      | no       |             |
| children    | property | `React.ReactNode`                                                                                                                                                                                                    | no       |             |
| gap         | property | `import("/Users/a_rtiphishl_e/git/zora/node_modules/@ankhorage/surface/dist/index").Responsive<import("/Users/a_rtiphishl_e/git/zora/node_modules/@ankhorage/surface/dist/layout/helpers").SpaceValue> \| undefined` | no       |             |
| mode        | property | `ZoraThemeMode \| undefined`                                                                                                                                                                                         | no       |             |
| orientation | property | `ButtonGroupOrientation \| undefined`                                                                                                                                                                                | no       |             |
| reverse     | property | `boolean \| undefined`                                                                                                                                                                                               | no       |             |
| testID      | property | `string \| undefined`                                                                                                                                                                                                | no       |             |
| themeId     | property | `string \| undefined`                                                                                                                                                                                                | no       |             |

## ButtonProps

Kind: `type`
Module: `src/components/button/types.ts`
Source: `src/components/button/types.ts:7:1`

### Members

| Name               | Kind     | Type                                                                                                                                          | Required | Description |
| ------------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| accessibilityRole  | property | `AccessibilityRole \| undefined`                                                                                                              | no       |             |
| accessibilityState | property | `AccessibilityState \| undefined`                                                                                                             | no       |             |
| accessible         | property | `boolean \| undefined`                                                                                                                        | no       |             |
| alignSelf          | property | `Responsive<"auto" \| import("/Users/a_rtiphishl_e/git/zora/node_modules/react-native/types/index").FlexAlignType \| undefined>`              | no       |             |
| bg                 | property | `Responsive<ColorValue> \| undefined`                                                                                                         | no       |             |
| borderColor        | property | `Responsive<ColorValue> \| undefined`                                                                                                         | no       |             |
| borderWidth        | property | `Responsive<number> \| undefined`                                                                                                             | no       |             |
| bottom             | property | `Responsive<number> \| undefined`                                                                                                             | no       |             |
| children           | property | `React.ReactNode`                                                                                                                             | no       |             |
| color              | property | `"primary" \| "secondary" \| "tertiary" \| "quaternary" \| "neutral" \| "success" \| "warning" \| "error" \| "info" \| "danger" \| undefined` | no       |             |
| disabled           | property | `boolean \| undefined`                                                                                                                        | no       |             |
| flex               | property | `Responsive<number> \| undefined`                                                                                                             | no       |             |
| flexBasis          | property | `Responsive<string \| number> \| undefined`                                                                                                   | no       |             |
| flexGrow           | property | `Responsive<number> \| undefined`                                                                                                             | no       |             |
| flexShrink         | property | `Responsive<number> \| undefined`                                                                                                             | no       |             |
| fullWidth          | property | `boolean \| undefined`                                                                                                                        | no       |             |
| height             | property | `Responsive<string \| number> \| undefined`                                                                                                   | no       |             |
| leadingIcon        | property | `ButtonIconSpec \| undefined`                                                                                                                 | no       |             |
| left               | property | `Responsive<number> \| undefined`                                                                                                             | no       |             |
| loading            | property | `boolean \| undefined`                                                                                                                        | no       |             |
| m                  | property | `Responsive<SpaceValue> \| undefined`                                                                                                         | no       |             |
| maxHeight          | property | `Responsive<string \| number> \| undefined`                                                                                                   | no       |             |
| maxWidth           | property | `Responsive<string \| number> \| undefined`                                                                                                   | no       |             |
| mb                 | property | `Responsive<SpaceValue> \| undefined`                                                                                                         | no       |             |
| minHeight          | property | `Responsive<string \| number> \| undefined`                                                                                                   | no       |             |
| minWidth           | property | `Responsive<string \| number> \| undefined`                                                                                                   | no       |             |
| ml                 | property | `Responsive<SpaceValue> \| undefined`                                                                                                         | no       |             |
| mode               | property | `ZoraThemeMode \| undefined`                                                                                                                  | no       |             |
| mr                 | property | `Responsive<SpaceValue> \| undefined`                                                                                                         | no       |             |
| mt                 | property | `Responsive<SpaceValue> \| undefined`                                                                                                         | no       |             |
| mx                 | property | `Responsive<SpaceValue> \| undefined`                                                                                                         | no       |             |
| my                 | property | `Responsive<SpaceValue> \| undefined`                                                                                                         | no       |             |
| onLongPress        | property | `((event: GestureResponderEvent) => void) \| undefined`                                                                                       | no       |             |
| onPress            | property | `((event: GestureResponderEvent) => void) \| undefined`                                                                                       | no       |             |
| opacity            | property | `Responsive<number> \| undefined`                                                                                                             | no       |             |
| overflow           | property | `Responsive<"visible" \| "hidden" \| "scroll" \| undefined>`                                                                                  | no       |             |
| p                  | property | `Responsive<SpaceValue> \| undefined`                                                                                                         | no       |             |
| pb                 | property | `Responsive<SpaceValue> \| undefined`                                                                                                         | no       |             |
| pl                 | property | `Responsive<SpaceValue> \| undefined`                                                                                                         | no       |             |
| position           | property | `Responsive<"absolute" \| "relative" \| "static" \| undefined>`                                                                               | no       |             |
| pr                 | property | `Responsive<SpaceValue> \| undefined`                                                                                                         | no       |             |
| pt                 | property | `Responsive<SpaceValue> \| undefined`                                                                                                         | no       |             |
| px                 | property | `Responsive<SpaceValue> \| undefined`                                                                                                         | no       |             |
| py                 | property | `Responsive<SpaceValue> \| undefined`                                                                                                         | no       |             |
| radius             | property | `Responsive<RadiusValue> \| undefined`                                                                                                        | no       |             |
| right              | property | `Responsive<number> \| undefined`                                                                                                             | no       |             |
| size               | property | `ZoraControlSize \| undefined`                                                                                                                | no       |             |
| testID             | property | `string \| undefined`                                                                                                                         | no       |             |
| themeId            | property | `string \| undefined`                                                                                                                         | no       |             |
| top                | property | `Responsive<number> \| undefined`                                                                                                             | no       |             |
| trailingIcon       | property | `ButtonIconSpec \| undefined`                                                                                                                 | no       |             |
| variant            | property | `ZoraButtonVariant \| undefined`                                                                                                              | no       |             |
| width              | property | `Responsive<string \| number> \| undefined`                                                                                                   | no       |             |
| zIndex             | property | `Responsive<number> \| undefined`                                                                                                             | no       |             |

## CameraPermissionStatus

Kind: `unknown`
Module: `src/patterns/scanner/types.ts`
Source: `src/patterns/scanner/types.ts:6:1`

## CameraPermissionView

Kind: `value`
Module: `src/patterns/scanner/CameraPermissionView.tsx`
Source: `src/patterns/scanner/CameraPermissionView.tsx:108:14`

ZORA-owned camera permission state for scanner flows.

Native permission APIs stay in app adapters. This component renders the
request, denied, requesting, and manual-entry surfaces consistently.

## CameraPermissionViewProps

Kind: `type`
Module: `src/patterns/scanner/types.ts`
Source: `src/patterns/scanner/types.ts:19:1`

### Members

| Name                   | Kind     | Type                                                      | Required | Description |
| ---------------------- | -------- | --------------------------------------------------------- | -------- | ----------- |
| deniedLabel            | property | `React.ReactNode`                                         | no       |             |
| description            | property | `React.ReactNode`                                         | no       |             |
| manualEntryButtonProps | property | `Omit<ButtonProps, "onPress" \| "children"> \| undefined` | no       |             |
| manualEntryLabel       | property | `React.ReactNode`                                         | no       |             |
| mode                   | property | `ZoraThemeMode \| undefined`                              | no       |             |
| onManualEntry          | property | `(() => void \| Promise<void>) \| undefined`              | no       |             |
| onRequestPermission    | property | `(() => void \| Promise<void>) \| undefined`              | no       |             |
| requestButtonProps     | property | `Omit<ButtonProps, "onPress" \| "children"> \| undefined` | no       |             |
| requestLabel           | property | `React.ReactNode`                                         | no       |             |
| status                 | property | `"unknown" \| "requesting" \| "denied"`                   | yes      |             |
| testID                 | property | `string \| undefined`                                     | no       |             |
| themeId                | property | `string \| undefined`                                     | no       |             |
| title                  | property | `React.ReactNode`                                         | no       |             |

## Card

Kind: `value`
Module: `src/components/card/Card.tsx`
Source: `src/components/card/Card.tsx:84:14`

Structured content container with built-in heading, description, actions, and footer slots.

Use `Card` for reusable content blocks that should inherit ZORA spacing,
radius, tone, and responsive header layout without hand-assembling primitives.

## CardProps

Kind: `type`
Module: `src/components/card/types.ts`
Source: `src/components/card/types.ts:7:1`

### Members

| Name               | Kind     | Type                                                                                                                             | Required | Description |
| ------------------ | -------- | -------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| accessibilityLabel | property | `string \| undefined`                                                                                                            | no       |             |
| accessibilityRole  | property | `import("/Users/a_rtiphishl_e/git/zora/node_modules/react-native/types/index").AccessibilityRole \| undefined`                   | no       |             |
| accessibilityState | property | `import("/Users/a_rtiphishl_e/git/zora/node_modules/react-native/types/index").AccessibilityState \| undefined`                  | no       |             |
| accessible         | property | `boolean \| undefined`                                                                                                           | no       |             |
| actions            | property | `React.ReactNode`                                                                                                                | no       |             |
| alignSelf          | property | `Responsive<"auto" \| import("/Users/a_rtiphishl_e/git/zora/node_modules/react-native/types/index").FlexAlignType \| undefined>` | no       |             |
| bottom             | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| children           | property | `React.ReactNode`                                                                                                                | no       |             |
| compact            | property | `boolean \| undefined`                                                                                                           | no       |             |
| description        | property | `React.ReactNode`                                                                                                                | no       |             |
| disabled           | property | `boolean \| undefined`                                                                                                           | no       |             |
| eyebrow            | property | `React.ReactNode`                                                                                                                | no       |             |
| flex               | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| flexBasis          | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| flexGrow           | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| flexShrink         | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| footer             | property | `React.ReactNode`                                                                                                                | no       |             |
| height             | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| left               | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| m                  | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| maxHeight          | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| maxWidth           | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| mb                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| minHeight          | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| minWidth           | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| ml                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| mode               | property | `ZoraThemeMode \| undefined`                                                                                                     | no       |             |
| mr                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| mt                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| mx                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| my                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| onPress            | property | `(() => void) \| undefined`                                                                                                      | no       |             |
| opacity            | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| overflow           | property | `Responsive<"visible" \| "hidden" \| "scroll" \| undefined>`                                                                     | no       |             |
| pb                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| pl                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| pointerEvents      | property | `"none" \| "auto" \| "box-none" \| "box-only" \| undefined`                                                                      | no       |             |
| position           | property | `Responsive<"absolute" \| "relative" \| "static" \| undefined>`                                                                  | no       |             |
| pr                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| pt                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| px                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| py                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| right              | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| style              | property | `StyleProp<ViewStyle>`                                                                                                           | no       |             |
| testID             | property | `string \| undefined`                                                                                                            | no       |             |
| themeId            | property | `string \| undefined`                                                                                                            | no       |             |
| title              | property | `React.ReactNode`                                                                                                                | no       |             |
| tone               | property | `ZoraCardTone \| undefined`                                                                                                      | no       |             |
| top                | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| width              | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| zIndex             | property | `Responsive<number> \| undefined`                                                                                                | no       |             |

## Center

Kind: `value`
Module: `src/foundation/Center.tsx`
Source: `src/foundation/Center.tsx:21:14`

Centers children horizontally and vertically within the available space.

## CenterProps

Kind: `type`
Module: `src/foundation/Center.tsx`
Source: `src/foundation/Center.tsx:10:1`

### Members

| Name               | Kind     | Type                                                                                                                             | Required | Description |
| ------------------ | -------- | -------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| accessibilityLabel | property | `string \| undefined`                                                                                                            | no       |             |
| accessibilityRole  | property | `import("/Users/a_rtiphishl_e/git/zora/node_modules/react-native/types/index").AccessibilityRole \| undefined`                   | no       |             |
| accessibilityState | property | `import("/Users/a_rtiphishl_e/git/zora/node_modules/react-native/types/index").AccessibilityState \| undefined`                  | no       |             |
| accessible         | property | `boolean \| undefined`                                                                                                           | no       |             |
| alignSelf          | property | `Responsive<"auto" \| import("/Users/a_rtiphishl_e/git/zora/node_modules/react-native/types/index").FlexAlignType \| undefined>` | no       |             |
| axis               | property | `"horizontal" \| "vertical" \| "both" \| undefined`                                                                              | no       |             |
| bg                 | property | `Responsive<ColorValue> \| undefined`                                                                                            | no       |             |
| borderColor        | property | `Responsive<ColorValue> \| undefined`                                                                                            | no       |             |
| borderWidth        | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| bottom             | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| children           | property | `React.ReactNode`                                                                                                                | no       |             |
| flex               | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| flexBasis          | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| flexGrow           | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| flexShrink         | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| height             | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| left               | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| m                  | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| maxHeight          | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| maxWidth           | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| mb                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| minHeight          | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| minWidth           | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| ml                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| mode               | property | `ZoraThemeMode \| undefined`                                                                                                     | no       |             |
| mr                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| mt                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| mx                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| my                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| opacity            | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| overflow           | property | `Responsive<"visible" \| "hidden" \| "scroll" \| undefined>`                                                                     | no       |             |
| p                  | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| pb                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| pl                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| pointerEvents      | property | `"none" \| "auto" \| "box-none" \| "box-only" \| undefined`                                                                      | no       |             |
| position           | property | `Responsive<"absolute" \| "relative" \| "static" \| undefined>`                                                                  | no       |             |
| pr                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| pt                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| px                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| py                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| radius             | property | `Responsive<RadiusValue> \| undefined`                                                                                           | no       |             |
| right              | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| style              | property | `StyleProp<ViewStyle>`                                                                                                           | no       |             |
| testID             | property | `string \| undefined`                                                                                                            | no       |             |
| themeId            | property | `string \| undefined`                                                                                                            | no       |             |
| top                | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| width              | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| zIndex             | property | `Responsive<number> \| undefined`                                                                                                | no       |             |

## ChatListAvatar

Kind: `type`
Module: `src/patterns/chat-list-item/types.ts`
Source: `src/patterns/chat-list-item/types.ts:8:1`

### Members

| Name     | Kind     | Type                                                                                                                                          | Required | Description |
| -------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| color    | property | `"primary" \| "secondary" \| "tertiary" \| "quaternary" \| "neutral" \| "success" \| "warning" \| "error" \| "info" \| "danger" \| undefined` | no       |             |
| initials | property | `string \| undefined`                                                                                                                         | no       |             |
| label    | property | `string \| undefined`                                                                                                                         | no       |             |
| name     | property | `string \| undefined`                                                                                                                         | no       |             |
| shape    | property | `AvatarShape \| undefined`                                                                                                                    | no       |             |
| size     | property | `AvatarSize \| undefined`                                                                                                                     | no       |             |
| source   | property | `ImageSourcePropType \| undefined`                                                                                                            | no       |             |

## ChatListItem

Kind: `value`
Module: `src/patterns/chat-list-item/ChatListItem.tsx`
Source: `src/patterns/chat-list-item/ChatListItem.tsx:225:14`

Chat-style list row with avatar, title, preview text, and unread indicators.

## ChatListItemProps

Kind: `type`
Module: `src/patterns/chat-list-item/types.ts`
Source: `src/patterns/chat-list-item/types.ts:18:1`

### Members

| Name               | Kind     | Type                          | Required | Description |
| ------------------ | -------- | ----------------------------- | -------- | ----------- |
| accessibilityLabel | property | `string \| undefined`         | no       |             |
| avatar             | property | `ChatListAvatar \| undefined` | no       |             |
| compact            | property | `boolean \| undefined`        | no       |             |
| disabled           | property | `boolean \| undefined`        | no       |             |
| leading            | property | `React.ReactNode`             | no       |             |
| meta               | property | `React.ReactNode`             | no       |             |
| mode               | property | `ZoraThemeMode \| undefined`  | no       |             |
| onPress            | property | `(() => void) \| undefined`   | no       |             |
| preview            | property | `React.ReactNode`             | no       |             |
| selected           | property | `boolean \| undefined`        | no       |             |
| testID             | property | `string \| undefined`         | no       |             |
| themeId            | property | `string \| undefined`         | no       |             |
| timestamp          | property | `React.ReactNode`             | no       |             |
| title              | property | `React.ReactNode`             | yes      |             |
| trailing           | property | `React.ReactNode`             | no       |             |
| unread             | property | `boolean \| undefined`        | no       |             |
| unreadCount        | property | `React.ReactNode`             | no       |             |

## Checkbox

Kind: `value`
Module: `src/components/checkbox/Checkbox.tsx`
Source: `src/components/checkbox/Checkbox.tsx:16:14`

Binary selection control for toggling a value on or off.

## CheckboxGroup

Kind: `value`
Module: `src/components/checkbox/CheckboxGroup.tsx`
Source: `src/components/checkbox/CheckboxGroup.tsx:63:14`

Renders a group of checkboxes for multi-select values.

## CheckboxGroupOption

Kind: `type`
Module: `src/components/checkbox/types.ts`
Source: `src/components/checkbox/types.ts:9:1`

### Members

| Name        | Kind     | Type                   | Required | Description |
| ----------- | -------- | ---------------------- | -------- | ----------- |
| description | property | `React.ReactNode`      | no       |             |
| disabled    | property | `boolean \| undefined` | no       |             |
| label       | property | `React.ReactNode`      | yes      |             |
| testID      | property | `string \| undefined`  | no       |             |
| value       | property | `TValue`               | yes      |             |

## CheckboxGroupProps

Kind: `type`
Module: `src/components/checkbox/types.ts`
Source: `src/components/checkbox/types.ts:17:1`

### Members

| Name          | Kind     | Type                                                                                                                                          | Required | Description |
| ------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| color         | property | `"primary" \| "secondary" \| "tertiary" \| "quaternary" \| "neutral" \| "success" \| "warning" \| "error" \| "info" \| "danger" \| undefined` | no       |             |
| disabled      | property | `boolean \| undefined`                                                                                                                        | no       |             |
| gap           | property | `"xs" \| "s" \| "m" \| "l" \| undefined`                                                                                                      | no       |             |
| invalid       | property | `boolean \| undefined`                                                                                                                        | no       |             |
| mode          | property | `ZoraThemeMode \| undefined`                                                                                                                  | no       |             |
| onValueChange | property | `(value: TValue[]) => void`                                                                                                                   | yes      |             |
| options       | property | `readonly CheckboxGroupOption<TValue>[]`                                                                                                      | yes      |             |
| orientation   | property | `"horizontal" \| "vertical" \| undefined`                                                                                                     | no       |             |
| readOnly      | property | `boolean \| undefined`                                                                                                                        | no       |             |
| size          | property | `ControlSize \| undefined`                                                                                                                    | no       |             |
| testID        | property | `string \| undefined`                                                                                                                         | no       |             |
| themeId       | property | `string \| undefined`                                                                                                                         | no       |             |
| value         | property | `readonly TValue[]`                                                                                                                           | yes      |             |

## CheckboxProps

Kind: `type`
Module: `src/components/checkbox/types.ts`
Source: `src/components/checkbox/types.ts:6:1`

### Members

| Name               | Kind     | Type                                                                                                                                          | Required | Description |
| ------------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| accessibilityLabel | property | `string \| undefined`                                                                                                                         | no       |             |
| accessible         | property | `boolean \| undefined`                                                                                                                        | no       |             |
| alignSelf          | property | `Responsive<"auto" \| import("/Users/a_rtiphishl_e/git/zora/node_modules/react-native/types/index").FlexAlignType \| undefined>`              | no       |             |
| bg                 | property | `Responsive<ColorValue> \| undefined`                                                                                                         | no       |             |
| borderColor        | property | `Responsive<ColorValue> \| undefined`                                                                                                         | no       |             |
| borderWidth        | property | `Responsive<number> \| undefined`                                                                                                             | no       |             |
| bottom             | property | `Responsive<number> \| undefined`                                                                                                             | no       |             |
| checked            | property | `boolean \| undefined`                                                                                                                        | no       |             |
| children           | property | `React.ReactNode`                                                                                                                             | no       |             |
| color              | property | `"primary" \| "secondary" \| "tertiary" \| "quaternary" \| "neutral" \| "success" \| "warning" \| "error" \| "info" \| "danger" \| undefined` | no       |             |
| defaultChecked     | property | `boolean \| undefined`                                                                                                                        | no       |             |
| disabled           | property | `boolean \| undefined`                                                                                                                        | no       |             |
| flex               | property | `Responsive<number> \| undefined`                                                                                                             | no       |             |
| flexBasis          | property | `Responsive<string \| number> \| undefined`                                                                                                   | no       |             |
| flexGrow           | property | `Responsive<number> \| undefined`                                                                                                             | no       |             |
| flexShrink         | property | `Responsive<number> \| undefined`                                                                                                             | no       |             |
| height             | property | `Responsive<string \| number> \| undefined`                                                                                                   | no       |             |
| invalid            | property | `boolean \| undefined`                                                                                                                        | no       |             |
| left               | property | `Responsive<number> \| undefined`                                                                                                             | no       |             |
| m                  | property | `Responsive<SpaceValue> \| undefined`                                                                                                         | no       |             |
| maxHeight          | property | `Responsive<string \| number> \| undefined`                                                                                                   | no       |             |
| maxWidth           | property | `Responsive<string \| number> \| undefined`                                                                                                   | no       |             |
| mb                 | property | `Responsive<SpaceValue> \| undefined`                                                                                                         | no       |             |
| minHeight          | property | `Responsive<string \| number> \| undefined`                                                                                                   | no       |             |
| minWidth           | property | `Responsive<string \| number> \| undefined`                                                                                                   | no       |             |
| ml                 | property | `Responsive<SpaceValue> \| undefined`                                                                                                         | no       |             |
| mode               | property | `ZoraThemeMode \| undefined`                                                                                                                  | no       |             |
| mr                 | property | `Responsive<SpaceValue> \| undefined`                                                                                                         | no       |             |
| mt                 | property | `Responsive<SpaceValue> \| undefined`                                                                                                         | no       |             |
| mx                 | property | `Responsive<SpaceValue> \| undefined`                                                                                                         | no       |             |
| my                 | property | `Responsive<SpaceValue> \| undefined`                                                                                                         | no       |             |
| onCheckedChange    | property | `((checked: boolean) => void) \| undefined`                                                                                                   | no       |             |
| onLongPress        | property | `((event: GestureResponderEvent) => void) \| undefined`                                                                                       | no       |             |
| opacity            | property | `Responsive<number> \| undefined`                                                                                                             | no       |             |
| overflow           | property | `Responsive<"visible" \| "hidden" \| "scroll" \| undefined>`                                                                                  | no       |             |
| p                  | property | `Responsive<SpaceValue> \| undefined`                                                                                                         | no       |             |
| pb                 | property | `Responsive<SpaceValue> \| undefined`                                                                                                         | no       |             |
| pl                 | property | `Responsive<SpaceValue> \| undefined`                                                                                                         | no       |             |
| position           | property | `Responsive<"absolute" \| "relative" \| "static" \| undefined>`                                                                               | no       |             |
| pr                 | property | `Responsive<SpaceValue> \| undefined`                                                                                                         | no       |             |
| pt                 | property | `Responsive<SpaceValue> \| undefined`                                                                                                         | no       |             |
| px                 | property | `Responsive<SpaceValue> \| undefined`                                                                                                         | no       |             |
| py                 | property | `Responsive<SpaceValue> \| undefined`                                                                                                         | no       |             |
| radius             | property | `Responsive<RadiusValue> \| undefined`                                                                                                        | no       |             |
| readOnly           | property | `boolean \| undefined`                                                                                                                        | no       |             |
| right              | property | `Responsive<number> \| undefined`                                                                                                             | no       |             |
| size               | property | `ControlSize \| undefined`                                                                                                                    | no       |             |
| testID             | property | `string \| undefined`                                                                                                                         | no       |             |
| themeId            | property | `string \| undefined`                                                                                                                         | no       |             |
| top                | property | `Responsive<number> \| undefined`                                                                                                             | no       |             |
| width              | property | `Responsive<string \| number> \| undefined`                                                                                                   | no       |             |
| zIndex             | property | `Responsive<number> \| undefined`                                                                                                             | no       |             |

## Chip

Kind: `value`
Module: `src/components/chip/Chip.tsx`
Source: `src/components/chip/Chip.tsx:97:14`

Compact pill-like control for filters, tags, and quick selections.

## ChipGroup

Kind: `value`
Module: `src/components/chip-group/ChipGroup.tsx`
Source: `src/components/chip-group/ChipGroup.tsx:69:14`

Renders a row or wrap layout of `Chip` items.

## ChipGroupItem

Kind: `type`
Module: `src/components/chip-group/types.ts`
Source: `src/components/chip-group/types.ts:7:1`

### Members

| Name     | Kind     | Type                          | Required | Description |
| -------- | -------- | ----------------------------- | -------- | ----------- |
| disabled | property | `boolean \| undefined`        | no       |             |
| icon     | property | `ButtonIconSpec \| undefined` | no       |             |
| label    | property | `React.ReactNode`             | yes      |             |
| testID   | property | `string \| undefined`         | no       |             |
| value    | property | `TValue`                      | yes      |             |

## ChipGroupProps

Kind: `unknown`
Module: `src/components/chip-group/types.ts`
Source: `src/components/chip-group/types.ts:35:1`

## ChipProps

Kind: `type`
Module: `src/components/chip/types.ts`
Source: `src/components/chip/types.ts:7:1`

### Members

| Name     | Kind     | Type                                                                                                                                          | Required | Description |
| -------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| children | property | `React.ReactNode`                                                                                                                             | yes      |             |
| color    | property | `"primary" \| "secondary" \| "tertiary" \| "quaternary" \| "neutral" \| "success" \| "warning" \| "error" \| "info" \| "danger" \| undefined` | no       |             |
| disabled | property | `boolean \| undefined`                                                                                                                        | no       |             |
| icon     | property | `ButtonIconSpec \| undefined`                                                                                                                 | no       |             |
| mode     | property | `ZoraThemeMode \| undefined`                                                                                                                  | no       |             |
| onPress  | property | `(() => void) \| undefined`                                                                                                                   | no       |             |
| selected | property | `boolean \| undefined`                                                                                                                        | no       |             |
| size     | property | `ZoraControlSize \| undefined`                                                                                                                | no       |             |
| testID   | property | `string \| undefined`                                                                                                                         | no       |             |
| themeId  | property | `string \| undefined`                                                                                                                         | no       |             |

## CollectionEditor

Kind: `value`
Module: `src/patterns/collection-editor/CollectionEditor.tsx`
Source: `src/patterns/collection-editor/CollectionEditor.tsx:111:14`

Editor pattern for adding, removing, and reordering a collection of items.

## CollectionEditorProps

Kind: `type`
Module: `src/patterns/collection-editor/types.ts`
Source: `src/patterns/collection-editor/types.ts:15:1`

### Members

| Name        | Kind     | Type                                                                 | Required | Description |
| ----------- | -------- | -------------------------------------------------------------------- | -------- | ----------- |
| addLabel    | property | `React.ReactNode`                                                    | no       |             |
| description | property | `React.ReactNode`                                                    | no       |             |
| disabled    | property | `boolean \| undefined`                                               | no       |             |
| emptyLabel  | property | `React.ReactNode`                                                    | no       |             |
| items       | property | `readonly TItem[]`                                                   | yes      |             |
| mode        | property | `ZoraThemeMode \| undefined`                                         | no       |             |
| onAdd       | property | `(() => void) \| undefined`                                          | no       |             |
| onMove      | property | `((from: number, to: number) => void) \| undefined`                  | no       |             |
| onRemove    | property | `((index: number) => void) \| undefined`                             | no       |             |
| renderItem  | property | `(props: CollectionEditorRenderItemProps<TItem>) => React.ReactNode` | yes      |             |
| testID      | property | `string \| undefined`                                                | no       |             |
| themeId     | property | `string \| undefined`                                                | no       |             |
| title       | property | `React.ReactNode`                                                    | no       |             |

## CollectionEditorRenderItemProps

Kind: `type`
Module: `src/patterns/collection-editor/types.ts`
Source: `src/patterns/collection-editor/types.ts:3:1`

### Members

| Name        | Kind     | Type         | Required | Description |
| ----------- | -------- | ------------ | -------- | ----------- |
| canMoveDown | property | `boolean`    | yes      |             |
| canMoveUp   | property | `boolean`    | yes      |             |
| index       | property | `number`     | yes      |             |
| item        | property | `TItem`      | yes      |             |
| moveDown    | property | `() => void` | yes      |             |
| moveUp      | property | `() => void` | yes      |             |
| remove      | property | `() => void` | yes      |             |

## ConfirmDialog

Kind: `value`
Module: `src/patterns/confirm-dialog/ConfirmDialog.tsx`
Source: `src/patterns/confirm-dialog/ConfirmDialog.tsx:56:14`

Confirmation dialog pattern with cancel/confirm actions.

## ConfirmDialogProps

Kind: `type`
Module: `src/patterns/confirm-dialog/types.ts`
Source: `src/patterns/confirm-dialog/types.ts:6:1`

### Members

| Name            | Kind     | Type                                                                                                                                          | Required | Description |
| --------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| busy            | property | `boolean \| undefined`                                                                                                                        | no       |             |
| cancelLabel     | property | `React.ReactNode`                                                                                                                             | no       |             |
| children        | property | `React.ReactNode`                                                                                                                             | no       |             |
| closeOnBackdrop | property | `boolean \| undefined`                                                                                                                        | no       |             |
| confirmColor    | property | `"primary" \| "secondary" \| "tertiary" \| "quaternary" \| "neutral" \| "success" \| "warning" \| "error" \| "info" \| "danger" \| undefined` | no       |             |
| confirmLabel    | property | `React.ReactNode`                                                                                                                             | no       |             |
| confirmVariant  | property | `ZoraButtonVariant \| undefined`                                                                                                              | no       |             |
| description     | property | `React.ReactNode`                                                                                                                             | no       |             |
| mode            | property | `ZoraThemeMode \| undefined`                                                                                                                  | no       |             |
| onCancel        | property | `(() => void) \| undefined`                                                                                                                   | no       |             |
| onConfirm       | property | `(() => void) \| undefined`                                                                                                                   | no       |             |
| testID          | property | `string \| undefined`                                                                                                                         | no       |             |
| themeId         | property | `string \| undefined`                                                                                                                         | no       |             |
| title           | property | `React.ReactNode`                                                                                                                             | yes      |             |
| visible         | property | `boolean`                                                                                                                                     | yes      |             |

## Container

Kind: `value`
Module: `src/foundation/Container.tsx`
Source: `src/foundation/Container.tsx:22:14`

Constrains page content to semantic widths with responsive padding.

## ContainerProps

Kind: `type`
Module: `src/foundation/Container.tsx`
Source: `src/foundation/Container.tsx:10:1`

### Members

| Name               | Kind     | Type                                                                                                                             | Required | Description |
| ------------------ | -------- | -------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| accessibilityLabel | property | `string \| undefined`                                                                                                            | no       |             |
| accessibilityRole  | property | `import("/Users/a_rtiphishl_e/git/zora/node_modules/react-native/types/index").AccessibilityRole \| undefined`                   | no       |             |
| accessibilityState | property | `import("/Users/a_rtiphishl_e/git/zora/node_modules/react-native/types/index").AccessibilityState \| undefined`                  | no       |             |
| accessible         | property | `boolean \| undefined`                                                                                                           | no       |             |
| alignSelf          | property | `Responsive<"auto" \| import("/Users/a_rtiphishl_e/git/zora/node_modules/react-native/types/index").FlexAlignType \| undefined>` | no       |             |
| bg                 | property | `Responsive<ColorValue> \| undefined`                                                                                            | no       |             |
| borderColor        | property | `Responsive<ColorValue> \| undefined`                                                                                            | no       |             |
| borderWidth        | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| bottom             | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| children           | property | `React.ReactNode`                                                                                                                | no       |             |
| flex               | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| flexBasis          | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| flexGrow           | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| flexShrink         | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| height             | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| left               | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| m                  | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| maxHeight          | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| maxWidth           | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| mb                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| minHeight          | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| minWidth           | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| ml                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| mode               | property | `ZoraThemeMode \| undefined`                                                                                                     | no       |             |
| mr                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| mt                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| mx                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| my                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| opacity            | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| overflow           | property | `Responsive<"visible" \| "hidden" \| "scroll" \| undefined>`                                                                     | no       |             |
| p                  | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| pb                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| pl                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| pointerEvents      | property | `"none" \| "auto" \| "box-none" \| "box-only" \| undefined`                                                                      | no       |             |
| position           | property | `Responsive<"absolute" \| "relative" \| "static" \| undefined>`                                                                  | no       |             |
| pr                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| pt                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| px                 | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| py                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| radius             | property | `Responsive<RadiusValue> \| undefined`                                                                                           | no       |             |
| right              | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| style              | property | `StyleProp<ViewStyle>`                                                                                                           | no       |             |
| testID             | property | `string \| undefined`                                                                                                            | no       |             |
| themeId            | property | `string \| undefined`                                                                                                            | no       |             |
| top                | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| width              | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| zIndex             | property | `Responsive<number> \| undefined`                                                                                                | no       |             |

## createZoraThemeConfig

Kind: `function`
Module: `src/theme/createZoraThemeConfig.ts`
Source: `src/theme/createZoraThemeConfig.ts:7:1`

### Signatures

- `(theme?: ZoraTheme) => ThemeConfig`
  - theme: `ZoraTheme` (optional)
  - returns: `ThemeConfig`

## DataTable

Kind: `value`
Module: `src/components/data-table/DataTable.tsx`
Source: `src/components/data-table/DataTable.tsx:391:14`

Displays structured tabular data with responsive desktop/mobile layouts.

## DataTableCellContext

Kind: `type`
Module: `src/components/data-table/types.ts`
Source: `src/components/data-table/types.ts:16:1`

### Members

| Name     | Kind     | Type                    | Required | Description |
| -------- | -------- | ----------------------- | -------- | ----------- |
| column   | property | `DataTableColumn<TRow>` | yes      |             |
| row      | property | `TRow`                  | yes      |             |
| rowIndex | property | `number`                | yes      |             |
| value    | property | `unknown`               | yes      |             |

## DataTableColumn

Kind: `type`
Module: `src/components/data-table/types.ts`
Source: `src/components/data-table/types.ts:23:1`

### Members

| Name       | Kind     | Type                                                                      | Required | Description |
| ---------- | -------- | ------------------------------------------------------------------------- | -------- | ----------- |
| accessor   | property | `keyof TRow \| undefined`                                                 | no       |             |
| align      | property | `DataTableColumnAlign \| undefined`                                       | no       |             |
| header     | property | `React.ReactNode`                                                         | yes      |             |
| id         | property | `string`                                                                  | yes      |             |
| minWidth   | property | `number \| undefined`                                                     | no       |             |
| renderCell | property | `((context: DataTableCellContext<TRow>) => React.ReactNode) \| undefined` | no       |             |
| sortable   | property | `boolean \| undefined`                                                    | no       |             |
| width      | property | `number \| undefined`                                                     | no       |             |

## DataTableColumnAlign

Kind: `unknown`
Module: `src/components/data-table/types.ts`
Source: `src/components/data-table/types.ts:7:1`

## DataTableDensity

Kind: `unknown`
Module: `src/components/data-table/types.ts`
Source: `src/components/data-table/types.ts:8:1`

## DataTableProps

Kind: `type`
Module: `src/components/data-table/types.ts`
Source: `src/components/data-table/types.ts:44:1`

### Members

| Name             | Kind     | Type                                                                               | Required | Description |
| ---------------- | -------- | ---------------------------------------------------------------------------------- | -------- | ----------- |
| columns          | property | `readonly DataTableColumn<TRow>[]`                                                 | yes      |             |
| density          | property | `DataTableDensity \| undefined`                                                    | no       |             |
| emptyDescription | property | `React.ReactNode`                                                                  | no       |             |
| emptyTitle       | property | `React.ReactNode`                                                                  | no       |             |
| loading          | property | `boolean \| undefined`                                                             | no       |             |
| loadingRows      | property | `number \| undefined`                                                              | no       |             |
| mode             | property | `ZoraThemeMode \| undefined`                                                       | no       |             |
| onSortChange     | property | `((sort: DataTableSortState) => void) \| undefined`                                | no       |             |
| rowActions       | property | `((row: TRow, index: number) => readonly DataTableRowAction<TRow>[]) \| undefined` | no       |             |
| rowId            | property | `(row: TRow, index: number) => string`                                             | yes      |             |
| rows             | property | `readonly TRow[]`                                                                  | yes      |             |
| sort             | property | `DataTableSortState \| undefined`                                                  | no       |             |
| testID           | property | `string \| undefined`                                                              | no       |             |
| themeId          | property | `string \| undefined`                                                              | no       |             |

## DataTableRowAction

Kind: `type`
Module: `src/components/data-table/types.ts`
Source: `src/components/data-table/types.ts:34:1`

### Members

| Name        | Kind     | Type                                                                                                               | Required | Description |
| ----------- | -------- | ------------------------------------------------------------------------------------------------------------------ | -------- | ----------- |
| description | property | `React.ReactNode`                                                                                                  | no       |             |
| disabled    | property | `boolean \| undefined`                                                                                             | no       |             |
| icon        | property | `ButtonIconSpec \| undefined`                                                                                      | no       |             |
| id          | property | `string`                                                                                                           | yes      |             |
| intent      | property | `import("/Users/a_rtiphishl_e/git/zora/node_modules/@ankhorage/surface/dist/index").MenuActionIntent \| undefined` | no       |             |
| onPress     | property | `((row: TRow) => void) \| undefined`                                                                               | no       |             |
| title       | property | `React.ReactNode`                                                                                                  | yes      |             |

## DataTableSortDirection

Kind: `unknown`
Module: `src/components/data-table/types.ts`
Source: `src/components/data-table/types.ts:9:1`

## DataTableSortState

Kind: `type`
Module: `src/components/data-table/types.ts`
Source: `src/components/data-table/types.ts:11:1`

### Members

| Name      | Kind     | Type                     | Required | Description |
| --------- | -------- | ------------------------ | -------- | ----------- |
| columnId  | property | `string`                 | yes      |             |
| direction | property | `DataTableSortDirection` | yes      |             |

## DatePicker

Kind: `value`
Module: `src/components/date-picker/DatePicker.tsx`
Source: `src/components/date-picker/DatePicker.tsx:245:14`

Date input control with calendar selection and formatted display value.

## DatePickerProps

Kind: `type`
Module: `src/components/date-picker/types.ts`
Source: `src/components/date-picker/types.ts:7:1`

### Members

| Name          | Kind     | Type                                              | Required | Description |
| ------------- | -------- | ------------------------------------------------- | -------- | ----------- |
| description   | property | `React.ReactNode`                                 | no       |             |
| disabled      | property | `boolean \| undefined`                            | no       |             |
| error         | property | `React.ReactNode`                                 | no       |             |
| formatDate    | property | `((value: Date) => React.ReactNode) \| undefined` | no       |             |
| label         | property | `React.ReactNode`                                 | no       |             |
| maxDate       | property | `Date \| undefined`                               | no       |             |
| minDate       | property | `Date \| undefined`                               | no       |             |
| mode          | property | `ZoraThemeMode \| undefined`                      | no       |             |
| onValueChange | property | `((value: DatePickerValue) => void) \| undefined` | no       |             |
| placeholder   | property | `React.ReactNode`                                 | no       |             |
| required      | property | `boolean \| undefined`                            | no       |             |
| testID        | property | `string \| undefined`                             | no       |             |
| themeId       | property | `string \| undefined`                             | no       |             |
| value         | property | `DatePickerValue`                                 | yes      |             |

## DatePickerValue

Kind: `unknown`
Module: `src/components/date-picker/types.ts`
Source: `src/components/date-picker/types.ts:5:1`

## DEFAULT_OAUTH_PROVIDER_ICONS

Kind: `value`
Module: `src/patterns/auth/oauthProviders.ts`
Source: `src/patterns/auth/oauthProviders.ts:3:14`

## DisclosureSection

Kind: `value`
Module: `src/patterns/disclosure-section/DisclosureSection.tsx`
Source: `src/patterns/disclosure-section/DisclosureSection.tsx:117:14`

Expandable section pattern with a summary header and collapsible content.

## DisclosureSectionProps

Kind: `type`
Module: `src/patterns/disclosure-section/types.ts`
Source: `src/patterns/disclosure-section/types.ts:6:1`

### Members

| Name         | Kind     | Type                                     | Required | Description |
| ------------ | -------- | ---------------------------------------- | -------- | ----------- |
| actions      | property | `ReactNode`                              | no       |             |
| children     | property | `ReactNode`                              | no       |             |
| defaultOpen  | property | `boolean \| undefined`                   | no       |             |
| description  | property | `ReactNode`                              | no       |             |
| disabled     | property | `boolean \| undefined`                   | no       |             |
| icon         | property | `ButtonIconSpec \| undefined`            | no       |             |
| mode         | property | `ZoraThemeMode \| undefined`             | no       |             |
| onOpenChange | property | `((open: boolean) => void) \| undefined` | no       |             |
| open         | property | `boolean \| undefined`                   | no       |             |
| testID       | property | `string \| undefined`                    | no       |             |
| themeId      | property | `string \| undefined`                    | no       |             |
| title        | property | `ReactNode`                              | yes      |             |

## Divider

Kind: `value`
Module: `src/foundation/Divider.tsx`
Source: `src/foundation/Divider.tsx:22:14`

Renders a themed visual separator between content sections.

## DividerProps

Kind: `type`
Module: `src/foundation/Divider.tsx`
Source: `src/foundation/Divider.tsx:10:1`

### Members

| Name               | Kind     | Type                                                                                                                             | Required | Description |
| ------------------ | -------- | -------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| accessibilityLabel | property | `string \| undefined`                                                                                                            | no       |             |
| accessibilityRole  | property | `import("/Users/a_rtiphishl_e/git/zora/node_modules/react-native/types/index").AccessibilityRole \| undefined`                   | no       |             |
| accessibilityState | property | `import("/Users/a_rtiphishl_e/git/zora/node_modules/react-native/types/index").AccessibilityState \| undefined`                  | no       |             |
| accessible         | property | `boolean \| undefined`                                                                                                           | no       |             |
| alignSelf          | property | `Responsive<"auto" \| import("/Users/a_rtiphishl_e/git/zora/node_modules/react-native/types/index").FlexAlignType \| undefined>` | no       |             |
| borderColor        | property | `Responsive<ColorValue> \| undefined`                                                                                            | no       |             |
| borderWidth        | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| bottom             | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| children           | property | `React.ReactNode`                                                                                                                | no       |             |
| color              | property | `ColorValue \| undefined`                                                                                                        | no       |             |
| flex               | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| flexBasis          | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| flexGrow           | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| flexShrink         | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| left               | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| m                  | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| maxHeight          | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| maxWidth           | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| mb                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| minHeight          | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| minWidth           | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| ml                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| mode               | property | `ZoraThemeMode \| undefined`                                                                                                     | no       |             |
| mr                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| mt                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| mx                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| my                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| opacity            | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| orientation        | property | `"horizontal" \| "vertical" \| undefined`                                                                                        | no       |             |
| overflow           | property | `Responsive<"visible" \| "hidden" \| "scroll" \| undefined>`                                                                     | no       |             |
| p                  | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| pb                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| pl                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| pointerEvents      | property | `"none" \| "auto" \| "box-none" \| "box-only" \| undefined`                                                                      | no       |             |
| position           | property | `Responsive<"absolute" \| "relative" \| "static" \| undefined>`                                                                  | no       |             |
| pr                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| pt                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| px                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| py                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| radius             | property | `Responsive<RadiusValue> \| undefined`                                                                                           | no       |             |
| right              | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| style              | property | `StyleProp<ViewStyle>`                                                                                                           | no       |             |
| testID             | property | `string \| undefined`                                                                                                            | no       |             |
| themeId            | property | `string \| undefined`                                                                                                            | no       |             |
| thickness          | property | `number \| undefined`                                                                                                            | no       |             |
| top                | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| zIndex             | property | `Responsive<number> \| undefined`                                                                                                | no       |             |

## Drawer

Kind: `value`
Module: `src/components/drawer/Drawer.tsx`
Source: `src/components/drawer/Drawer.tsx:58:14`

Side panel overlay for navigation, settings, and secondary content.

## DrawerProps

Kind: `type`
Module: `src/components/drawer/types.ts`
Source: `src/components/drawer/types.ts:6:1`

### Members

| Name            | Kind     | Type                             | Required | Description |
| --------------- | -------- | -------------------------------- | -------- | ----------- |
| children        | property | `React.ReactNode`                | no       |             |
| closeOnBackdrop | property | `boolean \| undefined`           | no       |             |
| description     | property | `React.ReactNode`                | no       |             |
| footer          | property | `React.ReactNode`                | no       |             |
| mode            | property | `ZoraThemeMode \| undefined`     | no       |             |
| onDismiss       | property | `(() => void) \| undefined`      | no       |             |
| position        | property | `"left" \| "right" \| undefined` | no       |             |
| testID          | property | `string \| undefined`            | no       |             |
| themeId         | property | `string \| undefined`            | no       |             |
| title           | property | `React.ReactNode`                | no       |             |
| visible         | property | `boolean`                        | yes      |             |

## DropdownMenu

Kind: `function`
Module: `src/components/menu/DropdownMenu.tsx`
Source: `src/components/menu/DropdownMenu.tsx:9:1`

Convenience wrapper for rendering a `Menu` as a dropdown.

### Signatures

- `(props: import("/Users/a_rtiphishl_e/git/zora/src/index").MenuProps) => React.JSX.Element`
  - props: `import("/Users/a_rtiphishl_e/git/zora/src/index").MenuProps`
  - returns: `React.JSX.Element`

## DropdownMenuProps

Kind: `unknown`
Module: `src/components/menu/types.ts`
Source: `src/components/menu/types.ts:31:1`

## EmptyState

Kind: `value`
Module: `src/patterns/empty-state/EmptyState.tsx`
Source: `src/patterns/empty-state/EmptyState.tsx:70:14`

Reusable fallback state for empty lists, missing data, or first-run experiences.

`EmptyState` combines concise copy with optional primary and secondary actions
so apps can guide users without custom card and button wiring.

## EmptyStateAction

Kind: `type`
Module: `src/patterns/empty-state/types.ts`
Source: `src/patterns/empty-state/types.ts:6:1`

### Members

| Name    | Kind     | Type                                                                                                                                          | Required | Description |
| ------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| color   | property | `"primary" \| "secondary" \| "tertiary" \| "quaternary" \| "neutral" \| "success" \| "warning" \| "error" \| "info" \| "danger" \| undefined` | no       |             |
| label   | property | `React.ReactNode`                                                                                                                             | yes      |             |
| onPress | property | `() => void`                                                                                                                                  | yes      |             |
| variant | property | `ZoraButtonVariant \| undefined`                                                                                                              | no       |             |

## EmptyStateProps

Kind: `type`
Module: `src/patterns/empty-state/types.ts`
Source: `src/patterns/empty-state/types.ts:13:1`

### Members

| Name            | Kind     | Type                            | Required | Description |
| --------------- | -------- | ------------------------------- | -------- | ----------- |
| description     | property | `React.ReactNode`               | no       |             |
| eyebrow         | property | `React.ReactNode`               | no       |             |
| footer          | property | `React.ReactNode`               | no       |             |
| mode            | property | `ZoraThemeMode \| undefined`    | no       |             |
| primaryAction   | property | `EmptyStateAction \| undefined` | no       |             |
| secondaryAction | property | `EmptyStateAction \| undefined` | no       |             |
| testID          | property | `string \| undefined`           | no       |             |
| themeId         | property | `string \| undefined`           | no       |             |
| title           | property | `React.ReactNode`               | yes      |             |

## FilterBar

Kind: `value`
Module: `src/patterns/filter-bar/FilterBar.tsx`
Source: `src/patterns/filter-bar/FilterBar.tsx:30:14`

Horizontal filter/action bar layout with leading/trailing slots.

## FilterBarProps

Kind: `type`
Module: `src/patterns/filter-bar/types.ts`
Source: `src/patterns/filter-bar/types.ts:5:1`

### Members

| Name     | Kind     | Type                         | Required | Description |
| -------- | -------- | ---------------------------- | -------- | ----------- |
| children | property | `React.ReactNode`            | yes      |             |
| leading  | property | `React.ReactNode`            | no       |             |
| mode     | property | `ZoraThemeMode \| undefined` | no       |             |
| testID   | property | `string \| undefined`        | no       |             |
| themeId  | property | `string \| undefined`        | no       |             |
| trailing | property | `React.ReactNode`            | no       |             |
| wrap     | property | `boolean \| undefined`       | no       |             |

## ForgotPasswordForm

Kind: `value`
Module: `src/patterns/auth/ForgotPasswordForm.tsx`
Source: `src/patterns/auth/ForgotPasswordForm.tsx:94:14`

Password reset form pattern with validation and submit actions.

## ForgotPasswordFormProps

Kind: `type`
Module: `src/patterns/auth/types.ts`
Source: `src/patterns/auth/types.ts:48:1`

### Members

| Name            | Kind     | Type                                                          | Required | Description |
| --------------- | -------- | ------------------------------------------------------------- | -------- | ----------- |
| disabled        | property | `boolean \| undefined`                                        | no       |             |
| error           | property | `React.ReactNode`                                             | no       |             |
| identifierLabel | property | `React.ReactNode`                                             | no       |             |
| identifiers     | property | `readonly AuthIdentifierKind[] \| undefined`                  | no       |             |
| loading         | property | `boolean \| undefined`                                        | no       |             |
| mode            | property | `ZoraThemeMode \| undefined`                                  | no       |             |
| onSignIn        | property | `(() => void \| Promise<void>) \| undefined`                  | no       |             |
| onSubmit        | property | `(values: ForgotPasswordFormValues) => void \| Promise<void>` | yes      |             |
| signInLabel     | property | `React.ReactNode`                                             | no       |             |
| submitLabel     | property | `React.ReactNode`                                             | no       |             |
| testID          | property | `string \| undefined`                                         | no       |             |
| themeId         | property | `string \| undefined`                                         | no       |             |

## ForgotPasswordFormValues

Kind: `type`
Module: `src/patterns/auth/types.ts`
Source: `src/patterns/auth/types.ts:43:1`

### Members

| Name           | Kind     | Type                 | Required | Description |
| -------------- | -------- | -------------------- | -------- | ----------- |
| identifier     | property | `string`             | yes      |             |
| identifierKind | property | `AuthIdentifierKind` | yes      |             |

## Form

Kind: `value`
Module: `src/components/form/Form.tsx`
Source: `src/components/form/Form.tsx:69:14`

Composes fields and actions into a validated form layout.

## FormActions

Kind: `value`
Module: `src/components/form/FormActions.tsx`
Source: `src/components/form/FormActions.tsx:31:14`

Standard submit/action area for forms.

## FormActionsProps

Kind: `type`
Module: `src/components/form/types.ts`
Source: `src/components/form/types.ts:65:1`

### Members

| Name        | Kind     | Type                         | Required | Description |
| ----------- | -------- | ---------------------------- | -------- | ----------- |
| children    | property | `React.ReactNode`            | no       |             |
| disabled    | property | `boolean \| undefined`       | no       |             |
| loading     | property | `boolean \| undefined`       | no       |             |
| mode        | property | `ZoraThemeMode \| undefined` | no       |             |
| onSubmit    | property | `(() => void) \| undefined`  | no       |             |
| submitLabel | property | `React.ReactNode`            | no       |             |
| testID      | property | `string \| undefined`        | no       |             |
| themeId     | property | `string \| undefined`        | no       |             |

## FormError

Kind: `value`
Module: `src/components/form/FormError.tsx`
Source: `src/components/form/FormError.tsx:28:14`

Displays a form-level validation or submission error message.

## FormErrorProps

Kind: `type`
Module: `src/components/form/types.ts`
Source: `src/components/form/types.ts:73:1`

### Members

| Name    | Kind     | Type                         | Required | Description |
| ------- | -------- | ---------------------------- | -------- | ----------- |
| error   | property | `React.ReactNode`            | no       |             |
| mode    | property | `ZoraThemeMode \| undefined` | no       |             |
| testID  | property | `string \| undefined`        | no       |             |
| themeId | property | `string \| undefined`        | no       |             |

## FormErrors

Kind: `unknown`
Module: `src/components/form/types.ts`
Source: `src/components/form/types.ts:15:1`

## FormField

Kind: `value`
Module: `src/components/form/FormField.tsx`
Source: `src/components/form/FormField.tsx:154:14`

Connects a controlled form value to a labeled input field with error handling.

## FormFieldConfig

Kind: `type`
Module: `src/components/form/types.ts`
Source: `src/components/form/types.ts:20:1`

### Members

| Name            | Kind     | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Required | Description |
| --------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| autoCapitalize  | property | `"none" \| "sentences" \| "words" \| "characters" \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | no       |             |
| autoComplete    | property | `"email" \| "password" \| "tel" \| "url" \| "additional-name" \| "address-line1" \| "address-line2" \| "birthdate-day" \| "birthdate-full" \| "birthdate-month" \| "birthdate-year" \| "cc-csc" \| "cc-exp" \| "cc-exp-day" \| "cc-exp-month" \| "cc-exp-year" \| "cc-number" \| "cc-name" \| "cc-given-name" \| "cc-middle-name" \| "cc-family-name" \| "cc-type" \| "country" \| "current-password" \| "family-name" \| "gender" \| "given-name" \| "honorific-prefix" \| "honorific-suffix" \| "name" \| "name-family" \| "name-given" \| "name-middle" \| "name-middle-initial" \| "name-prefix" \| "name-suffix" \| "new-password" \| "nickname" \| "one-time-code" \| "organization" \| "organization-title" \| "password-new" \| "postal-address" \| "postal-address-country" \| "postal-address-extended" \| "postal-address-extended-postal-code" \| "postal-address-locality" \| "postal-address-region" \| "postal-code" \| "street-address" \| "sms-otp" \| "tel-country-code" \| "tel-national" \| "tel-device" \| "username" \| "username-new" \| "off" \| undefined` | no       |             |
| description     | property | `React.ReactNode`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | no       |             |
| disabled        | property | `boolean \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |
| helperText      | property | `React.ReactNode`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | no       |             |
| keyboardType    | property | `import("/Users/a_rtiphishl_e/git/zora/node_modules/react-native/types/index").KeyboardTypeOptions \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | no       |             |
| label           | property | `React.ReactNode`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | yes      |             |
| maxLength       | property | `number \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | no       |             |
| name            | property | `TName`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | yes      |             |
| placeholder     | property | `string \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | no       |             |
| readOnly        | property | `boolean \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |
| required        | property | `boolean \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |
| rules           | property | `readonly ValidationRule[] \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | no       |             |
| secureTextEntry | property | `boolean \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |
| testID          | property | `string \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | no       |             |
| textContentType | property | `"none" \| "password" \| "name" \| "nickname" \| "username" \| "URL" \| "addressCity" \| "addressCityAndState" \| "addressState" \| "countryName" \| "creditCardNumber" \| "creditCardExpiration" \| "creditCardExpirationMonth" \| "creditCardExpirationYear" \| "creditCardSecurityCode" \| "creditCardType" \| "creditCardName" \| "creditCardGivenName" \| "creditCardMiddleName" \| "creditCardFamilyName" \| "emailAddress" \| "familyName" \| "fullStreetAddress" \| "givenName" \| "jobTitle" \| "location" \| "middleName" \| "namePrefix" \| "nameSuffix" \| "organizationName" \| "postalCode" \| "streetAddressLine1" \| "streetAddressLine2" \| "sublocality" \| "telephoneNumber" \| "newPassword" \| "oneTimeCode" \| "birthdate" \| "birthdateDay" \| "birthdateMonth" \| "birthdateYear" \| "cellularEID" \| "cellularIMEI" \| "dateTime" \| "flightNumber" \| "shipmentTrackingNumber" \| undefined`                                                                                                                                                              | no       |             |
| type            | property | `FormFieldInputType \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | no       |             |

## FormFieldControlProps

Kind: `type`
Module: `src/components/form/types.ts`
Source: `src/components/form/types.ts:52:1`

### Members

| Name     | Kind     | Type                                           | Required | Description |
| -------- | -------- | ---------------------------------------------- | -------- | ----------- |
| disabled | property | `boolean \| undefined`                         | no       |             |
| error    | property | `React.ReactNode`                              | no       |             |
| field    | property | `FormFieldConfig<TName>`                       | yes      |             |
| loading  | property | `boolean \| undefined`                         | no       |             |
| mode     | property | `ZoraThemeMode \| undefined`                   | no       |             |
| onChange | property | `(name: TName, value: FormFieldValue) => void` | yes      |             |
| testID   | property | `string \| undefined`                          | no       |             |
| themeId  | property | `string \| undefined`                          | no       |             |
| value    | property | `string`                                       | yes      |             |

## FormFieldInputType

Kind: `unknown`
Module: `src/components/form/types.ts`
Source: `src/components/form/types.ts:18:1`

## FormFieldProps

Kind: `unknown`
Module: `src/components/form/types.ts`
Source: `src/components/form/types.ts:61:1`

## FormProps

Kind: `type`
Module: `src/components/form/types.ts`
Source: `src/components/form/types.ts:77:1`

### Members

| Name             | Kind     | Type                                                   | Required | Description |
| ---------------- | -------- | ------------------------------------------------------ | -------- | ----------- |
| actions          | property | `React.ReactNode`                                      | no       |             |
| disabled         | property | `boolean \| undefined`                                 | no       |             |
| error            | property | `React.ReactNode`                                      | no       |             |
| errors           | property | `Partial<Record<TName, React.ReactNode>> \| undefined` | no       |             |
| fields           | property | `readonly FormFieldConfig<TName>[]`                    | yes      |             |
| footer           | property | `React.ReactNode`                                      | no       |             |
| loading          | property | `boolean \| undefined`                                 | no       |             |
| mode             | property | `ZoraThemeMode \| undefined`                           | no       |             |
| onChange         | property | `(values: FormValues<TName>) => void`                  | yes      |             |
| onSubmit         | property | `(values: FormValues<TName>) => void \| Promise<void>` | yes      |             |
| submitLabel      | property | `React.ReactNode`                                      | no       |             |
| testID           | property | `string \| undefined`                                  | no       |             |
| themeId          | property | `string \| undefined`                                  | no       |             |
| validateOnChange | property | `boolean \| undefined`                                 | no       |             |
| values           | property | `FormValues<TName>`                                    | yes      |             |

## FormValidationErrors

Kind: `unknown`
Module: `src/components/form/types.ts`
Source: `src/components/form/types.ts:16:1`

## FormValidationResult

Kind: `type`
Module: `src/components/form/types.ts`
Source: `src/components/form/types.ts:92:1`

### Members

| Name   | Kind     | Type                             | Required | Description |
| ------ | -------- | -------------------------------- | -------- | ----------- |
| errors | property | `Partial<Record<TName, string>>` | yes      |             |
| valid  | property | `boolean`                        | yes      |             |

## FormValues

Kind: `unknown`
Module: `src/components/form/types.ts`
Source: `src/components/form/types.ts:14:1`

## Gradient

Kind: `value`
Module: `src/components/gradient/Gradient.tsx`
Source: `src/components/gradient/Gradient.tsx:53:14`

Gradient background container for branded loading surfaces, hero blocks, and previews.

`Gradient` is backed by `expo-linear-gradient`. It is a React-rendered ZORA
component and does not replace native Expo splash-screen configuration.

## GradientColor

Kind: `unknown`
Module: `src/components/gradient/types.ts`
Source: `src/components/gradient/types.ts:6:1`

## GradientColors

Kind: `unknown`
Module: `src/components/gradient/types.ts`
Source: `src/components/gradient/types.ts:7:1`

## GradientLocations

Kind: `unknown`
Module: `src/components/gradient/types.ts`
Source: `src/components/gradient/types.ts:8:1`

## GradientPoint

Kind: `type`
Module: `src/components/gradient/types.ts`
Source: `src/components/gradient/types.ts:10:1`

### Members

| Name | Kind     | Type     | Required | Description |
| ---- | -------- | -------- | -------- | ----------- |
| x    | property | `number` | yes      |             |
| y    | property | `number` | yes      |             |

## GradientProps

Kind: `type`
Module: `src/components/gradient/types.ts`
Source: `src/components/gradient/types.ts:15:1`

### Members

| Name      | Kind     | Type                                                                                                                                                                                                                 | Required | Description |
| --------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| children  | property | `React.ReactNode`                                                                                                                                                                                                    | no       |             |
| colors    | property | `GradientColors`                                                                                                                                                                                                     | yes      |             |
| end       | property | `GradientPoint \| undefined`                                                                                                                                                                                         | no       |             |
| height    | property | `import("/Users/a_rtiphishl_e/git/zora/node_modules/@ankhorage/surface/dist/index").Responsive<string \| number> \| undefined`                                                                                       | no       |             |
| locations | property | `GradientLocations \| undefined`                                                                                                                                                                                     | no       |             |
| minHeight | property | `import("/Users/a_rtiphishl_e/git/zora/node_modules/@ankhorage/surface/dist/index").Responsive<string \| number> \| undefined`                                                                                       | no       |             |
| mode      | property | `ZoraThemeMode \| undefined`                                                                                                                                                                                         | no       |             |
| p         | property | `import("/Users/a_rtiphishl_e/git/zora/node_modules/@ankhorage/surface/dist/index").Responsive<import("/Users/a_rtiphishl_e/git/zora/node_modules/@ankhorage/surface/dist/layout/helpers").SpaceValue> \| undefined` | no       |             |
| radius    | property | `import("/Users/a_rtiphishl_e/git/zora/node_modules/@ankhorage/surface/dist/index").Responsive<number \| "s" \| "m" \| "l" \| "none" \| "full"> \| undefined`                                                        | no       |             |
| start     | property | `GradientPoint \| undefined`                                                                                                                                                                                         | no       |             |
| testID    | property | `string \| undefined`                                                                                                                                                                                                | no       |             |
| themeId   | property | `string \| undefined`                                                                                                                                                                                                | no       |             |
| width     | property | `import("/Users/a_rtiphishl_e/git/zora/node_modules/@ankhorage/surface/dist/index").Responsive<string \| number> \| undefined`                                                                                       | no       |             |

## Grid

Kind: `value`
Module: `src/foundation/Grid.tsx`
Source: `src/foundation/Grid.tsx:18:14`

Creates responsive grid layouts for cards, tiles, and dashboard content.

## GridProps

Kind: `type`
Module: `src/foundation/Grid.tsx`
Source: `src/foundation/Grid.tsx:7:1`

### Members

| Name               | Kind     | Type                                                                                                                             | Required | Description |
| ------------------ | -------- | -------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| accessibilityLabel | property | `string \| undefined`                                                                                                            | no       |             |
| accessibilityRole  | property | `import("/Users/a_rtiphishl_e/git/zora/node_modules/react-native/types/index").AccessibilityRole \| undefined`                   | no       |             |
| accessibilityState | property | `import("/Users/a_rtiphishl_e/git/zora/node_modules/react-native/types/index").AccessibilityState \| undefined`                  | no       |             |
| accessible         | property | `boolean \| undefined`                                                                                                           | no       |             |
| alignSelf          | property | `Responsive<"auto" \| import("/Users/a_rtiphishl_e/git/zora/node_modules/react-native/types/index").FlexAlignType \| undefined>` | no       |             |
| bg                 | property | `Responsive<ColorValue> \| undefined`                                                                                            | no       |             |
| borderColor        | property | `Responsive<ColorValue> \| undefined`                                                                                            | no       |             |
| borderWidth        | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| bottom             | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| children           | property | `React.ReactNode`                                                                                                                | no       |             |
| colGap             | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| cols               | property | `Responsive<number>`                                                                                                             | yes      |             |
| flex               | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| flexBasis          | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| flexGrow           | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| flexShrink         | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| gap                | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| height             | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| left               | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| m                  | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| maxHeight          | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| maxWidth           | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| mb                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| minHeight          | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| minItemWidth       | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| minWidth           | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| ml                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| mode               | property | `ZoraThemeMode \| undefined`                                                                                                     | no       |             |
| mr                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| mt                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| mx                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| my                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| opacity            | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| overflow           | property | `Responsive<"visible" \| "hidden" \| "scroll" \| undefined>`                                                                     | no       |             |
| p                  | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| pb                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| pl                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| pointerEvents      | property | `"none" \| "auto" \| "box-none" \| "box-only" \| undefined`                                                                      | no       |             |
| position           | property | `Responsive<"absolute" \| "relative" \| "static" \| undefined>`                                                                  | no       |             |
| pr                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| pt                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| px                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| py                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| radius             | property | `Responsive<RadiusValue> \| undefined`                                                                                           | no       |             |
| right              | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| rowGap             | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| style              | property | `StyleProp<ViewStyle>`                                                                                                           | no       |             |
| testID             | property | `string \| undefined`                                                                                                            | no       |             |
| themeId            | property | `string \| undefined`                                                                                                            | no       |             |
| top                | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| width              | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| zIndex             | property | `Responsive<number> \| undefined`                                                                                                | no       |             |

## hasRequiredRule

Kind: `function`
Module: `src/components/form/validation.ts`
Source: `src/components/form/validation.ts:11:1`

### Signatures

- `(rules: readonly ValidationRule[] | undefined) => boolean`
  - rules: `readonly ValidationRule[] | undefined`
  - returns: `boolean`

## Heading

Kind: `value`
Module: `src/components/heading/Heading.tsx`
Source: `src/components/heading/Heading.tsx:105:14`

Structured title primitive for accessible page, section, and card headings.

`Heading` gives consumers a ZORA-owned title API with semantic levels,
responsive sizes, and theme-aware emphasis while preserving header semantics.

## HeadingAlign

Kind: `unknown`
Module: `src/components/heading/types.ts`
Source: `src/components/heading/types.ts:15:1`

## HeadingColor

Kind: `unknown`
Module: `src/components/heading/types.ts`
Source: `src/components/heading/types.ts:12:1`

## HeadingEmphasis

Kind: `unknown`
Module: `src/components/heading/types.ts`
Source: `src/components/heading/types.ts:13:1`

## HeadingLevel

Kind: `unknown`
Module: `src/components/heading/types.ts`
Source: `src/components/heading/types.ts:8:1`

## HeadingProps

Kind: `type`
Module: `src/components/heading/types.ts`
Source: `src/components/heading/types.ts:19:1`

### Members

| Name               | Kind     | Type                                                                                                                                                      | Required | Description |
| ------------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| accessibilityHint  | property | `string \| undefined`                                                                                                                                     | no       |             |
| accessibilityLabel | property | `string \| undefined`                                                                                                                                     | no       |             |
| accessibilityRole  | property | `AccessibilityRole \| undefined`                                                                                                                          | no       |             |
| align              | property | `Responsive<HeadingAlign> \| undefined`                                                                                                                   | no       |             |
| children           | property | `React.ReactNode`                                                                                                                                         | no       |             |
| color              | property | `Responsive<"primary" \| "secondary" \| "tertiary" \| "quaternary" \| "neutral" \| "success" \| "warning" \| "error" \| "info" \| "danger"> \| undefined` | no       |             |
| ellipsizeMode      | property | `"head" \| "middle" \| "tail" \| "clip" \| undefined`                                                                                                     | no       |             |
| emphasis           | property | `Responsive<"default" \| "subtle" \| "muted" \| "inverse"> \| undefined`                                                                                  | no       |             |
| i18nKey            | property | `string \| undefined`                                                                                                                                     | no       |             |
| italic             | property | `boolean \| undefined`                                                                                                                                    | no       |             |
| level              | property | `HeadingLevel \| undefined`                                                                                                                               | no       |             |
| mode               | property | `ZoraThemeMode \| undefined`                                                                                                                              | no       |             |
| nativeID           | property | `string \| undefined`                                                                                                                                     | no       |             |
| numberOfLines      | property | `number \| undefined`                                                                                                                                     | no       |             |
| selectable         | property | `boolean \| undefined`                                                                                                                                    | no       |             |
| size               | property | `Responsive<HeadingSize> \| undefined`                                                                                                                    | no       |             |
| testID             | property | `string \| undefined`                                                                                                                                     | no       |             |
| text               | property | `string \| undefined`                                                                                                                                     | no       |             |
| themeId            | property | `string \| undefined`                                                                                                                                     | no       |             |
| weight             | property | `Responsive<HeadingWeight> \| undefined`                                                                                                                  | no       |             |

## HeadingSize

Kind: `unknown`
Module: `src/components/heading/types.ts`
Source: `src/components/heading/types.ts:10:1`

## HeadingWeight

Kind: `unknown`
Module: `src/components/heading/types.ts`
Source: `src/components/heading/types.ts:17:1`

## Hero

Kind: `value`
Module: `src/patterns/hero/Hero.tsx`
Source: `src/patterns/hero/Hero.tsx:121:14`

Hero section pattern for prominent page introductions with actions.

## HeroAction

Kind: `type`
Module: `src/patterns/hero/types.ts`
Source: `src/patterns/hero/types.ts:10:1`

### Members

| Name     | Kind     | Type                                                                                                                                          | Required | Description |
| -------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| color    | property | `"primary" \| "secondary" \| "tertiary" \| "quaternary" \| "neutral" \| "success" \| "warning" \| "error" \| "info" \| "danger" \| undefined` | no       |             |
| disabled | property | `boolean \| undefined`                                                                                                                        | no       |             |
| label    | property | `React.ReactNode`                                                                                                                             | yes      |             |
| onPress  | property | `() => void`                                                                                                                                  | yes      |             |
| variant  | property | `ZoraButtonVariant \| undefined`                                                                                                              | no       |             |

## HeroAlign

Kind: `unknown`
Module: `src/patterns/hero/types.ts`
Source: `src/patterns/hero/types.ts:6:1`

## HeroLayout

Kind: `unknown`
Module: `src/patterns/hero/types.ts`
Source: `src/patterns/hero/types.ts:7:1`

## HeroProps

Kind: `type`
Module: `src/patterns/hero/types.ts`
Source: `src/patterns/hero/types.ts:18:1`

### Members

| Name            | Kind     | Type                         | Required | Description |
| --------------- | -------- | ---------------------------- | -------- | ----------- |
| align           | property | `HeroAlign \| undefined`     | no       |             |
| compact         | property | `boolean \| undefined`       | no       |             |
| description     | property | `React.ReactNode`            | no       |             |
| eyebrow         | property | `React.ReactNode`            | no       |             |
| footer          | property | `React.ReactNode`            | no       |             |
| layout          | property | `HeroLayout \| undefined`    | no       |             |
| media           | property | `React.ReactNode`            | no       |             |
| mode            | property | `ZoraThemeMode \| undefined` | no       |             |
| primaryAction   | property | `HeroAction \| undefined`    | no       |             |
| secondaryAction | property | `HeroAction \| undefined`    | no       |             |
| testID          | property | `string \| undefined`        | no       |             |
| themeId         | property | `string \| undefined`        | no       |             |
| title           | property | `React.ReactNode`            | yes      |             |
| tone            | property | `HeroTone \| undefined`      | no       |             |

## HeroTone

Kind: `unknown`
Module: `src/patterns/hero/types.ts`
Source: `src/patterns/hero/types.ts:8:1`

## Icon

Kind: `value`
Module: `src/components/icon/Icon.tsx`
Source: `src/components/icon/Icon.tsx:16:14`

Renders an icon from a configured icon provider with theme-aware defaults.

## IconButton

Kind: `value`
Module: `src/components/icon-button/IconButton.tsx`
Source: `src/components/icon-button/IconButton.tsx:35:14`

Icon-only button for compact actions; requires an accessible `label`.

## IconButtonProps

Kind: `type`
Module: `src/components/icon-button/types.ts`
Source: `src/components/icon-button/types.ts:6:1`

### Members

| Name     | Kind     | Type                                                                                                                                          | Required | Description |
| -------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| color    | property | `"primary" \| "secondary" \| "tertiary" \| "quaternary" \| "neutral" \| "success" \| "warning" \| "error" \| "info" \| "danger" \| undefined` | no       |             |
| disabled | property | `boolean \| undefined`                                                                                                                        | no       |             |
| icon     | property | `ButtonIconSpec`                                                                                                                              | yes      |             |
| label    | property | `string`                                                                                                                                      | yes      |             |
| loading  | property | `boolean \| undefined`                                                                                                                        | no       |             |
| mode     | property | `ZoraThemeMode \| undefined`                                                                                                                  | no       |             |
| onPress  | property | `(() => void) \| undefined`                                                                                                                   | no       |             |
| size     | property | `ZoraControlSize \| undefined`                                                                                                                | no       |             |
| testID   | property | `string \| undefined`                                                                                                                         | no       |             |
| themeId  | property | `string \| undefined`                                                                                                                         | no       |             |
| variant  | property | `ZoraButtonVariant \| undefined`                                                                                                              | no       |             |

## IconProps

Kind: `type`
Module: `src/components/icon/Icon.tsx`
Source: `src/components/icon/Icon.tsx:7:1`

### Members

| Name     | Kind     | Type                            | Required | Description |
| -------- | -------- | ------------------------------- | -------- | ----------- |
| color    | property | `string \| number \| undefined` | no       |             |
| mode     | property | `ZoraThemeMode \| undefined`    | no       |             |
| name     | property | `string`                        | yes      |             |
| provider | property | `string \| undefined`           | no       |             |
| size     | property | `string \| number \| undefined` | no       |             |
| style    | property | `StyleProp<TextStyle>`          | no       |             |
| testID   | property | `string \| undefined`           | no       |             |
| themeId  | property | `string \| undefined`           | no       |             |

## Image

Kind: `value`
Module: `src/components/image/Image.tsx`
Source: `src/components/image/Image.tsx:16:14`

Displays an image with cross-platform source and fit handling.

## ImageFit

Kind: `unknown`
Module: `node_modules/@ankhorage/surface/dist/primitives/image/types.d.ts`
Source: `node_modules/@ankhorage/surface/dist/primitives/image/types.d.ts:5:1`

## ImagePreview

Kind: `value`
Module: `src/patterns/image-preview/ImagePreview.tsx`
Source: `src/patterns/image-preview/ImagePreview.tsx:81:14`

Preview pattern for showing an image with optional metadata and actions.

## ImagePreviewProps

Kind: `type`
Module: `src/patterns/image-preview/types.ts`
Source: `src/patterns/image-preview/types.ts:35:1`

### Members

| Name             | Kind     | Type                                                                                                         | Required | Description |
| ---------------- | -------- | ------------------------------------------------------------------------------------------------------------ | -------- | ----------- |
| aspectRatio      | property | `number \| undefined`                                                                                        | no       |             |
| asset            | property | `ZoraImageAsset \| null \| undefined`                                                                        | no       |             |
| emptyDescription | property | `React.ReactNode`                                                                                            | no       |             |
| emptyTitle       | property | `React.ReactNode`                                                                                            | no       |             |
| fit              | property | `import("/Users/a_rtiphishl_e/git/zora/node_modules/react-native/types/index").ImageResizeMode \| undefined` | no       |             |
| mode             | property | `ZoraThemeMode \| undefined`                                                                                 | no       |             |
| testID           | property | `string \| undefined`                                                                                        | no       |             |
| themeId          | property | `string \| undefined`                                                                                        | no       |             |

## ImageProps

Kind: `type`
Module: `src/components/image/types.ts`
Source: `src/components/image/types.ts:7:1`

### Members

| Name               | Kind     | Type                                                                                                                            | Required | Description |
| ------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| accessibilityLabel | property | `string \| undefined`                                                                                                           | no       |             |
| alt                | property | `string \| undefined`                                                                                                           | no       |             |
| aspectRatio        | property | `number \| undefined`                                                                                                           | no       |             |
| fallbackSource     | property | `SurfaceImageSource \| null \| undefined`                                                                                       | no       |             |
| fit                | property | `ImageResizeMode \| undefined`                                                                                                  | no       |             |
| height             | property | `string \| number \| undefined`                                                                                                 | no       |             |
| mode               | property | `ZoraThemeMode \| undefined`                                                                                                    | no       |             |
| onError            | property | `((error: import("/Users/a_rtiphishl_e/git/zora/node_modules/react-native/types/index").ImageErrorEvent) => void) \| undefined` | no       |             |
| radius             | property | `number \| "s" \| "m" \| "l" \| "none" \| "full" \| undefined`                                                                  | no       |             |
| resizeMode         | property | `ImageResizeMode \| undefined`                                                                                                  | no       |             |
| source             | property | `SurfaceImageSource \| null \| undefined`                                                                                       | no       |             |
| style              | property | `StyleProp<ImageStyle>`                                                                                                         | no       |             |
| testID             | property | `string \| undefined`                                                                                                           | no       |             |
| themeId            | property | `string \| undefined`                                                                                                           | no       |             |
| width              | property | `string \| number \| undefined`                                                                                                 | no       |             |

## ImageUploadField

Kind: `value`
Module: `src/patterns/image-upload-field/ImageUploadField.tsx`
Source: `src/patterns/image-upload-field/ImageUploadField.tsx:298:14`

Form field pattern for picking, previewing, and uploading an image.

## ImageUploadFieldProps

Kind: `type`
Module: `src/patterns/image-upload-field/types.ts`
Source: `src/patterns/image-upload-field/types.ts:19:1`

### Members

| Name               | Kind     | Type                                                                                                       | Required | Description |
| ------------------ | -------- | ---------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| accept             | property | `string \| undefined`                                                                                      | no       |             |
| aspectRatio        | property | `number \| undefined`                                                                                      | no       |             |
| description        | property | `React.ReactNode`                                                                                          | no       |             |
| disabled           | property | `boolean \| undefined`                                                                                     | no       |             |
| errorText          | property | `React.ReactNode`                                                                                          | no       |             |
| helperText         | property | `React.ReactNode`                                                                                          | no       |             |
| label              | property | `React.ReactNode`                                                                                          | yes      |             |
| maxSizeBytes       | property | `number \| undefined`                                                                                      | no       |             |
| mode               | property | `ZoraThemeMode \| undefined`                                                                               | no       |             |
| onChange           | property | `(next: ZoraImageAsset \| null) => void`                                                                   | yes      |             |
| onPick             | property | `() => Promise<ZoraPickedImage \| null>`                                                                   | yes      |             |
| onRemove           | property | `((current: ZoraImageAsset) => void \| Promise<void>) \| undefined`                                        | no       |             |
| onUpload           | property | `((picked: ZoraPickedImage, context: ImageUploadProgressContext) => Promise<ZoraImageAsset>) \| undefined` | no       |             |
| previewDescription | property | `React.ReactNode`                                                                                          | no       |             |
| previewTitle       | property | `React.ReactNode`                                                                                          | no       |             |
| readOnly           | property | `boolean \| undefined`                                                                                     | no       |             |
| required           | property | `boolean \| undefined`                                                                                     | no       |             |
| testID             | property | `string \| undefined`                                                                                      | no       |             |
| themeId            | property | `string \| undefined`                                                                                      | no       |             |
| validatePicked     | property | `((picked: ZoraPickedImage) => string \| undefined) \| undefined`                                          | no       |             |
| value              | property | `ZoraImageAsset \| null`                                                                                   | yes      |             |

## ImageUploadProgressContext

Kind: `type`
Module: `src/patterns/image-upload-field/types.ts`
Source: `src/patterns/image-upload-field/types.ts:15:1`

### Members

| Name        | Kind     | Type                                 | Required | Description |
| ----------- | -------- | ------------------------------------ | -------- | ----------- |
| setProgress | property | `(progress: number \| null) => void` | yes      |             |

## Inline

Kind: `value`
Module: `src/foundation/Inline.tsx`
Source: `src/foundation/Inline.tsx:21:14`

Arranges children inline with spacing and wrapping behavior.

## InlineProps

Kind: `type`
Module: `src/foundation/Inline.tsx`
Source: `src/foundation/Inline.tsx:10:1`

### Members

| Name               | Kind     | Type                                                                                                                             | Required | Description |
| ------------------ | -------- | -------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| accessibilityLabel | property | `string \| undefined`                                                                                                            | no       |             |
| accessibilityRole  | property | `import("/Users/a_rtiphishl_e/git/zora/node_modules/react-native/types/index").AccessibilityRole \| undefined`                   | no       |             |
| accessibilityState | property | `import("/Users/a_rtiphishl_e/git/zora/node_modules/react-native/types/index").AccessibilityState \| undefined`                  | no       |             |
| accessible         | property | `boolean \| undefined`                                                                                                           | no       |             |
| align              | property | `Responsive<"flex-start" \| "flex-end" \| "center" \| "stretch" \| "baseline"> \| undefined`                                     | no       |             |
| alignSelf          | property | `Responsive<"auto" \| import("/Users/a_rtiphishl_e/git/zora/node_modules/react-native/types/index").FlexAlignType \| undefined>` | no       |             |
| bg                 | property | `Responsive<ColorValue> \| undefined`                                                                                            | no       |             |
| borderColor        | property | `Responsive<ColorValue> \| undefined`                                                                                            | no       |             |
| borderWidth        | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| bottom             | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| children           | property | `React.ReactNode`                                                                                                                | no       |             |
| flex               | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| flexBasis          | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| flexGrow           | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| flexShrink         | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| gap                | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| height             | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| justify            | property | `Responsive<"flex-start" \| "flex-end" \| "center" \| "space-between" \| "space-around" \| "space-evenly"> \| undefined`         | no       |             |
| left               | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| m                  | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| maxHeight          | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| maxWidth           | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| mb                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| minHeight          | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| minWidth           | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| ml                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| mode               | property | `ZoraThemeMode \| undefined`                                                                                                     | no       |             |
| mr                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| mt                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| mx                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| my                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| opacity            | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| overflow           | property | `Responsive<"visible" \| "hidden" \| "scroll" \| undefined>`                                                                     | no       |             |
| p                  | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| pb                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| pl                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| pointerEvents      | property | `"none" \| "auto" \| "box-none" \| "box-only" \| undefined`                                                                      | no       |             |
| position           | property | `Responsive<"absolute" \| "relative" \| "static" \| undefined>`                                                                  | no       |             |
| pr                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| pt                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| px                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| py                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| radius             | property | `Responsive<RadiusValue> \| undefined`                                                                                           | no       |             |
| right              | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| style              | property | `StyleProp<ViewStyle>`                                                                                                           | no       |             |
| testID             | property | `string \| undefined`                                                                                                            | no       |             |
| themeId            | property | `string \| undefined`                                                                                                            | no       |             |
| top                | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| width              | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| wrap               | property | `Responsive<"wrap" \| "nowrap"> \| undefined`                                                                                    | no       |             |
| zIndex             | property | `Responsive<number> \| undefined`                                                                                                | no       |             |

## Input

Kind: `value`
Module: `src/components/input/Input.tsx`
Source: `src/components/input/Input.tsx:76:14`

Theme-aware text input with semantic sizing and optional leading/trailing icon slots.

Use `Input` for single-line form controls that need ZORA styling, disabled/read-only
handling, and accessible trailing actions without dropping into Surface directly.

## InputProps

Kind: `unknown`
Module: `src/components/input/types.ts`
Source: `src/components/input/types.ts:33:1`

## InputTrailingAction

Kind: `type`
Module: `src/components/input/types.ts`
Source: `src/components/input/types.ts:6:1`

### Members

| Name    | Kind     | Type                     | Required | Description |
| ------- | -------- | ------------------------ | -------- | ----------- |
| icon    | property | `Surface.ButtonIconSpec` | yes      |             |
| label   | property | `string`                 | yes      |             |
| onPress | property | `() => void`             | yes      |             |

## InspectorField

Kind: `value`
Module: `src/patterns/inspector-field/InspectorField.tsx`
Source: `src/patterns/inspector-field/InspectorField.tsx:31:14`

Inspector row pattern with label, description, and control slot.

## InspectorFieldProps

Kind: `type`
Module: `src/patterns/inspector-field/types.ts`
Source: `src/patterns/inspector-field/types.ts:5:1`

### Members

| Name        | Kind     | Type                         | Required | Description |
| ----------- | -------- | ---------------------------- | -------- | ----------- |
| children    | property | `ReactNode`                  | no       |             |
| control     | property | `ReactNode`                  | no       |             |
| description | property | `ReactNode`                  | no       |             |
| disabled    | property | `boolean \| undefined`       | no       |             |
| errorText   | property | `ReactNode`                  | no       |             |
| helperText  | property | `ReactNode`                  | no       |             |
| invalid     | property | `boolean \| undefined`       | no       |             |
| label       | property | `ReactNode`                  | yes      |             |
| mode        | property | `ZoraThemeMode \| undefined` | no       |             |
| readOnly    | property | `boolean \| undefined`       | no       |             |
| required    | property | `boolean \| undefined`       | no       |             |
| testID      | property | `string \| undefined`        | no       |             |
| themeId     | property | `string \| undefined`        | no       |             |

## List

Kind: `value`
Module: `src/patterns/list/List.tsx`
Source: `src/patterns/list/List.tsx:77:14`

List container pattern for composing `ListRow` and `ListSection`.

## ListChildrenProps

Kind: `type`
Module: `src/patterns/list/types.ts`
Source: `src/patterns/list/types.ts:43:1`

### Members

| Name     | Kind     | Type                         | Required | Description |
| -------- | -------- | ---------------------------- | -------- | ----------- |
| children | property | `React.ReactNode`            | yes      |             |
| mode     | property | `ZoraThemeMode \| undefined` | no       |             |
| testID   | property | `string \| undefined`        | no       |             |
| themeId  | property | `string \| undefined`        | no       |             |

## ListItemsProps

Kind: `type`
Module: `src/patterns/list/types.ts`
Source: `src/patterns/list/types.ts:37:1`

### Members

| Name       | Kind     | Type                          | Required | Description |
| ---------- | -------- | ----------------------------- | -------- | ----------- |
| compact    | property | `boolean \| undefined`        | no       |             |
| items      | property | `readonly ListRowProps[]`     | yes      |             |
| mode       | property | `ZoraThemeMode \| undefined`  | no       |             |
| rowVariant | property | `ListRowVariant \| undefined` | no       |             |
| testID     | property | `string \| undefined`         | no       |             |
| themeId    | property | `string \| undefined`         | no       |             |

## ListProps

Kind: `unknown`
Module: `src/patterns/list/types.ts`
Source: `src/patterns/list/types.ts:47:1`

## ListRow

Kind: `value`
Module: `src/patterns/list/ListRow.tsx`
Source: `src/patterns/list/ListRow.tsx:198:14`

Row pattern for lists with leading/trailing slots and optional press behavior.

## ListRowProps

Kind: `unknown`
Module: `src/patterns/list/types.ts`
Source: `src/patterns/list/types.ts:34:1`

## ListRowVariant

Kind: `unknown`
Module: `src/patterns/list/types.ts`
Source: `src/patterns/list/types.ts:5:1`

## ListSection

Kind: `value`
Module: `src/patterns/list/ListSection.tsx`
Source: `src/patterns/list/ListSection.tsx:41:14`

Section wrapper for lists with optional title and description.

## MediaCard

Kind: `value`
Module: `src/components/media-card/MediaCard.tsx`
Source: `src/components/media-card/MediaCard.tsx:123:14`

Card layout with an optional media/header region and structured content slots.

## MediaCardImageProps

Kind: `unknown`
Module: `src/components/media-card/types.ts`
Source: `src/components/media-card/types.ts:25:1`

## MediaCardProps

Kind: `unknown`
Module: `src/components/media-card/types.ts`
Source: `src/components/media-card/types.ts:44:1`

## Menu

Kind: `value`
Module: `src/components/menu/Menu.tsx`
Source: `src/components/menu/Menu.tsx:66:14`

Presents a list of actions as a menu with optional icons and intent styling.

## MenuAction

Kind: `type`
Module: `src/components/menu/types.ts`
Source: `src/components/menu/types.ts:12:1`

### Members

| Name        | Kind     | Type                                   | Required | Description |
| ----------- | -------- | -------------------------------------- | -------- | ----------- |
| description | property | `React.ReactNode`                      | no       |             |
| disabled    | property | `boolean \| undefined`                 | no       |             |
| icon        | property | `ButtonIconSpec \| undefined`          | no       |             |
| id          | property | `string`                               | yes      |             |
| intent      | property | `SurfaceMenuActionIntent \| undefined` | no       |             |
| leading     | property | `React.ReactNode`                      | no       |             |
| onPress     | property | `(() => void) \| undefined`            | no       |             |
| selected    | property | `boolean \| undefined`                 | no       |             |
| title       | property | `React.ReactNode`                      | yes      |             |
| trailing    | property | `React.ReactNode`                      | no       |             |

## MenuActionIntent

Kind: `unknown`
Module: `src/components/menu/types.ts`
Source: `src/components/menu/types.ts:10:1`

## MenuProps

Kind: `type`
Module: `src/components/menu/types.ts`
Source: `src/components/menu/types.ts:25:1`

### Members

| Name          | Kind     | Type                         | Required | Description |
| ------------- | -------- | ---------------------------- | -------- | ----------- |
| actions       | property | `readonly MenuAction[]`      | yes      |             |
| closeOnSelect | property | `boolean \| undefined`       | no       |             |
| mode          | property | `ZoraThemeMode \| undefined` | no       |             |
| onDismiss     | property | `(() => void) \| undefined`  | no       |             |
| testID        | property | `string \| undefined`        | no       |             |
| themeId       | property | `string \| undefined`        | no       |             |
| trigger       | property | `React.ReactNode`            | no       |             |

## MessageBubble

Kind: `value`
Module: `src/patterns/message-bubble/MessageBubble.tsx`
Source: `src/patterns/message-bubble/MessageBubble.tsx:270:14`

Message bubble pattern for chat UIs with direction and status styling.

## MessageBubbleAuthor

Kind: `type`
Module: `src/patterns/message-bubble/types.ts`
Source: `src/patterns/message-bubble/types.ts:22:1`

### Members

| Name   | Kind     | Type                               | Required | Description |
| ------ | -------- | ---------------------------------- | -------- | ----------- |
| avatar | property | `MessageBubbleAvatar \| undefined` | no       |             |
| name   | property | `React.ReactNode`                  | no       |             |

## MessageBubbleAvatar

Kind: `type`
Module: `src/patterns/message-bubble/types.ts`
Source: `src/patterns/message-bubble/types.ts:12:1`

### Members

| Name     | Kind     | Type                                                                                                                                          | Required | Description |
| -------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| color    | property | `"primary" \| "secondary" \| "tertiary" \| "quaternary" \| "neutral" \| "success" \| "warning" \| "error" \| "info" \| "danger" \| undefined` | no       |             |
| initials | property | `string \| undefined`                                                                                                                         | no       |             |
| label    | property | `string \| undefined`                                                                                                                         | no       |             |
| name     | property | `string \| undefined`                                                                                                                         | no       |             |
| shape    | property | `AvatarShape \| undefined`                                                                                                                    | no       |             |
| size     | property | `AvatarSize \| undefined`                                                                                                                     | no       |             |
| source   | property | `ImageSourcePropType \| undefined`                                                                                                            | no       |             |

## MessageBubbleDirection

Kind: `unknown`
Module: `src/patterns/message-bubble/types.ts`
Source: `src/patterns/message-bubble/types.ts:8:1`

## MessageBubbleProps

Kind: `type`
Module: `src/patterns/message-bubble/types.ts`
Source: `src/patterns/message-bubble/types.ts:27:1`

### Members

| Name               | Kind     | Type                                  | Required | Description |
| ------------------ | -------- | ------------------------------------- | -------- | ----------- |
| accessibilityLabel | property | `string \| undefined`                 | no       |             |
| author             | property | `MessageBubbleAuthor \| undefined`    | no       |             |
| children           | property | `React.ReactNode`                     | no       |             |
| compact            | property | `boolean \| undefined`                | no       |             |
| direction          | property | `MessageBubbleDirection \| undefined` | no       |             |
| disabled           | property | `boolean \| undefined`                | no       |             |
| footer             | property | `React.ReactNode`                     | no       |             |
| leading            | property | `React.ReactNode`                     | no       |             |
| meta               | property | `React.ReactNode`                     | no       |             |
| mode               | property | `ZoraThemeMode \| undefined`          | no       |             |
| onPress            | property | `(() => void) \| undefined`           | no       |             |
| selected           | property | `boolean \| undefined`                | no       |             |
| status             | property | `MessageBubbleStatusContent`          | no       |             |
| testID             | property | `string \| undefined`                 | no       |             |
| text               | property | `React.ReactNode`                     | no       |             |
| themeId            | property | `string \| undefined`                 | no       |             |
| timestamp          | property | `React.ReactNode`                     | no       |             |
| trailing           | property | `React.ReactNode`                     | no       |             |

## MessageBubbleStatus

Kind: `unknown`
Module: `src/patterns/message-bubble/types.ts`
Source: `src/patterns/message-bubble/types.ts:9:1`

## MetricCard

Kind: `value`
Module: `src/components/metric-card/MetricCard.tsx`
Source: `src/components/metric-card/MetricCard.tsx:87:14`

Highlights a key metric with label, value, and optional trend/actions.

## MetricCardProps

Kind: `type`
Module: `src/components/metric-card/types.ts`
Source: `src/components/metric-card/types.ts:7:1`

### Members

| Name        | Kind     | Type                                                                                                                                          | Required | Description |
| ----------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| actions     | property | `React.ReactNode`                                                                                                                             | no       |             |
| compact     | property | `boolean \| undefined`                                                                                                                        | no       |             |
| delta       | property | `React.ReactNode`                                                                                                                             | no       |             |
| deltaColor  | property | `"primary" \| "secondary" \| "tertiary" \| "quaternary" \| "neutral" \| "success" \| "warning" \| "error" \| "info" \| "danger" \| undefined` | no       |             |
| description | property | `React.ReactNode`                                                                                                                             | no       |             |
| icon        | property | `ButtonIconSpec \| undefined`                                                                                                                 | no       |             |
| label       | property | `React.ReactNode`                                                                                                                             | yes      |             |
| mode        | property | `ZoraThemeMode \| undefined`                                                                                                                  | no       |             |
| onPress     | property | `(() => void) \| undefined`                                                                                                                   | no       |             |
| testID      | property | `string \| undefined`                                                                                                                         | no       |             |
| themeId     | property | `string \| undefined`                                                                                                                         | no       |             |
| tone        | property | `ZoraCardTone \| undefined`                                                                                                                   | no       |             |
| value       | property | `React.ReactNode`                                                                                                                             | yes      |             |

## Modal

Kind: `value`
Module: `src/components/modal/Modal.tsx`
Source: `src/components/modal/Modal.tsx:62:14`

Modal dialog surface with header/content/footer slots.

## ModalProps

Kind: `type`
Module: `src/components/modal/types.ts`
Source: `src/components/modal/types.ts:7:1`

### Members

| Name            | Kind     | Type                            | Required | Description |
| --------------- | -------- | ------------------------------- | -------- | ----------- |
| children        | property | `React.ReactNode`               | no       |             |
| closeOnBackdrop | property | `boolean \| undefined`          | no       |             |
| description     | property | `React.ReactNode`               | no       |             |
| footer          | property | `React.ReactNode`               | no       |             |
| mode            | property | `ZoraThemeMode \| undefined`    | no       |             |
| onDismiss       | property | `(() => void) \| undefined`     | no       |             |
| testID          | property | `string \| undefined`           | no       |             |
| themeId         | property | `string \| undefined`           | no       |             |
| title           | property | `React.ReactNode`               | no       |             |
| visible         | property | `boolean`                       | yes      |             |
| width           | property | `ZoraContentWidth \| undefined` | no       |             |

## NavigationItem

Kind: `value`
Module: `src/components/navigation-item/NavigationItem.tsx`
Source: `src/components/navigation-item/NavigationItem.tsx:39:14`

Renders a single navigation entry with active/disabled state support.

## NavigationItemProps

Kind: `type`
Module: `src/components/navigation-item/types.ts`
Source: `src/components/navigation-item/types.ts:20:1`

### Members

| Name     | Kind     | Type                                       | Required | Description |
| -------- | -------- | ------------------------------------------ | -------- | ----------- |
| active   | property | `boolean \| undefined`                     | no       |             |
| compact  | property | `boolean \| undefined`                     | no       |             |
| metadata | property | `ZoraNavigationRouteMetadata \| undefined` | no       |             |
| mode     | property | `ZoraThemeMode \| undefined`               | no       |             |
| onPress  | property | `(() => void) \| undefined`                | no       |             |
| route    | property | `ZoraNavigationRouteState`                 | yes      |             |
| testID   | property | `string \| undefined`                      | no       |             |
| themeId  | property | `string \| undefined`                      | no       |             |

## NavigationList

Kind: `value`
Module: `src/components/navigation-list/NavigationList.tsx`
Source: `src/components/navigation-list/NavigationList.tsx:65:14`

Renders a navigation list from route metadata with active state mapping.

## NavigationListProps

Kind: `type`
Module: `src/components/navigation-list/types.ts`
Source: `src/components/navigation-list/types.ts:8:1`

### Members

| Name           | Kind     | Type                                                                | Required | Description |
| -------------- | -------- | ------------------------------------------------------------------- | -------- | ----------- |
| activeRouteKey | property | `string \| undefined`                                               | no       |             |
| compact        | property | `boolean \| undefined`                                              | no       |             |
| footer         | property | `React.ReactNode`                                                   | no       |             |
| header         | property | `React.ReactNode`                                                   | no       |             |
| mode           | property | `ZoraThemeMode \| undefined`                                        | no       |             |
| onRoutePress   | property | `((route: ZoraNavigationRouteState) => void) \| undefined`          | no       |             |
| orientation    | property | `"horizontal" \| "vertical" \| undefined`                           | no       |             |
| routeMap       | property | `Partial<Record<string, ZoraNavigationRouteMetadata>> \| undefined` | no       |             |
| routes         | property | `readonly ZoraNavigationRouteState[]`                               | yes      |             |
| testID         | property | `string \| undefined`                                               | no       |             |
| themeId        | property | `string \| undefined`                                               | no       |             |

## Notice

Kind: `value`
Module: `src/patterns/notice/Notice.tsx`
Source: `src/patterns/notice/Notice.tsx:40:14`

Notice pattern for inline feedback with tone, title, and actions.

## NoticeProps

Kind: `type`
Module: `src/patterns/notice/types.ts`
Source: `src/patterns/notice/types.ts:6:1`

### Members

| Name        | Kind     | Type                                                                                                                                          | Required | Description |
| ----------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| actions     | property | `React.ReactNode`                                                                                                                             | no       |             |
| children    | property | `React.ReactNode`                                                                                                                             | no       |             |
| color       | property | `"primary" \| "secondary" \| "tertiary" \| "quaternary" \| "neutral" \| "success" \| "warning" \| "error" \| "info" \| "danger" \| undefined` | no       |             |
| description | property | `React.ReactNode`                                                                                                                             | no       |             |
| mode        | property | `ZoraThemeMode \| undefined`                                                                                                                  | no       |             |
| testID      | property | `string \| undefined`                                                                                                                         | no       |             |
| themeId     | property | `string \| undefined`                                                                                                                         | no       |             |
| title       | property | `React.ReactNode`                                                                                                                             | yes      |             |

## OAuthProviderButton

Kind: `value`
Module: `src/patterns/auth/OAuthProviderButton.tsx`
Source: `src/patterns/auth/OAuthProviderButton.tsx:51:14`

Renders a provider-branded OAuth action button without owning auth behavior.

The component only renders UI and forwards the provider id through `onPress`.
Adapters, redirects, and callback handling belong to app/runtime layers.

## OAuthProviderButtonProps

Kind: `type`
Module: `src/patterns/auth/types.ts`
Source: `src/patterns/auth/types.ts:85:1`

### Members

| Name       | Kind     | Type                                                                                                                                          | Required | Description |
| ---------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| color      | property | `"primary" \| "secondary" \| "tertiary" \| "quaternary" \| "neutral" \| "success" \| "warning" \| "error" \| "info" \| "danger" \| undefined` | no       |             |
| disabled   | property | `boolean \| undefined`                                                                                                                        | no       |             |
| fullWidth  | property | `boolean \| undefined`                                                                                                                        | no       |             |
| icon       | property | `OAuthProviderIconSpec \| undefined`                                                                                                          | no       |             |
| label      | property | `React.ReactNode`                                                                                                                             | no       |             |
| loading    | property | `boolean \| undefined`                                                                                                                        | no       |             |
| mode       | property | `ZoraThemeMode \| undefined`                                                                                                                  | no       |             |
| onPress    | property | `((providerId: string) => void \| Promise<void>) \| undefined`                                                                                | no       |             |
| providerId | property | `string`                                                                                                                                      | yes      |             |
| size       | property | `import("/Users/a_rtiphishl_e/git/zora/src/internal/recipes").ZoraControlSize \| undefined`                                                   | no       |             |
| testID     | property | `string \| undefined`                                                                                                                         | no       |             |
| themeId    | property | `string \| undefined`                                                                                                                         | no       |             |
| variant    | property | `import("/Users/a_rtiphishl_e/git/zora/src/internal/recipes").ZoraButtonVariant \| undefined`                                                 | no       |             |

## OAuthProviderIconSpec

Kind: `type`
Module: `src/patterns/auth/types.ts`
Source: `src/patterns/auth/types.ts:70:1`

### Members

| Name     | Kind     | Type                            | Required | Description |
| -------- | -------- | ------------------------------- | -------- | ----------- |
| color    | property | `string \| undefined`           | no       |             |
| name     | property | `string`                        | yes      |             |
| provider | property | `string \| undefined`           | no       |             |
| size     | property | `string \| number \| undefined` | no       |             |

## OAuthProviderItem

Kind: `type`
Module: `src/patterns/auth/types.ts`
Source: `src/patterns/auth/types.ts:77:1`

### Members

| Name     | Kind     | Type                                 | Required | Description |
| -------- | -------- | ------------------------------------ | -------- | ----------- |
| disabled | property | `boolean \| undefined`               | no       |             |
| icon     | property | `OAuthProviderIconSpec \| undefined` | no       |             |
| id       | property | `string`                             | yes      |             |
| label    | property | `React.ReactNode`                    | no       |             |
| loading  | property | `boolean \| undefined`               | no       |             |

## OAuthProviderList

Kind: `value`
Module: `src/patterns/auth/OAuthProviderList.tsx`
Source: `src/patterns/auth/OAuthProviderList.tsx:54:14`

Renders a group of OAuth provider buttons for sign-in and auth settings flows.

## OAuthProviderListLayout

Kind: `unknown`
Module: `src/patterns/auth/types.ts`
Source: `src/patterns/auth/types.ts:98:1`

## OAuthProviderListProps

Kind: `type`
Module: `src/patterns/auth/types.ts`
Source: `src/patterns/auth/types.ts:100:1`

### Members

| Name            | Kind     | Type                                                                                                                                          | Required | Description |
| --------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| color           | property | `"primary" \| "secondary" \| "tertiary" \| "quaternary" \| "neutral" \| "success" \| "warning" \| "error" \| "info" \| "danger" \| undefined` | no       |             |
| disabled        | property | `boolean \| undefined`                                                                                                                        | no       |             |
| fullWidth       | property | `boolean \| undefined`                                                                                                                        | no       |             |
| layout          | property | `OAuthProviderListLayout \| undefined`                                                                                                        | no       |             |
| loading         | property | `boolean \| undefined`                                                                                                                        | no       |             |
| mode            | property | `ZoraThemeMode \| undefined`                                                                                                                  | no       |             |
| onProviderPress | property | `((providerId: string) => void \| Promise<void>) \| undefined`                                                                                | no       |             |
| providers       | property | `readonly OAuthProviderItem[]`                                                                                                                | yes      |             |
| size            | property | `import("/Users/a_rtiphishl_e/git/zora/src/internal/recipes").ZoraControlSize \| undefined`                                                   | no       |             |
| testID          | property | `string \| undefined`                                                                                                                         | no       |             |
| themeId         | property | `string \| undefined`                                                                                                                         | no       |             |
| variant         | property | `import("/Users/a_rtiphishl_e/git/zora/src/internal/recipes").ZoraButtonVariant \| undefined`                                                 | no       |             |

## OtpForm

Kind: `value`
Module: `src/patterns/auth/OtpForm.tsx`
Source: `src/patterns/auth/OtpForm.tsx:90:14`

One-time passcode form pattern with digit input and submit actions.

## OtpFormProps

Kind: `type`
Module: `src/patterns/auth/types.ts`
Source: `src/patterns/auth/types.ts:60:1`

### Members

| Name           | Kind     | Type                                               | Required | Description |
| -------------- | -------- | -------------------------------------------------- | -------- | ----------- |
| disabled       | property | `boolean \| undefined`                             | no       |             |
| error          | property | `React.ReactNode`                                  | no       |             |
| length         | property | `number \| undefined`                              | no       |             |
| loading        | property | `boolean \| undefined`                             | no       |             |
| mode           | property | `ZoraThemeMode \| undefined`                       | no       |             |
| onResend       | property | `(() => void \| Promise<void>) \| undefined`       | no       |             |
| onSubmit       | property | `(values: OtpFormValues) => void \| Promise<void>` | yes      |             |
| otpLabel       | property | `React.ReactNode`                                  | no       |             |
| resendDisabled | property | `boolean \| undefined`                             | no       |             |
| resendLabel    | property | `React.ReactNode`                                  | no       |             |
| resendLoading  | property | `boolean \| undefined`                             | no       |             |
| submitLabel    | property | `React.ReactNode`                                  | no       |             |
| testID         | property | `string \| undefined`                              | no       |             |
| themeId        | property | `string \| undefined`                              | no       |             |

## OtpFormValues

Kind: `type`
Module: `src/patterns/auth/types.ts`
Source: `src/patterns/auth/types.ts:56:1`

### Members

| Name | Kind     | Type     | Required | Description |
| ---- | -------- | -------- | -------- | ----------- |
| otp  | property | `string` | yes      |             |

## Pagination

Kind: `value`
Module: `src/components/pagination/Pagination.tsx`
Source: `src/components/pagination/Pagination.tsx:192:14`

Pagination control for navigating between pages of results.

## PaginationProps

Kind: `type`
Module: `src/components/pagination/types.ts`
Source: `src/components/pagination/types.ts:5:1`

### Members

| Name          | Kind     | Type                                    | Required | Description |
| ------------- | -------- | --------------------------------------- | -------- | ----------- |
| boundaryCount | property | `number \| undefined`                   | no       |             |
| compact       | property | `boolean \| undefined`                  | no       |             |
| disabled      | property | `boolean \| undefined`                  | no       |             |
| firstLabel    | property | `React.ReactNode`                       | no       |             |
| lastLabel     | property | `React.ReactNode`                       | no       |             |
| mode          | property | `ZoraThemeMode \| undefined`            | no       |             |
| nextLabel     | property | `React.ReactNode`                       | no       |             |
| onPageChange  | property | `((page: number) => void) \| undefined` | no       |             |
| page          | property | `number`                                | yes      |             |
| pageCount     | property | `number`                                | yes      |             |
| previousLabel | property | `React.ReactNode`                       | no       |             |
| showFirstLast | property | `boolean \| undefined`                  | no       |             |
| siblingCount  | property | `number \| undefined`                   | no       |             |
| testID        | property | `string \| undefined`                   | no       |             |
| themeId       | property | `string \| undefined`                   | no       |             |

## PaletteItem

Kind: `value`
Module: `src/patterns/tile-grid/PaletteItem.tsx`
Source: `src/patterns/tile-grid/PaletteItem.tsx:62:14`

Tile item pattern for palettes and option grids.

## PaletteItemProps

Kind: `type`
Module: `src/patterns/tile-grid/types.ts`
Source: `src/patterns/tile-grid/types.ts:12:1`

### Members

| Name        | Kind     | Type                          | Required | Description |
| ----------- | -------- | ----------------------------- | -------- | ----------- |
| badge       | property | `ReactNode`                   | no       |             |
| description | property | `ReactNode`                   | no       |             |
| disabled    | property | `boolean \| undefined`        | no       |             |
| icon        | property | `ButtonIconSpec \| undefined` | no       |             |
| mode        | property | `ZoraThemeMode \| undefined`  | no       |             |
| onPress     | property | `(() => void) \| undefined`   | no       |             |
| selected    | property | `boolean \| undefined`        | no       |             |
| testID      | property | `string \| undefined`         | no       |             |
| themeId     | property | `string \| undefined`         | no       |             |
| title       | property | `ReactNode`                   | yes      |             |

## Panel

Kind: `value`
Module: `src/patterns/panel/Panel.tsx`
Source: `src/patterns/panel/Panel.tsx:16:14`

Semantic wrapper around `Card` for panel-style page sections.

## PanelProps

Kind: `type`
Module: `src/patterns/panel/types.ts`
Source: `src/patterns/panel/types.ts:6:1`

### Members

| Name        | Kind     | Type                         | Required | Description |
| ----------- | -------- | ---------------------------- | -------- | ----------- |
| actions     | property | `React.ReactNode`            | no       |             |
| children    | property | `React.ReactNode`            | no       |             |
| compact     | property | `boolean \| undefined`       | no       |             |
| description | property | `React.ReactNode`            | no       |             |
| eyebrow     | property | `React.ReactNode`            | no       |             |
| footer      | property | `React.ReactNode`            | no       |             |
| mode        | property | `ZoraThemeMode \| undefined` | no       |             |
| testID      | property | `string \| undefined`        | no       |             |
| themeId     | property | `string \| undefined`        | no       |             |
| title       | property | `React.ReactNode`            | no       |             |
| tone        | property | `ZoraCardTone \| undefined`  | no       |             |

## PostAction

Kind: `type`
Module: `src/patterns/post-card/types.ts`
Source: `src/patterns/post-card/types.ts:41:1`

### Members

| Name     | Kind     | Type                          | Required | Description |
| -------- | -------- | ----------------------------- | -------- | ----------- |
| count    | property | `React.ReactNode`             | no       |             |
| disabled | property | `boolean \| undefined`        | no       |             |
| icon     | property | `ButtonIconSpec \| undefined` | no       |             |
| id       | property | `string`                      | yes      |             |
| label    | property | `string`                      | yes      |             |
| onPress  | property | `(() => void) \| undefined`   | no       |             |
| selected | property | `boolean \| undefined`        | no       |             |

## PostAuthor

Kind: `type`
Module: `src/patterns/post-card/types.ts`
Source: `src/patterns/post-card/types.ts:19:1`

### Members

| Name     | Kind     | Type                            | Required | Description |
| -------- | -------- | ------------------------------- | -------- | ----------- |
| avatar   | property | `PostAuthorAvatar \| undefined` | no       |             |
| name     | property | `React.ReactNode`               | yes      |             |
| subtitle | property | `React.ReactNode`               | no       |             |

## PostAuthorAvatar

Kind: `type`
Module: `src/patterns/post-card/types.ts`
Source: `src/patterns/post-card/types.ts:9:1`

### Members

| Name     | Kind     | Type                                                                                                                                          | Required | Description |
| -------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| color    | property | `"primary" \| "secondary" \| "tertiary" \| "quaternary" \| "neutral" \| "success" \| "warning" \| "error" \| "info" \| "danger" \| undefined` | no       |             |
| initials | property | `string \| undefined`                                                                                                                         | no       |             |
| label    | property | `string \| undefined`                                                                                                                         | no       |             |
| name     | property | `string \| undefined`                                                                                                                         | no       |             |
| shape    | property | `AvatarShape \| undefined`                                                                                                                    | no       |             |
| size     | property | `AvatarSize \| undefined`                                                                                                                     | no       |             |
| source   | property | `ImageSourcePropType \| undefined`                                                                                                            | no       |             |

## PostCard

Kind: `value`
Module: `src/patterns/post-card/PostCard.tsx`
Source: `src/patterns/post-card/PostCard.tsx:239:14`

Social-style post card pattern with author, content, media, and actions.

## PostCardMedia

Kind: `unknown`
Module: `src/patterns/post-card/types.ts`
Source: `src/patterns/post-card/types.ts:39:1`

## PostCardProps

Kind: `type`
Module: `src/patterns/post-card/types.ts`
Source: `src/patterns/post-card/types.ts:59:1`

### Members

| Name         | Kind     | Type                                                     | Required | Description |
| ------------ | -------- | -------------------------------------------------------- | -------- | ----------- |
| actions      | property | `readonly PostAction[] \| undefined`                     | no       |             |
| author       | property | `PostAuthor`                                             | yes      |             |
| children     | property | `React.ReactNode`                                        | no       |             |
| comments     | property | `readonly PostCommentPreview[] \| undefined`             | no       |             |
| compact      | property | `boolean \| undefined`                                   | no       |             |
| footer       | property | `React.ReactNode`                                        | no       |             |
| headerAction | property | `React.ReactNode`                                        | no       |             |
| media        | property | `PostCardMedia \| readonly PostCardMedia[] \| undefined` | no       |             |
| mode         | property | `ZoraThemeMode \| undefined`                             | no       |             |
| onPress      | property | `(() => void) \| undefined`                              | no       |             |
| testID       | property | `string \| undefined`                                    | no       |             |
| text         | property | `React.ReactNode`                                        | no       |             |
| themeId      | property | `string \| undefined`                                    | no       |             |
| tone         | property | `ZoraCardTone \| undefined`                              | no       |             |

## Progress

Kind: `value`
Module: `src/components/progress/Progress.tsx`
Source: `src/components/progress/Progress.tsx:53:14`

Progress indicator for determinate and indeterminate loading states.

## ProgressProps

Kind: `type`
Module: `src/components/progress/types.ts`
Source: `src/components/progress/types.ts:6:1`

### Members

| Name    | Kind     | Type                                                                                                                                          | Required | Description |
| ------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| color   | property | `"primary" \| "secondary" \| "tertiary" \| "quaternary" \| "neutral" \| "success" \| "warning" \| "error" \| "info" \| "danger" \| undefined` | no       |             |
| max     | property | `number \| undefined`                                                                                                                         | no       |             |
| mode    | property | `ZoraThemeMode \| undefined`                                                                                                                  | no       |             |
| size    | property | `ZoraControlSize \| undefined`                                                                                                                | no       |             |
| testID  | property | `string \| undefined`                                                                                                                         | no       |             |
| themeId | property | `string \| undefined`                                                                                                                         | no       |             |
| value   | property | `number`                                                                                                                                      | yes      |             |

## Radio

Kind: `value`
Module: `src/components/radio/Radio.tsx`
Source: `src/components/radio/Radio.tsx:14:14`

Single-choice selection control used within a radio group.

## RadioGroup

Kind: `value`
Module: `src/components/radio/RadioGroup.tsx`
Source: `src/components/radio/RadioGroup.tsx:62:14`

Renders a group of radio options for selecting a single value.

## RadioGroupOption

Kind: `type`
Module: `src/components/radio/types.ts`
Source: `src/components/radio/types.ts:8:1`

### Members

| Name        | Kind     | Type                   | Required | Description |
| ----------- | -------- | ---------------------- | -------- | ----------- |
| description | property | `React.ReactNode`      | no       |             |
| disabled    | property | `boolean \| undefined` | no       |             |
| label       | property | `React.ReactNode`      | yes      |             |
| testID      | property | `string \| undefined`  | no       |             |
| value       | property | `TValue`               | yes      |             |

## RadioGroupProps

Kind: `type`
Module: `src/components/radio/types.ts`
Source: `src/components/radio/types.ts:16:1`

### Members

| Name          | Kind     | Type                                                                                                                                          | Required | Description |
| ------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| color         | property | `"primary" \| "secondary" \| "tertiary" \| "quaternary" \| "neutral" \| "success" \| "warning" \| "error" \| "info" \| "danger" \| undefined` | no       |             |
| disabled      | property | `boolean \| undefined`                                                                                                                        | no       |             |
| gap           | property | `"xs" \| "s" \| "m" \| "l" \| undefined`                                                                                                      | no       |             |
| invalid       | property | `boolean \| undefined`                                                                                                                        | no       |             |
| mode          | property | `ZoraThemeMode \| undefined`                                                                                                                  | no       |             |
| onValueChange | property | `(value: TValue) => void`                                                                                                                     | yes      |             |
| options       | property | `readonly RadioGroupOption<TValue>[]`                                                                                                         | yes      |             |
| orientation   | property | `"horizontal" \| "vertical" \| undefined`                                                                                                     | no       |             |
| readOnly      | property | `boolean \| undefined`                                                                                                                        | no       |             |
| size          | property | `ControlSize \| undefined`                                                                                                                    | no       |             |
| testID        | property | `string \| undefined`                                                                                                                         | no       |             |
| themeId       | property | `string \| undefined`                                                                                                                         | no       |             |
| value         | property | `TValue`                                                                                                                                      | yes      |             |

## RadioProps

Kind: `type`
Module: `src/components/radio/types.ts`
Source: `src/components/radio/types.ts:6:1`

### Members

| Name               | Kind     | Type                                                                                                                                          | Required | Description |
| ------------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| accessibilityLabel | property | `string \| undefined`                                                                                                                         | no       |             |
| accessible         | property | `boolean \| undefined`                                                                                                                        | no       |             |
| alignSelf          | property | `Responsive<"auto" \| import("/Users/a_rtiphishl_e/git/zora/node_modules/react-native/types/index").FlexAlignType \| undefined>`              | no       |             |
| bg                 | property | `Responsive<ColorValue> \| undefined`                                                                                                         | no       |             |
| borderColor        | property | `Responsive<ColorValue> \| undefined`                                                                                                         | no       |             |
| borderWidth        | property | `Responsive<number> \| undefined`                                                                                                             | no       |             |
| bottom             | property | `Responsive<number> \| undefined`                                                                                                             | no       |             |
| checked            | property | `boolean \| undefined`                                                                                                                        | no       |             |
| children           | property | `React.ReactNode`                                                                                                                             | no       |             |
| color              | property | `"primary" \| "secondary" \| "tertiary" \| "quaternary" \| "neutral" \| "success" \| "warning" \| "error" \| "info" \| "danger" \| undefined` | no       |             |
| defaultChecked     | property | `boolean \| undefined`                                                                                                                        | no       |             |
| disabled           | property | `boolean \| undefined`                                                                                                                        | no       |             |
| flex               | property | `Responsive<number> \| undefined`                                                                                                             | no       |             |
| flexBasis          | property | `Responsive<string \| number> \| undefined`                                                                                                   | no       |             |
| flexGrow           | property | `Responsive<number> \| undefined`                                                                                                             | no       |             |
| flexShrink         | property | `Responsive<number> \| undefined`                                                                                                             | no       |             |
| height             | property | `Responsive<string \| number> \| undefined`                                                                                                   | no       |             |
| invalid            | property | `boolean \| undefined`                                                                                                                        | no       |             |
| left               | property | `Responsive<number> \| undefined`                                                                                                             | no       |             |
| m                  | property | `Responsive<SpaceValue> \| undefined`                                                                                                         | no       |             |
| maxHeight          | property | `Responsive<string \| number> \| undefined`                                                                                                   | no       |             |
| maxWidth           | property | `Responsive<string \| number> \| undefined`                                                                                                   | no       |             |
| mb                 | property | `Responsive<SpaceValue> \| undefined`                                                                                                         | no       |             |
| minHeight          | property | `Responsive<string \| number> \| undefined`                                                                                                   | no       |             |
| minWidth           | property | `Responsive<string \| number> \| undefined`                                                                                                   | no       |             |
| ml                 | property | `Responsive<SpaceValue> \| undefined`                                                                                                         | no       |             |
| mode               | property | `ZoraThemeMode \| undefined`                                                                                                                  | no       |             |
| mr                 | property | `Responsive<SpaceValue> \| undefined`                                                                                                         | no       |             |
| mt                 | property | `Responsive<SpaceValue> \| undefined`                                                                                                         | no       |             |
| mx                 | property | `Responsive<SpaceValue> \| undefined`                                                                                                         | no       |             |
| my                 | property | `Responsive<SpaceValue> \| undefined`                                                                                                         | no       |             |
| onCheckedChange    | property | `((checked: boolean) => void) \| undefined`                                                                                                   | no       |             |
| onLongPress        | property | `((event: GestureResponderEvent) => void) \| undefined`                                                                                       | no       |             |
| opacity            | property | `Responsive<number> \| undefined`                                                                                                             | no       |             |
| overflow           | property | `Responsive<"visible" \| "hidden" \| "scroll" \| undefined>`                                                                                  | no       |             |
| p                  | property | `Responsive<SpaceValue> \| undefined`                                                                                                         | no       |             |
| pb                 | property | `Responsive<SpaceValue> \| undefined`                                                                                                         | no       |             |
| pl                 | property | `Responsive<SpaceValue> \| undefined`                                                                                                         | no       |             |
| position           | property | `Responsive<"absolute" \| "relative" \| "static" \| undefined>`                                                                               | no       |             |
| pr                 | property | `Responsive<SpaceValue> \| undefined`                                                                                                         | no       |             |
| pt                 | property | `Responsive<SpaceValue> \| undefined`                                                                                                         | no       |             |
| px                 | property | `Responsive<SpaceValue> \| undefined`                                                                                                         | no       |             |
| py                 | property | `Responsive<SpaceValue> \| undefined`                                                                                                         | no       |             |
| radius             | property | `Responsive<RadiusValue> \| undefined`                                                                                                        | no       |             |
| readOnly           | property | `boolean \| undefined`                                                                                                                        | no       |             |
| right              | property | `Responsive<number> \| undefined`                                                                                                             | no       |             |
| size               | property | `ControlSize \| undefined`                                                                                                                    | no       |             |
| testID             | property | `string \| undefined`                                                                                                                         | no       |             |
| themeId            | property | `string \| undefined`                                                                                                                         | no       |             |
| top                | property | `Responsive<number> \| undefined`                                                                                                             | no       |             |
| width              | property | `Responsive<string \| number> \| undefined`                                                                                                   | no       |             |
| zIndex             | property | `Responsive<number> \| undefined`                                                                                                             | no       |             |

## Rating

Kind: `value`
Module: `src/components/rating/Rating.tsx`
Source: `src/components/rating/Rating.tsx:41:14`

Displays a star-based rating value with optional half steps.

## RatingProps

Kind: `type`
Module: `src/components/rating/types.ts`
Source: `src/components/rating/types.ts:6:1`

### Members

| Name    | Kind     | Type                                                                                                                                          | Required | Description |
| ------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| color   | property | `"primary" \| "secondary" \| "tertiary" \| "quaternary" \| "neutral" \| "success" \| "warning" \| "error" \| "info" \| "danger" \| undefined` | no       |             |
| max     | property | `number \| undefined`                                                                                                                         | no       |             |
| mode    | property | `ZoraThemeMode \| undefined`                                                                                                                  | no       |             |
| size    | property | `ZoraControlSize \| undefined`                                                                                                                | no       |             |
| testID  | property | `string \| undefined`                                                                                                                         | no       |             |
| themeId | property | `string \| undefined`                                                                                                                         | no       |             |
| value   | property | `number`                                                                                                                                      | yes      |             |

## resolveAvatarInitials

Kind: `function`
Module: `src/components/avatar/resolveAvatarInitials.ts`
Source: `src/components/avatar/resolveAvatarInitials.ts:20:1`

### Signatures

- `(name: string | undefined) => string | null`
  - name: `string | undefined`
  - returns: `string | null`

## resolveOAuthProviderIcon

Kind: `function`
Module: `src/patterns/auth/oauthProviders.ts`
Source: `src/patterns/auth/oauthProviders.ts:49:1`

### Signatures

- `(providerId: string) => OAuthProviderIconSpec | undefined`
  - providerId: `string`
  - returns: `OAuthProviderIconSpec | undefined`

## resolveOAuthProviderLabel

Kind: `function`
Module: `src/patterns/auth/oauthProviders.ts`
Source: `src/patterns/auth/oauthProviders.ts:57:1`

### Signatures

- `(providerId: string) => string`
  - providerId: `string`
  - returns: `string`

## ResponsivePanel

Kind: `value`
Module: `src/patterns/responsive-panel/ResponsivePanel.tsx`
Source: `src/patterns/responsive-panel/ResponsivePanel.tsx:159:14`

Adaptive secondary surface that can render as an inline panel, drawer, or modal.

Use `ResponsivePanel` for tool panes and admin/detail flows that need the same
content to work across compact mobile screens and wider desktop layouts.

## ResponsivePanelDesktopMode

Kind: `unknown`
Module: `src/patterns/responsive-panel/types.ts`
Source: `src/patterns/responsive-panel/types.ts:6:1`

## ResponsivePanelMobileMode

Kind: `unknown`
Module: `src/patterns/responsive-panel/types.ts`
Source: `src/patterns/responsive-panel/types.ts:7:1`

## ResponsivePanelProps

Kind: `type`
Module: `src/patterns/responsive-panel/types.ts`
Source: `src/patterns/responsive-panel/types.ts:11:1`

### Members

| Name         | Kind     | Type                                      | Required | Description |
| ------------ | -------- | ----------------------------------------- | -------- | ----------- |
| actions      | property | `React.ReactNode`                         | no       |             |
| children     | property | `React.ReactNode`                         | no       |             |
| compact      | property | `boolean \| undefined`                    | no       |             |
| description  | property | `React.ReactNode`                         | no       |             |
| desktopMode  | property | `ResponsivePanelDesktopMode \| undefined` | no       |             |
| footer       | property | `React.ReactNode`                         | no       |             |
| mobileMode   | property | `ResponsivePanelMobileMode \| undefined`  | no       |             |
| mode         | property | `ZoraThemeMode \| undefined`              | no       |             |
| onOpenChange | property | `(open: boolean) => void`                 | yes      |             |
| open         | property | `boolean`                                 | yes      |             |
| scroll       | property | `ResponsivePanelScroll \| undefined`      | no       |             |
| side         | property | `ResponsivePanelSide \| undefined`        | no       |             |
| size         | property | `ResponsivePanelSize \| undefined`        | no       |             |
| testID       | property | `string \| undefined`                     | no       |             |
| themeId      | property | `string \| undefined`                     | no       |             |
| title        | property | `React.ReactNode`                         | no       |             |

## ResponsivePanelScroll

Kind: `unknown`
Module: `src/patterns/responsive-panel/types.ts`
Source: `src/patterns/responsive-panel/types.ts:9:1`

## ResponsivePanelSide

Kind: `unknown`
Module: `src/patterns/responsive-panel/types.ts`
Source: `src/patterns/responsive-panel/types.ts:5:1`

## ResponsivePanelSize

Kind: `unknown`
Module: `src/patterns/responsive-panel/types.ts`
Source: `src/patterns/responsive-panel/types.ts:8:1`

## ScanOverlay

Kind: `value`
Module: `src/patterns/scanner/ScanOverlay.tsx`
Source: `src/patterns/scanner/ScanOverlay.tsx:99:14`

Camera-agnostic scan frame overlay for barcode and QR scanning flows.

`ScanOverlay` intentionally renders no native camera. Apps provide camera
capability separately while ZORA owns the visible scan affordance.

## ScanOverlayProps

Kind: `type`
Module: `src/patterns/scanner/types.ts`
Source: `src/patterns/scanner/types.ts:13:1`

### Members

| Name        | Kind     | Type                         | Required | Description |
| ----------- | -------- | ---------------------------- | -------- | ----------- |
| cornerLabel | property | `React.ReactNode`            | no       |             |
| description | property | `React.ReactNode`            | no       |             |
| mode        | property | `ZoraThemeMode \| undefined` | no       |             |
| testID      | property | `string \| undefined`        | no       |             |
| themeId     | property | `string \| undefined`        | no       |             |
| title       | property | `React.ReactNode`            | no       |             |

## Screen

Kind: `value`
Module: `src/layout/screen/Screen.tsx`
Source: `src/layout/screen/Screen.tsx:47:14`

Page-level container with standard background and optional scroll behavior.

## ScreenProps

Kind: `type`
Module: `src/layout/screen/types.ts`
Source: `src/layout/screen/types.ts:6:1`

### Members

| Name     | Kind     | Type                            | Required | Description |
| -------- | -------- | ------------------------------- | -------- | ----------- |
| children | property | `React.ReactNode`               | no       |             |
| footer   | property | `React.ReactNode`               | no       |             |
| mode     | property | `ZoraThemeMode \| undefined`    | no       |             |
| scroll   | property | `boolean \| undefined`          | no       |             |
| testID   | property | `string \| undefined`           | no       |             |
| themeId  | property | `string \| undefined`           | no       |             |
| width    | property | `ZoraContentWidth \| undefined` | no       |             |

## ScreenSection

Kind: `value`
Module: `src/layout/screen-section/ScreenSection.tsx`
Source: `src/layout/screen-section/ScreenSection.tsx:30:14`

Screen section layout with optional title, description, and actions.

## ScreenSectionProps

Kind: `type`
Module: `src/layout/screen-section/types.ts`
Source: `src/layout/screen-section/types.ts:5:1`

### Members

| Name        | Kind     | Type                         | Required | Description |
| ----------- | -------- | ---------------------------- | -------- | ----------- |
| actions     | property | `React.ReactNode`            | no       |             |
| children    | property | `React.ReactNode`            | no       |             |
| description | property | `React.ReactNode`            | no       |             |
| mode        | property | `ZoraThemeMode \| undefined` | no       |             |
| testID      | property | `string \| undefined`        | no       |             |
| themeId     | property | `string \| undefined`        | no       |             |
| title       | property | `React.ReactNode`            | no       |             |

## SearchBar

Kind: `value`
Module: `src/components/search-bar/SearchBar.tsx`
Source: `src/components/search-bar/SearchBar.tsx:53:14`

Search input with leading icon and optional trailing action.

## SearchBarProps

Kind: `type`
Module: `src/components/search-bar/types.ts`
Source: `src/components/search-bar/types.ts:4:1`

### Members

| Name          | Kind     | Type                                     | Required | Description |
| ------------- | -------- | ---------------------------------------- | -------- | ----------- |
| clearable     | property | `boolean \| undefined`                   | no       |             |
| disabled      | property | `boolean \| undefined`                   | no       |             |
| mode          | property | `ZoraThemeMode \| undefined`             | no       |             |
| onClear       | property | `(() => void) \| undefined`              | no       |             |
| onSubmit      | property | `((value: string) => void) \| undefined` | no       |             |
| onValueChange | property | `(value: string) => void`                | yes      |             |
| placeholder   | property | `string \| undefined`                    | no       |             |
| readOnly      | property | `boolean \| undefined`                   | no       |             |
| size          | property | `ZoraControlSize \| undefined`           | no       |             |
| testID        | property | `string \| undefined`                    | no       |             |
| themeId       | property | `string \| undefined`                    | no       |             |
| value         | property | `string`                                 | yes      |             |

## SectionHeader

Kind: `value`
Module: `src/patterns/section-header/SectionHeader.tsx`
Source: `src/patterns/section-header/SectionHeader.tsx:51:14`

Section heading pattern with optional description and action slot.

## SectionHeaderProps

Kind: `type`
Module: `src/patterns/section-header/types.ts`
Source: `src/patterns/section-header/types.ts:5:1`

### Members

| Name        | Kind     | Type                         | Required | Description |
| ----------- | -------- | ---------------------------- | -------- | ----------- |
| actions     | property | `React.ReactNode`            | no       |             |
| description | property | `React.ReactNode`            | no       |             |
| eyebrow     | property | `React.ReactNode`            | no       |             |
| mode        | property | `ZoraThemeMode \| undefined` | no       |             |
| testID      | property | `string \| undefined`        | no       |             |
| themeId     | property | `string \| undefined`        | no       |             |
| title       | property | `React.ReactNode`            | yes      |             |

## Select

Kind: `value`
Module: `src/components/select/Select.tsx`
Source: `src/components/select/Select.tsx:58:14`

Select control for choosing a value from a list of options.

## SelectableItem

Kind: `function`
Module: `src/patterns/selection/SelectableItem.tsx`
Source: `src/patterns/selection/SelectableItem.tsx:23:1`

Adds selection behavior to arbitrary child content via render props.

### Signatures

- `({ id, trigger, disabled = false, children }: SelectableItemProps) => React.JSX.Element`
  - { id, trigger, disabled = false, children }: `SelectableItemProps`
  - returns: `React.JSX.Element`

## SelectableItemProps

Kind: `type`
Module: `src/patterns/selection/types.ts`
Source: `src/patterns/selection/types.ts:38:1`

### Members

| Name     | Kind     | Type                                                                   | Required | Description |
| -------- | -------- | ---------------------------------------------------------------------- | -------- | ----------- |
| children | property | `React.ReactNode \| ((state: SelectableItemState) => React.ReactNode)` | yes      |             |
| disabled | property | `boolean \| undefined`                                                 | no       |             |
| id       | property | `string`                                                               | yes      |             |
| trigger  | property | `SelectionTrigger \| undefined`                                        | no       |             |

## SelectableItemState

Kind: `type`
Module: `src/patterns/selection/types.ts`
Source: `src/patterns/selection/types.ts:28:1`

### Members

| Name     | Kind     | Type            | Required | Description |
| -------- | -------- | --------------- | -------- | ----------- |
| clear    | property | `() => void`    | yes      |             |
| disabled | property | `boolean`       | yes      |             |
| id       | property | `string`        | yes      |             |
| mode     | property | `SelectionMode` | yes      |             |
| select   | property | `() => void`    | yes      |             |
| selected | property | `boolean`       | yes      |             |
| toggle   | property | `() => void`    | yes      |             |

## SelectionMode

Kind: `unknown`
Module: `src/patterns/selection/types.ts`
Source: `src/patterns/selection/types.ts:3:1`

## SelectionProvider

Kind: `function`
Module: `src/patterns/selection/SelectionProvider.tsx`
Source: `src/patterns/selection/SelectionProvider.tsx:40:1`

Provides selection state for building selectable lists and grids.

### Signatures

- `({
  children,
  selectedIds,
  defaultSelectedIds,
  mode,
  disabled,
  onSelectionChange,
}: SelectionProviderProps) => React.JSX.Element`
  - {
    children,
    selectedIds,
    defaultSelectedIds,
    mode,
    disabled,
    onSelectionChange,
    }: `SelectionProviderProps`
  - returns: `React.JSX.Element`

## SelectionProviderProps

Kind: `type`
Module: `src/patterns/selection/types.ts`
Source: `src/patterns/selection/types.ts:7:1`

### Members

| Name               | Kind     | Type                                              | Required | Description |
| ------------------ | -------- | ------------------------------------------------- | -------- | ----------- |
| children           | property | `React.ReactNode`                                 | yes      |             |
| defaultSelectedIds | property | `readonly string[] \| undefined`                  | no       |             |
| disabled           | property | `boolean \| undefined`                            | no       |             |
| mode               | property | `SelectionMode \| undefined`                      | no       |             |
| onSelectionChange  | property | `((ids: readonly string[]) => void) \| undefined` | no       |             |
| selectedIds        | property | `readonly string[] \| undefined`                  | no       |             |

## SelectionTrigger

Kind: `unknown`
Module: `src/patterns/selection/types.ts`
Source: `src/patterns/selection/types.ts:5:1`

## SelectOption

Kind: `type`
Module: `src/components/select/types.ts`
Source: `src/components/select/types.ts:3:1`

### Members

| Name     | Kind     | Type                   | Required | Description |
| -------- | -------- | ---------------------- | -------- | ----------- |
| disabled | property | `boolean \| undefined` | no       |             |
| label    | property | `string`               | yes      |             |
| value    | property | `TValue`               | yes      |             |

## SelectProps

Kind: `type`
Module: `src/components/select/types.ts`
Source: `src/components/select/types.ts:9:1`

### Members

| Name          | Kind     | Type                              | Required | Description |
| ------------- | -------- | --------------------------------- | -------- | ----------- |
| disabled      | property | `boolean \| undefined`            | no       |             |
| invalid       | property | `boolean \| undefined`            | no       |             |
| mode          | property | `ZoraThemeMode \| undefined`      | no       |             |
| onValueChange | property | `(value: TValue) => void`         | yes      |             |
| options       | property | `readonly SelectOption<TValue>[]` | yes      |             |
| testID        | property | `string \| undefined`             | no       |             |
| themeId       | property | `string \| undefined`             | no       |             |
| value         | property | `TValue`                          | yes      |             |

## SettingsLayout

Kind: `value`
Module: `src/layout/settings-layout/SettingsLayout.tsx`
Source: `src/layout/settings-layout/SettingsLayout.tsx:34:14`

Settings page layout with app bar, sidebar, and scrollable content area.

## SettingsLayoutProps

Kind: `type`
Module: `src/layout/settings-layout/types.ts`
Source: `src/layout/settings-layout/types.ts:5:1`

### Members

| Name        | Kind     | Type                         | Required | Description |
| ----------- | -------- | ---------------------------- | -------- | ----------- |
| actions     | property | `React.ReactNode`            | no       |             |
| children    | property | `React.ReactNode`            | no       |             |
| description | property | `React.ReactNode`            | no       |             |
| mode        | property | `ZoraThemeMode \| undefined` | no       |             |
| sidebar     | property | `React.ReactNode`            | yes      |             |
| testID      | property | `string \| undefined`        | no       |             |
| themeId     | property | `string \| undefined`        | no       |             |
| title       | property | `React.ReactNode`            | no       |             |

## SettingsRow

Kind: `value`
Module: `src/patterns/settings-row/SettingsRow.tsx`
Source: `src/patterns/settings-row/SettingsRow.tsx:51:14`

Settings row pattern with title, description/meta, and optional trailing content.

## SettingsRowProps

Kind: `unknown`
Module: `src/patterns/settings-row/types.ts`
Source: `src/patterns/settings-row/types.ts:27:1`

## Show

Kind: `value`
Module: `src/foundation/Show.tsx`
Source: `src/foundation/Show.tsx:18:14`

Conditionally renders children for responsive display and breakpoint-based visibility.

## ShowProps

Kind: `type`
Module: `src/foundation/Show.tsx`
Source: `src/foundation/Show.tsx:7:1`

### Members

| Name     | Kind     | Type                         | Required | Description |
| -------- | -------- | ---------------------------- | -------- | ----------- |
| children | property | `React.ReactNode`            | yes      |             |
| fallback | property | `React.ReactNode`            | no       |             |
| mode     | property | `ZoraThemeMode \| undefined` | no       |             |
| testID   | property | `string \| undefined`        | no       |             |
| themeId  | property | `string \| undefined`        | no       |             |
| when     | property | `Responsive<boolean>`        | yes      |             |

## SidebarLayout

Kind: `value`
Module: `src/layout/sidebar-layout/SidebarLayout.tsx`
Source: `src/layout/sidebar-layout/SidebarLayout.tsx:33:14`

Responsive layout with a sidebar and main content area (and optional aside).

## SidebarLayoutProps

Kind: `type`
Module: `src/layout/sidebar-layout/types.ts`
Source: `src/layout/sidebar-layout/types.ts:5:1`

### Members

| Name         | Kind     | Type                         | Required | Description |
| ------------ | -------- | ---------------------------- | -------- | ----------- |
| aside        | property | `React.ReactNode`            | no       |             |
| asideWidth   | property | `number \| undefined`        | no       |             |
| children     | property | `React.ReactNode`            | no       |             |
| mode         | property | `ZoraThemeMode \| undefined` | no       |             |
| sidebar      | property | `React.ReactNode`            | yes      |             |
| sidebarWidth | property | `number \| undefined`        | no       |             |
| testID       | property | `string \| undefined`        | no       |             |
| themeId      | property | `string \| undefined`        | no       |             |

## SignInForm

Kind: `value`
Module: `src/patterns/auth/SignInForm.tsx`
Source: `src/patterns/auth/SignInForm.tsx:121:14`

Sign-in form pattern with identifier and password fields.

## SignInFormProps

Kind: `type`
Module: `src/patterns/auth/types.ts`
Source: `src/patterns/auth/types.ts:22:1`

### Members

| Name                | Kind     | Type                                                  | Required | Description |
| ------------------- | -------- | ----------------------------------------------------- | -------- | ----------- |
| disabled            | property | `boolean \| undefined`                                | no       |             |
| error               | property | `React.ReactNode`                                     | no       |             |
| forgotPasswordLabel | property | `React.ReactNode`                                     | no       |             |
| identifierLabel     | property | `React.ReactNode`                                     | no       |             |
| identifiers         | property | `readonly AuthIdentifierKind[] \| undefined`          | no       |             |
| loading             | property | `boolean \| undefined`                                | no       |             |
| mode                | property | `ZoraThemeMode \| undefined`                          | no       |             |
| onForgotPassword    | property | `(() => void \| Promise<void>) \| undefined`          | no       |             |
| onSignUp            | property | `(() => void \| Promise<void>) \| undefined`          | no       |             |
| onSubmit            | property | `(values: SignInFormValues) => void \| Promise<void>` | yes      |             |
| secretLabel         | property | `React.ReactNode`                                     | no       |             |
| signUpLabel         | property | `React.ReactNode`                                     | no       |             |
| submitLabel         | property | `React.ReactNode`                                     | no       |             |
| testID              | property | `string \| undefined`                                 | no       |             |
| themeId             | property | `string \| undefined`                                 | no       |             |

## SignInFormValues

Kind: `type`
Module: `src/patterns/auth/types.ts`
Source: `src/patterns/auth/types.ts:16:1`

### Members

| Name           | Kind     | Type                 | Required | Description |
| -------------- | -------- | -------------------- | -------- | ----------- |
| identifier     | property | `string`             | yes      |             |
| identifierKind | property | `AuthIdentifierKind` | yes      |             |
| secret         | property | `string`             | yes      |             |

## SignUpForm

Kind: `value`
Module: `src/patterns/auth/SignUpForm.tsx`
Source: `src/patterns/auth/SignUpForm.tsx:86:14`

Sign-up form pattern with structured fields and validation.

## SignUpFormField

Kind: `unknown`
Module: `src/patterns/auth/types.ts`
Source: `src/patterns/auth/types.ts:34:1`

## SignUpFormProps

Kind: `type`
Module: `src/patterns/auth/types.ts`
Source: `src/patterns/auth/types.ts:36:1`

### Members

| Name        | Kind     | Type                                                  | Required | Description |
| ----------- | -------- | ----------------------------------------------------- | -------- | ----------- |
| disabled    | property | `boolean \| undefined`                                | no       |             |
| error       | property | `React.ReactNode`                                     | no       |             |
| fields      | property | `readonly SignUpFormField[] \| undefined`             | no       |             |
| loading     | property | `boolean \| undefined`                                | no       |             |
| mode        | property | `ZoraThemeMode \| undefined`                          | no       |             |
| onSignIn    | property | `(() => void \| Promise<void>) \| undefined`          | no       |             |
| onSubmit    | property | `(values: SignUpFormValues) => void \| Promise<void>` | yes      |             |
| signInLabel | property | `React.ReactNode`                                     | no       |             |
| submitLabel | property | `React.ReactNode`                                     | no       |             |
| testID      | property | `string \| undefined`                                 | no       |             |
| themeId     | property | `string \| undefined`                                 | no       |             |

## SignUpFormValues

Kind: `unknown`
Module: `src/patterns/auth/types.ts`
Source: `src/patterns/auth/types.ts:33:1`

## Skeleton

Kind: `value`
Module: `src/components/skeleton/Skeleton.tsx`
Source: `src/components/skeleton/Skeleton.tsx:35:14`

Generic skeleton placeholder for loading states.

## SkeletonCard

Kind: `value`
Module: `src/components/skeleton/SkeletonCard.tsx`
Source: `src/components/skeleton/SkeletonCard.tsx:42:14`

Skeleton placeholder that matches the structure of a `Card`.

## SkeletonCardProps

Kind: `type`
Module: `src/components/skeleton/types.ts`
Source: `src/components/skeleton/types.ts:22:1`

### Members

| Name    | Kind     | Type                         | Required | Description |
| ------- | -------- | ---------------------------- | -------- | ----------- |
| actions | property | `boolean \| undefined`       | no       |             |
| compact | property | `boolean \| undefined`       | no       |             |
| lines   | property | `number \| undefined`        | no       |             |
| media   | property | `boolean \| undefined`       | no       |             |
| mode    | property | `ZoraThemeMode \| undefined` | no       |             |
| testID  | property | `string \| undefined`        | no       |             |
| themeId | property | `string \| undefined`        | no       |             |

## SkeletonDimension

Kind: `unknown`
Module: `src/components/skeleton/types.ts`
Source: `src/components/skeleton/types.ts:5:1`

## SkeletonList

Kind: `value`
Module: `src/components/skeleton/SkeletonList.tsx`
Source: `src/components/skeleton/SkeletonList.tsx:57:14`

Skeleton placeholder list for loading states in list views.

## SkeletonListProps

Kind: `type`
Module: `src/components/skeleton/types.ts`
Source: `src/components/skeleton/types.ts:29:1`

### Members

| Name    | Kind     | Type                               | Required | Description |
| ------- | -------- | ---------------------------------- | -------- | ----------- |
| avatar  | property | `boolean \| undefined`             | no       |             |
| compact | property | `boolean \| undefined`             | no       |             |
| lines   | property | `number \| undefined`              | no       |             |
| media   | property | `boolean \| undefined`             | no       |             |
| mode    | property | `ZoraThemeMode \| undefined`       | no       |             |
| rows    | property | `number \| undefined`              | no       |             |
| testID  | property | `string \| undefined`              | no       |             |
| themeId | property | `string \| undefined`              | no       |             |
| variant | property | `SkeletonListVariant \| undefined` | no       |             |

## SkeletonListVariant

Kind: `unknown`
Module: `src/components/skeleton/types.ts`
Source: `src/components/skeleton/types.ts:6:1`

## SkeletonProps

Kind: `type`
Module: `src/components/skeleton/types.ts`
Source: `src/components/skeleton/types.ts:8:1`

### Members

| Name    | Kind     | Type                                                                                                                                                          | Required | Description |
| ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| height  | property | `import("/Users/a_rtiphishl_e/git/zora/node_modules/@ankhorage/surface/dist/index").Responsive<string \| number> \| undefined`                                | no       |             |
| mode    | property | `ZoraThemeMode \| undefined`                                                                                                                                  | no       |             |
| radius  | property | `import("/Users/a_rtiphishl_e/git/zora/node_modules/@ankhorage/surface/dist/index").Responsive<number \| "s" \| "m" \| "l" \| "none" \| "full"> \| undefined` | no       |             |
| testID  | property | `string \| undefined`                                                                                                                                         | no       |             |
| themeId | property | `string \| undefined`                                                                                                                                         | no       |             |
| width   | property | `import("/Users/a_rtiphishl_e/git/zora/node_modules/@ankhorage/surface/dist/index").Responsive<string \| number> \| undefined`                                | no       |             |

## SkeletonRadius

Kind: `unknown`
Module: `src/components/skeleton/types.ts`
Source: `src/components/skeleton/types.ts:4:1`

## SkeletonText

Kind: `value`
Module: `src/components/skeleton/SkeletonText.tsx`
Source: `src/components/skeleton/SkeletonText.tsx:50:14`

Multi-line skeleton placeholder for text content.

## SkeletonTextProps

Kind: `type`
Module: `src/components/skeleton/types.ts`
Source: `src/components/skeleton/types.ts:14:1`

### Members

| Name          | Kind     | Type                                                                                                                                                                                                                 | Required | Description |
| ------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| gap           | property | `import("/Users/a_rtiphishl_e/git/zora/node_modules/@ankhorage/surface/dist/index").Responsive<import("/Users/a_rtiphishl_e/git/zora/node_modules/@ankhorage/surface/dist/layout/helpers").SpaceValue> \| undefined` | no       |             |
| lastLineWidth | property | `import("/Users/a_rtiphishl_e/git/zora/node_modules/@ankhorage/surface/dist/index").Responsive<string \| number> \| undefined`                                                                                       | no       |             |
| lineHeight    | property | `number \| undefined`                                                                                                                                                                                                | no       |             |
| lines         | property | `number \| undefined`                                                                                                                                                                                                | no       |             |
| mode          | property | `ZoraThemeMode \| undefined`                                                                                                                                                                                         | no       |             |
| testID        | property | `string \| undefined`                                                                                                                                                                                                | no       |             |
| themeId       | property | `string \| undefined`                                                                                                                                                                                                | no       |             |
| width         | property | `import("/Users/a_rtiphishl_e/git/zora/node_modules/@ankhorage/surface/dist/index").Responsive<string \| number> \| undefined`                                                                                       | no       |             |

## Spacer

Kind: `value`
Module: `src/foundation/Spacer.tsx`
Source: `src/foundation/Spacer.tsx:21:14`

Adds flexible or fixed empty space in layout compositions.

## SpacerProps

Kind: `type`
Module: `src/foundation/Spacer.tsx`
Source: `src/foundation/Spacer.tsx:10:1`

### Members

| Name    | Kind     | Type                                                | Required | Description |
| ------- | -------- | --------------------------------------------------- | -------- | ----------- |
| axis    | property | `"horizontal" \| "vertical" \| "both" \| undefined` | no       |             |
| mode    | property | `ZoraThemeMode \| undefined`                        | no       |             |
| size    | property | `SpaceValue \| undefined`                           | no       |             |
| testID  | property | `string \| undefined`                               | no       |             |
| themeId | property | `string \| undefined`                               | no       |             |

## SplashScreen

Kind: `value`
Module: `src/components/splash-screen/SplashScreen.tsx`
Source: `src/components/splash-screen/SplashScreen.tsx:98:14`

Branded launch/loading surface for previews, web fallbacks, and app bootstrap states.

`SplashScreen` is a React-rendered component. It intentionally does not manage
Expo's native splash screen lifecycle or replace generated `expo-splash-screen`
configuration.

## SplashScreenLogoShape

Kind: `unknown`
Module: `src/components/splash-screen/types.ts`
Source: `src/components/splash-screen/types.ts:6:1`

## SplashScreenProps

Kind: `type`
Module: `src/components/splash-screen/types.ts`
Source: `src/components/splash-screen/types.ts:8:1`

### Members

| Name            | Kind     | Type                                                                                                                                                                                                                 | Required | Description |
| --------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| backgroundColor | property | `import("/Users/a_rtiphishl_e/git/zora/node_modules/@ankhorage/surface/dist/index").Responsive<import("/Users/a_rtiphishl_e/git/zora/node_modules/@ankhorage/surface/dist/layout/helpers").ColorValue> \| undefined` | no       |             |
| children        | property | `React.ReactNode`                                                                                                                                                                                                    | no       |             |
| logo            | property | `React.ReactNode`                                                                                                                                                                                                    | no       |             |
| logoLabel       | property | `string \| undefined`                                                                                                                                                                                                | no       |             |
| logoShape       | property | `SplashScreenLogoShape \| undefined`                                                                                                                                                                                 | no       |             |
| logoSize        | property | `number \| undefined`                                                                                                                                                                                                | no       |             |
| minHeight       | property | `import("/Users/a_rtiphishl_e/git/zora/node_modules/@ankhorage/surface/dist/index").Responsive<string \| number> \| undefined`                                                                                       | no       |             |
| mode            | property | `ZoraThemeMode \| undefined`                                                                                                                                                                                         | no       |             |
| subtitle        | property | `React.ReactNode`                                                                                                                                                                                                    | no       |             |
| testID          | property | `string \| undefined`                                                                                                                                                                                                | no       |             |
| themeId         | property | `string \| undefined`                                                                                                                                                                                                | no       |             |
| title           | property | `React.ReactNode`                                                                                                                                                                                                    | no       |             |

## Stack

Kind: `value`
Module: `src/foundation/Stack.tsx`
Source: `src/foundation/Stack.tsx:18:14`

Arranges layout items in one direction with theme spacing.

## StackProps

Kind: `type`
Module: `src/foundation/Stack.tsx`
Source: `src/foundation/Stack.tsx:7:1`

### Members

| Name               | Kind     | Type                                                                                                                             | Required | Description |
| ------------------ | -------- | -------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| accessibilityLabel | property | `string \| undefined`                                                                                                            | no       |             |
| accessibilityRole  | property | `import("/Users/a_rtiphishl_e/git/zora/node_modules/react-native/types/index").AccessibilityRole \| undefined`                   | no       |             |
| accessibilityState | property | `import("/Users/a_rtiphishl_e/git/zora/node_modules/react-native/types/index").AccessibilityState \| undefined`                  | no       |             |
| accessible         | property | `boolean \| undefined`                                                                                                           | no       |             |
| align              | property | `Responsive<"flex-start" \| "flex-end" \| "center" \| "stretch" \| "baseline"> \| undefined`                                     | no       |             |
| alignSelf          | property | `Responsive<"auto" \| import("/Users/a_rtiphishl_e/git/zora/node_modules/react-native/types/index").FlexAlignType \| undefined>` | no       |             |
| bg                 | property | `Responsive<ColorValue> \| undefined`                                                                                            | no       |             |
| borderColor        | property | `Responsive<ColorValue> \| undefined`                                                                                            | no       |             |
| borderWidth        | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| bottom             | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| children           | property | `React.ReactNode`                                                                                                                | no       |             |
| direction          | property | `Responsive<"row" \| "column"> \| undefined`                                                                                     | no       |             |
| flex               | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| flexBasis          | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| flexGrow           | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| flexShrink         | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| gap                | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| height             | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| justify            | property | `Responsive<"flex-start" \| "flex-end" \| "center" \| "space-between" \| "space-around" \| "space-evenly"> \| undefined`         | no       |             |
| left               | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| m                  | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| maxHeight          | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| maxWidth           | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| mb                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| minHeight          | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| minWidth           | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| ml                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| mode               | property | `ZoraThemeMode \| undefined`                                                                                                     | no       |             |
| mr                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| mt                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| mx                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| my                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| opacity            | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| overflow           | property | `Responsive<"visible" \| "hidden" \| "scroll" \| undefined>`                                                                     | no       |             |
| p                  | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| pb                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| pl                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| pointerEvents      | property | `"none" \| "auto" \| "box-none" \| "box-only" \| undefined`                                                                      | no       |             |
| position           | property | `Responsive<"absolute" \| "relative" \| "static" \| undefined>`                                                                  | no       |             |
| pr                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| pt                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| px                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| py                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| radius             | property | `Responsive<RadiusValue> \| undefined`                                                                                           | no       |             |
| right              | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| style              | property | `StyleProp<ViewStyle>`                                                                                                           | no       |             |
| testID             | property | `string \| undefined`                                                                                                            | no       |             |
| themeId            | property | `string \| undefined`                                                                                                            | no       |             |
| top                | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| width              | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| wrap               | property | `Responsive<"wrap" \| "nowrap"> \| undefined`                                                                                    | no       |             |
| zIndex             | property | `Responsive<number> \| undefined`                                                                                                | no       |             |

## Surface

Kind: `value`
Module: `src/foundation/Surface.tsx`
Source: `src/foundation/Surface.tsx:25:14`

Provides a semantic themed region for elevated, subtle, or bordered content.

## SurfaceImageSource

Kind: `unknown`
Module: `node_modules/@ankhorage/surface/dist/primitives/image/types.d.ts`
Source: `node_modules/@ankhorage/surface/dist/primitives/image/types.d.ts:4:1`

## SurfaceProps

Kind: `type`
Module: `src/foundation/Surface.tsx`
Source: `src/foundation/Surface.tsx:13:1`

### Members

| Name               | Kind     | Type                                                                                                                             | Required | Description |
| ------------------ | -------- | -------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| accessibilityLabel | property | `string \| undefined`                                                                                                            | no       |             |
| accessibilityRole  | property | `import("/Users/a_rtiphishl_e/git/zora/node_modules/react-native/types/index").AccessibilityRole \| undefined`                   | no       |             |
| accessibilityState | property | `import("/Users/a_rtiphishl_e/git/zora/node_modules/react-native/types/index").AccessibilityState \| undefined`                  | no       |             |
| accessible         | property | `boolean \| undefined`                                                                                                           | no       |             |
| alignSelf          | property | `Responsive<"auto" \| import("/Users/a_rtiphishl_e/git/zora/node_modules/react-native/types/index").FlexAlignType \| undefined>` | no       |             |
| bottom             | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| children           | property | `React.ReactNode`                                                                                                                | no       |             |
| flex               | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| flexBasis          | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| flexGrow           | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| flexShrink         | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| height             | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| left               | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| m                  | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| maxHeight          | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| maxWidth           | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| mb                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| minHeight          | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| minWidth           | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| ml                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| mode               | property | `ZoraThemeMode \| undefined`                                                                                                     | no       |             |
| mr                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| mt                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| mx                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| my                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| opacity            | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| overflow           | property | `Responsive<"visible" \| "hidden" \| "scroll" \| undefined>`                                                                     | no       |             |
| p                  | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| pb                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| pl                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| pointerEvents      | property | `"none" \| "auto" \| "box-none" \| "box-only" \| undefined`                                                                      | no       |             |
| position           | property | `Responsive<"absolute" \| "relative" \| "static" \| undefined>`                                                                  | no       |             |
| pr                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| pt                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| px                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| py                 | property | `Responsive<SpaceValue> \| undefined`                                                                                            | no       |             |
| radius             | property | `Responsive<RadiusValue> \| undefined`                                                                                           | no       |             |
| right              | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| style              | property | `StyleProp<ViewStyle>`                                                                                                           | no       |             |
| testID             | property | `string \| undefined`                                                                                                            | no       |             |
| themeId            | property | `string \| undefined`                                                                                                            | no       |             |
| top                | property | `Responsive<number> \| undefined`                                                                                                | no       |             |
| variant            | property | `SurfaceVariant \| undefined`                                                                                                    | no       |             |
| width              | property | `Responsive<string \| number> \| undefined`                                                                                      | no       |             |
| zIndex             | property | `Responsive<number> \| undefined`                                                                                                | no       |             |

## SurfaceVariant

Kind: `unknown`
Module: `node_modules/@ankhorage/surface/dist/layout/Surface.d.ts`
Source: `node_modules/@ankhorage/surface/dist/layout/Surface.d.ts:3:1`

## SwitchField

Kind: `value`
Module: `src/patterns/switch-field/SwitchField.tsx`
Source: `src/patterns/switch-field/SwitchField.tsx:34:14`

Labeled switch field pattern built on `SettingsRow`.

## SwitchFieldProps

Kind: `type`
Module: `src/patterns/switch-field/types.ts`
Source: `src/patterns/switch-field/types.ts:5:1`

### Members

| Name          | Kind     | Type                         | Required | Description |
| ------------- | -------- | ---------------------------- | -------- | ----------- |
| description   | property | `ReactNode`                  | no       |             |
| disabled      | property | `boolean \| undefined`       | no       |             |
| label         | property | `ReactNode`                  | yes      |             |
| mode          | property | `ZoraThemeMode \| undefined` | no       |             |
| onValueChange | property | `(value: boolean) => void`   | yes      |             |
| testID        | property | `string \| undefined`        | no       |             |
| themeId       | property | `string \| undefined`        | no       |             |
| value         | property | `boolean`                    | yes      |             |

## TabItem

Kind: `type`
Module: `src/components/tabs/types.ts`
Source: `src/components/tabs/types.ts:7:1`

### Members

| Name     | Kind     | Type                          | Required | Description |
| -------- | -------- | ----------------------------- | -------- | ----------- |
| badge    | property | `ReactNode`                   | no       |             |
| disabled | property | `boolean \| undefined`        | no       |             |
| icon     | property | `ButtonIconSpec \| undefined` | no       |             |
| label    | property | `ReactNode`                   | yes      |             |
| testID   | property | `string \| undefined`         | no       |             |
| value    | property | `TValue`                      | yes      |             |

## Tabs

Kind: `value`
Module: `src/components/tabs/Tabs.tsx`
Source: `src/components/tabs/Tabs.tsx:115:14`

Tab navigation for switching between views or content sections.

## TabsProps

Kind: `type`
Module: `src/components/tabs/types.ts`
Source: `src/components/tabs/types.ts:18:1`

### Members

| Name          | Kind     | Type                           | Required | Description |
| ------------- | -------- | ------------------------------ | -------- | ----------- |
| disabled      | property | `boolean \| undefined`         | no       |             |
| items         | property | `readonly TabItem<TValue>[]`   | yes      |             |
| mode          | property | `ZoraThemeMode \| undefined`   | no       |             |
| onValueChange | property | `(value: TValue) => void`      | yes      |             |
| size          | property | `ZoraControlSize \| undefined` | no       |             |
| testID        | property | `string \| undefined`          | no       |             |
| themeId       | property | `string \| undefined`          | no       |             |
| value         | property | `TValue`                       | yes      |             |
| variant       | property | `TabsVariant \| undefined`     | no       |             |

## TabsVariant

Kind: `unknown`
Module: `src/components/tabs/types.ts`
Source: `src/components/tabs/types.ts:16:1`

## Text

Kind: `value`
Module: `src/components/text/Text.tsx`
Source: `src/components/text/Text.tsx:103:14`

Structured copy primitive for theme-aware app text.

`Text` owns normal body, caption, label, code, and supporting-copy variants so
consumers do not need to import lower-level Surface typography directly.

## TextAlign

Kind: `unknown`
Module: `src/components/text/types.ts`
Source: `src/components/text/types.ts:15:1`

## Textarea

Kind: `value`
Module: `src/components/textarea/Textarea.tsx`
Source: `src/components/textarea/Textarea.tsx:54:14`

Multi-line text input with consistent ZORA field styling.

## TextareaProps

Kind: `type`
Module: `src/components/textarea/types.ts`
Source: `src/components/textarea/types.ts:6:1`

### Members

| Name                                   | Kind     | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Required | Description |
| -------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| accessibilityActions                   | property | `readonly Readonly<{ name: AccessibilityActionName \| string; label?: string \| undefined; }>[] \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | no       |             |
| accessibilityElementsHidden            | property | `boolean \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |
| accessibilityHint                      | property | `string \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | no       |             |
| accessibilityIgnoresInvertColors       | property | `boolean \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |
| accessibilityLabel                     | property | `string \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | no       |             |
| accessibilityLabelledBy                | property | `string \| string[] \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | no       |             |
| accessibilityLanguage                  | property | `string \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | no       |             |
| accessibilityLargeContentTitle         | property | `string \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | no       |             |
| accessibilityLiveRegion                | property | `"none" \| "polite" \| "assertive" \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | no       |             |
| accessibilityRespondsToUserInteraction | property | `boolean \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |
| accessibilityRole                      | property | `AccessibilityRole \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | no       |             |
| accessibilityShowsLargeContentViewer   | property | `boolean \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |
| accessibilityState                     | property | `AccessibilityState \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | no       |             |
| accessibilityValue                     | property | `AccessibilityValue \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | no       |             |
| accessibilityViewIsModal               | property | `boolean \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |
| accessible                             | property | `boolean \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |
| allowFontScaling                       | property | `boolean \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |
| aria-busy                              | property | `boolean \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |
| aria-checked                           | property | `boolean \| "mixed" \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | no       |             |
| aria-disabled                          | property | `boolean \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |
| aria-expanded                          | property | `boolean \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |
| aria-hidden                            | property | `boolean \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |
| aria-label                             | property | `string \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | no       |             |
| aria-labelledby                        | property | `string \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | no       |             |
| aria-live                              | property | `"off" \| "polite" \| "assertive" \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | no       |             |
| aria-modal                             | property | `boolean \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |
| aria-selected                          | property | `boolean \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |
| aria-valuemax                          | property | `number \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | no       |             |
| aria-valuemin                          | property | `number \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | no       |             |
| aria-valuenow                          | property | `number \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | no       |             |
| aria-valuetext                         | property | `string \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | no       |             |
| autoCapitalize                         | property | `"none" \| "sentences" \| "words" \| "characters" \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | no       |             |
| autoComplete                           | property | `"email" \| "password" \| "tel" \| "url" \| "additional-name" \| "address-line1" \| "address-line2" \| "birthdate-day" \| "birthdate-full" \| "birthdate-month" \| "birthdate-year" \| "cc-csc" \| "cc-exp" \| "cc-exp-day" \| "cc-exp-month" \| "cc-exp-year" \| "cc-number" \| "cc-name" \| "cc-given-name" \| "cc-middle-name" \| "cc-family-name" \| "cc-type" \| "country" \| "current-password" \| "family-name" \| "gender" \| "given-name" \| "honorific-prefix" \| "honorific-suffix" \| "name" \| "name-family" \| "name-given" \| "name-middle" \| "name-middle-initial" \| "name-prefix" \| "name-suffix" \| "new-password" \| "nickname" \| "one-time-code" \| "organization" \| "organization-title" \| "password-new" \| "postal-address" \| "postal-address-country" \| "postal-address-extended" \| "postal-address-extended-postal-code" \| "postal-address-locality" \| "postal-address-region" \| "postal-code" \| "street-address" \| "sms-otp" \| "tel-country-code" \| "tel-national" \| "tel-device" \| "username" \| "username-new" \| "off" \| undefined` | no       |             |
| autoCorrect                            | property | `boolean \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |
| autoFocus                              | property | `boolean \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |
| blurOnSubmit                           | property | `boolean \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |
| caretHidden                            | property | `boolean \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |
| children                               | property | `React.ReactNode`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | no       |             |
| clearButtonMode                        | property | `"never" \| "while-editing" \| "unless-editing" \| "always" \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | no       |             |
| clearTextOnFocus                       | property | `boolean \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |
| collapsable                            | property | `boolean \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |
| collapsableChildren                    | property | `boolean \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |
| contextMenuHidden                      | property | `boolean \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |
| cursorColor                            | property | `ColorValue \| null \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | no       |             |
| dataDetectorTypes                      | property | `DataDetectorTypes \| DataDetectorTypes[] \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | no       |             |
| defaultValue                           | property | `string \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | no       |             |
| disabled                               | property | `boolean \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |
| disableFullscreenUI                    | property | `boolean \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |
| disableKeyboardShortcuts               | property | `boolean \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |
| enablesReturnKeyAutomatically          | property | `boolean \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |
| enterKeyHint                           | property | `EnterKeyHintTypeOptions \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |
| focusable                              | property | `boolean \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |
| hasTVPreferredFocus                    | property | `boolean \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |
| hitSlop                                | property | `number \| Insets \| null \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | no       |             |
| id                                     | property | `string \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | no       |             |
| importantForAccessibility              | property | `"auto" \| "yes" \| "no" \| "no-hide-descendants" \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | no       |             |
| importantForAutofill                   | property | `"auto" \| "yes" \| "no" \| "noExcludeDescendants" \| "yesExcludeDescendants" \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | no       |             |
| inlineImageLeft                        | property | `string \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | no       |             |
| inlineImagePadding                     | property | `number \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | no       |             |
| inputAccessoryViewButtonLabel          | property | `string \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | no       |             |
| inputAccessoryViewID                   | property | `string \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | no       |             |
| inputMode                              | property | `InputModeOptions \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | no       |             |
| invalid                                | property | `boolean \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |
| isTVSelectable                         | property | `boolean \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |
| keyboardAppearance                     | property | `"light" \| "dark" \| "default" \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | no       |             |
| keyboardType                           | property | `KeyboardTypeOptions \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | no       |             |
| leadingIcon                            | property | `Surface.ButtonIconSpec \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | no       |             |
| lineBreakModeIOS                       | property | `"head" \| "middle" \| "tail" \| "clip" \| "wordWrapping" \| "char" \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | no       |             |
| lineBreakStrategyIOS                   | property | `"none" \| "standard" \| "hangul-word" \| "push-out" \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | no       |             |
| maxFontSizeMultiplier                  | property | `number \| null \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | no       |             |
| maxLength                              | property | `number \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | no       |             |
| mode                                   | property | `ZoraThemeMode \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | no       |             |
| nativeID                               | property | `string \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | no       |             |
| needsOffscreenAlphaCompositing         | property | `boolean \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |
| numberOfLines                          | property | `number \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | no       |             |
| onAccessibilityAction                  | property | `((event: AccessibilityActionEvent) => void) \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | no       |             |
| onAccessibilityEscape                  | property | `(() => void) \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | no       |             |
| onAccessibilityTap                     | property | `(() => void) \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | no       |             |
| onBlur                                 | property | `((e: BlurEvent) => void) \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | no       |             |
| onChange                               | property | `((e: TextInputChangeEvent) => void) \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | no       |             |
| onChangeText                           | property | `((text: string) => void) \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | no       |             |
| onContentSizeChange                    | property | `((e: TextInputContentSizeChangeEvent) => void) \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | no       |             |
| onEndEditing                           | property | `((e: TextInputEndEditingEvent) => void) \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |
| onFocus                                | property | `((e: FocusEvent) => void) \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | no       |             |
| onKeyPress                             | property | `((e: TextInputKeyPressEvent) => void) \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | no       |             |
| onLayout                               | property | `((event: LayoutChangeEvent) => void) \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | no       |             |
| onMagicTap                             | property | `(() => void) \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | no       |             |
| onMoveShouldSetResponder               | property | `((event: GestureResponderEvent) => boolean) \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | no       |             |
| onMoveShouldSetResponderCapture        | property | `((event: GestureResponderEvent) => boolean) \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | no       |             |
| onPointerCancel                        | property | `((event: PointerEvent) => void) \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | no       |             |
| onPointerCancelCapture                 | property | `((event: PointerEvent) => void) \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | no       |             |
| onPointerDown                          | property | `((event: PointerEvent) => void) \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | no       |             |
| onPointerDownCapture                   | property | `((event: PointerEvent) => void) \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | no       |             |
| onPointerEnter                         | property | `((event: PointerEvent) => void) \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | no       |             |
| onPointerEnterCapture                  | property | `((event: PointerEvent) => void) \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | no       |             |
| onPointerLeave                         | property | `((event: PointerEvent) => void) \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | no       |             |
| onPointerLeaveCapture                  | property | `((event: PointerEvent) => void) \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | no       |             |
| onPointerMove                          | property | `((event: PointerEvent) => void) \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | no       |             |
| onPointerMoveCapture                   | property | `((event: PointerEvent) => void) \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | no       |             |
| onPointerUp                            | property | `((event: PointerEvent) => void) \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | no       |             |
| onPointerUpCapture                     | property | `((event: PointerEvent) => void) \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | no       |             |
| onPress                                | property | `((e: NativeSyntheticEvent<NativeTouchEvent>) => void) \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | no       |             |
| onPressIn                              | property | `((e: NativeSyntheticEvent<NativeTouchEvent>) => void) \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | no       |             |
| onPressOut                             | property | `((e: NativeSyntheticEvent<NativeTouchEvent>) => void) \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | no       |             |
| onResponderEnd                         | property | `((event: GestureResponderEvent) => void) \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | no       |             |
| onResponderGrant                       | property | `((event: GestureResponderEvent) => void) \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | no       |             |
| onResponderMove                        | property | `((event: GestureResponderEvent) => void) \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | no       |             |
| onResponderReject                      | property | `((event: GestureResponderEvent) => void) \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | no       |             |
| onResponderRelease                     | property | `((event: GestureResponderEvent) => void) \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | no       |             |
| onResponderStart                       | property | `((event: GestureResponderEvent) => void) \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | no       |             |
| onResponderTerminate                   | property | `((event: GestureResponderEvent) => void) \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | no       |             |
| onResponderTerminationRequest          | property | `((event: GestureResponderEvent) => boolean) \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | no       |             |
| onScroll                               | property | `((e: TextInputScrollEvent) => void) \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | no       |             |
| onSelectionChange                      | property | `((e: TextInputSelectionChangeEvent) => void) \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | no       |             |
| onStartShouldSetResponder              | property | `((event: GestureResponderEvent) => boolean) \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | no       |             |
| onStartShouldSetResponderCapture       | property | `((event: GestureResponderEvent) => boolean) \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | no       |             |
| onSubmitEditing                        | property | `((e: TextInputSubmitEditingEvent) => void) \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | no       |             |
| onTouchCancel                          | property | `((event: GestureResponderEvent) => void) \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | no       |             |
| onTouchEnd                             | property | `((event: GestureResponderEvent) => void) \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | no       |             |
| onTouchEndCapture                      | property | `((event: GestureResponderEvent) => void) \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | no       |             |
| onTouchMove                            | property | `((event: GestureResponderEvent) => void) \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | no       |             |
| onTouchStart                           | property | `((event: GestureResponderEvent) => void) \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | no       |             |
| passwordRules                          | property | `string \| null \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | no       |             |
| placeholder                            | property | `string \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | no       |             |
| pointerEvents                          | property | `"none" \| "auto" \| "box-none" \| "box-only" \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | no       |             |
| readOnly                               | property | `boolean \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |
| rejectResponderTermination             | property | `boolean \| null \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | no       |             |
| removeClippedSubviews                  | property | `boolean \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |
| renderToHardwareTextureAndroid         | property | `boolean \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |
| returnKeyLabel                         | property | `string \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | no       |             |
| returnKeyType                          | property | `ReturnKeyTypeOptions \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | no       |             |
| role                                   | property | `Role \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | no       |             |
| rows                                   | property | `number \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | no       |             |
| screenReaderFocusable                  | property | `boolean \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |
| scrollEnabled                          | property | `boolean \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |
| secureTextEntry                        | property | `boolean \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |
| selection                              | property | `{ start: number; end?: number \| undefined; } \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | no       |             |
| selectionColor                         | property | `ColorValue \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | no       |             |
| selectionHandleColor                   | property | `ColorValue \| null \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | no       |             |
| selectionState                         | property | `DocumentSelectionState \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | no       |             |
| selectTextOnFocus                      | property | `boolean \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |
| shouldRasterizeIOS                     | property | `boolean \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |
| showSoftInputOnFocus                   | property | `boolean \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |
| size                                   | property | `ZoraControlSize \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | no       |             |
| smartInsertDelete                      | property | `boolean \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |
| spellCheck                             | property | `boolean \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |
| style                                  | property | `StyleProp<TextStyle>`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |
| submitBehavior                         | property | `SubmitBehavior \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | no       |             |
| tabIndex                               | property | `0 \| -1 \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |
| testID                                 | property | `string \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | no       |             |
| textAlign                              | property | `"left" \| "right" \| "center" \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | no       |             |
| textAlignVertical                      | property | `"top" \| "bottom" \| "auto" \| "center" \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |
| textBreakStrategy                      | property | `"simple" \| "highQuality" \| "balanced" \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |
| textContentType                        | property | `"none" \| "password" \| "name" \| "nickname" \| "username" \| "URL" \| "addressCity" \| "addressCityAndState" \| "addressState" \| "countryName" \| "creditCardNumber" \| "creditCardExpiration" \| "creditCardExpirationMonth" \| "creditCardExpirationYear" \| "creditCardSecurityCode" \| "creditCardType" \| "creditCardName" \| "creditCardGivenName" \| "creditCardMiddleName" \| "creditCardFamilyName" \| "emailAddress" \| "familyName" \| "fullStreetAddress" \| "givenName" \| "jobTitle" \| "location" \| "middleName" \| "namePrefix" \| "nameSuffix" \| "organizationName" \| "postalCode" \| "streetAddressLine1" \| "streetAddressLine2" \| "sublocality" \| "telephoneNumber" \| "newPassword" \| "oneTimeCode" \| "birthdate" \| "birthdateDay" \| "birthdateMonth" \| "birthdateYear" \| "cellularEID" \| "cellularIMEI" \| "dateTime" \| "flightNumber" \| "shipmentTrackingNumber" \| undefined`                                                                                                                                                              | no       |             |
| themeId                                | property | `string \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | no       |             |
| trailingIcon                           | property | `Surface.ButtonIconSpec \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | no       |             |
| tvParallaxMagnification                | property | `number \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | no       |             |
| tvParallaxShiftDistanceX               | property | `number \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | no       |             |
| tvParallaxShiftDistanceY               | property | `number \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | no       |             |
| tvParallaxTiltAngle                    | property | `number \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | no       |             |
| underlineColorAndroid                  | property | `ColorValue \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | no       |             |
| value                                  | property | `string \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | no       |             |
| verticalAlign                          | property | `"top" \| "bottom" \| "auto" \| "middle" \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | no       |             |

## TextColor

Kind: `unknown`
Module: `src/components/text/types.ts`
Source: `src/components/text/types.ts:10:1`

## TextEmphasis

Kind: `unknown`
Module: `src/components/text/types.ts`
Source: `src/components/text/types.ts:11:1`

## TextProps

Kind: `type`
Module: `src/components/text/types.ts`
Source: `src/components/text/types.ts:17:1`

### Members

| Name               | Kind     | Type                                                                                                                                                      | Required | Description |
| ------------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| accessibilityHint  | property | `string \| undefined`                                                                                                                                     | no       |             |
| accessibilityLabel | property | `string \| undefined`                                                                                                                                     | no       |             |
| accessibilityRole  | property | `AccessibilityRole \| undefined`                                                                                                                          | no       |             |
| align              | property | `Responsive<TextAlign> \| undefined`                                                                                                                      | no       |             |
| children           | property | `React.ReactNode`                                                                                                                                         | no       |             |
| color              | property | `Responsive<"primary" \| "secondary" \| "tertiary" \| "quaternary" \| "neutral" \| "success" \| "warning" \| "error" \| "info" \| "danger"> \| undefined` | no       |             |
| ellipsizeMode      | property | `"head" \| "middle" \| "tail" \| "clip" \| undefined`                                                                                                     | no       |             |
| emphasis           | property | `Responsive<"default" \| "subtle" \| "muted" \| "inverse"> \| undefined`                                                                                  | no       |             |
| i18nKey            | property | `string \| undefined`                                                                                                                                     | no       |             |
| italic             | property | `boolean \| undefined`                                                                                                                                    | no       |             |
| mode               | property | `ZoraThemeMode \| undefined`                                                                                                                              | no       |             |
| nativeID           | property | `string \| undefined`                                                                                                                                     | no       |             |
| numberOfLines      | property | `number \| undefined`                                                                                                                                     | no       |             |
| selectable         | property | `boolean \| undefined`                                                                                                                                    | no       |             |
| testID             | property | `string \| undefined`                                                                                                                                     | no       |             |
| text               | property | `string \| undefined`                                                                                                                                     | no       |             |
| themeId            | property | `string \| undefined`                                                                                                                                     | no       |             |
| variant            | property | `Responsive<TextVariant> \| undefined`                                                                                                                    | no       |             |
| weight             | property | `Responsive<TextWeight> \| undefined`                                                                                                                     | no       |             |

## TextVariant

Kind: `unknown`
Module: `src/components/text/types.ts`
Source: `src/components/text/types.ts:8:1`

## TextWeight

Kind: `unknown`
Module: `src/components/text/types.ts`
Source: `src/components/text/types.ts:13:1`

## ThemeComposer

Kind: `value`
Module: `src/patterns/theme-composer/ThemeComposer.tsx`
Source: `src/patterns/theme-composer/ThemeComposer.tsx:315:14`

UI for composing and applying a theme via structured controls.

## ThemeComposerProps

Kind: `type`
Module: `src/patterns/theme-composer/types.ts`
Source: `src/patterns/theme-composer/types.ts:6:1`

### Members

| Name          | Kind     | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Required | Description |
| ------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| appCategories | property | `readonly ("books_reading" \| "business_productivity" \| "developer_tools" \| "education_learning" \| "entertainment_media" \| "finance_money" \| "food_drink" \| "games" \| "graphics_design" \| "health_fitness" \| "kids_family" \| "lifestyle" \| "medical" \| "music_audio" \| "navigation_travel" \| "news_magazines" \| "photo_video" \| "reference" \| "shopping_commerce" \| "social_community" \| "sports" \| "utilities_tools" \| "weather")[] \| undefined` | no       |             |
| mode          | property | `ZoraThemeMode \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                            | no       |             |
| onChange      | property | `(theme: ZoraTheme) => void`                                                                                                                                                                                                                                                                                                                                                                                                                                            | yes      |             |
| onModeChange  | property | `((mode: ZoraThemeMode) => void) \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                          | no       |             |
| onSubmit      | property | `((theme: ZoraTheme) => void) \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                             | no       |             |
| testID        | property | `string \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                   | no       |             |
| themeId       | property | `string \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                   | no       |             |
| value         | property | `ZoraTheme`                                                                                                                                                                                                                                                                                                                                                                                                                                                             | yes      |             |

## TileGrid

Kind: `value`
Module: `src/patterns/tile-grid/TileGrid.tsx`
Source: `src/patterns/tile-grid/TileGrid.tsx:54:14`

Responsive grid layout for arranging tile content.

## TileGridProps

Kind: `type`
Module: `src/patterns/tile-grid/types.ts`
Source: `src/patterns/tile-grid/types.ts:6:1`

### Members

| Name     | Kind     | Type                                  | Required | Description |
| -------- | -------- | ------------------------------------- | -------- | ----------- |
| children | property | `ReactNode`                           | no       |             |
| columns  | property | `number \| "responsive" \| undefined` | no       |             |
| compact  | property | `boolean \| undefined`                | no       |             |
| mode     | property | `ZoraThemeMode \| undefined`          | no       |             |
| testID   | property | `string \| undefined`                 | no       |             |
| themeId  | property | `string \| undefined`                 | no       |             |

## Timeline

Kind: `value`
Module: `src/patterns/timeline/Timeline.tsx`
Source: `src/patterns/timeline/Timeline.tsx:120:14`

Timeline pattern for displaying a sequence of events.

## TimelineItem

Kind: `type`
Module: `src/patterns/timeline/types.ts`
Source: `src/patterns/timeline/types.ts:7:1`

### Members

| Name        | Kind     | Type                                                                                                                                          | Required | Description |
| ----------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| description | property | `React.ReactNode`                                                                                                                             | no       |             |
| icon        | property | `ButtonIconSpec \| undefined`                                                                                                                 | no       |             |
| id          | property | `string`                                                                                                                                      | yes      |             |
| meta        | property | `React.ReactNode`                                                                                                                             | no       |             |
| status      | property | `"primary" \| "secondary" \| "tertiary" \| "quaternary" \| "neutral" \| "success" \| "warning" \| "error" \| "info" \| "danger" \| undefined` | no       |             |
| testID      | property | `string \| undefined`                                                                                                                         | no       |             |
| title       | property | `React.ReactNode`                                                                                                                             | yes      |             |

## TimelineProps

Kind: `type`
Module: `src/patterns/timeline/types.ts`
Source: `src/patterns/timeline/types.ts:17:1`

### Members

| Name    | Kind     | Type                         | Required | Description |
| ------- | -------- | ---------------------------- | -------- | ----------- |
| compact | property | `boolean \| undefined`       | no       |             |
| items   | property | `readonly TimelineItem[]`    | yes      |             |
| mode    | property | `ZoraThemeMode \| undefined` | no       |             |
| testID  | property | `string \| undefined`        | no       |             |
| themeId | property | `string \| undefined`        | no       |             |

## TimePicker

Kind: `value`
Module: `src/components/time-picker/TimePicker.tsx`
Source: `src/components/time-picker/TimePicker.tsx:157:14`

Time input control with wheel selection and formatted display value.

## TimePickerProps

Kind: `type`
Module: `src/components/time-picker/types.ts`
Source: `src/components/time-picker/types.ts:7:1`

### Members

| Name          | Kind     | Type                                                | Required | Description |
| ------------- | -------- | --------------------------------------------------- | -------- | ----------- |
| description   | property | `React.ReactNode`                                   | no       |             |
| disabled      | property | `boolean \| undefined`                              | no       |             |
| error         | property | `React.ReactNode`                                   | no       |             |
| formatTime    | property | `((value: string) => React.ReactNode) \| undefined` | no       |             |
| label         | property | `React.ReactNode`                                   | no       |             |
| maxTime       | property | `string \| undefined`                               | no       |             |
| minTime       | property | `string \| undefined`                               | no       |             |
| mode          | property | `ZoraThemeMode \| undefined`                        | no       |             |
| onValueChange | property | `((value: TimePickerValue) => void) \| undefined`   | no       |             |
| placeholder   | property | `React.ReactNode`                                   | no       |             |
| required      | property | `boolean \| undefined`                              | no       |             |
| stepMinutes   | property | `number \| undefined`                               | no       |             |
| testID        | property | `string \| undefined`                               | no       |             |
| themeId       | property | `string \| undefined`                               | no       |             |
| value         | property | `TimePickerValue`                                   | yes      |             |

## TimePickerValue

Kind: `unknown`
Module: `src/components/time-picker/types.ts`
Source: `src/components/time-picker/types.ts:5:1`

## Toast

Kind: `value`
Module: `src/components/toast/Toast.tsx`
Source: `src/components/toast/Toast.tsx:16:14`

Renders a toast notification message.

## ToastOptions

Kind: `unknown`
Module: `src/components/toast/types.ts`
Source: `src/components/toast/types.ts:11:1`

## ToastProps

Kind: `type`
Module: `src/components/toast/types.ts`
Source: `src/components/toast/types.ts:13:1`

### Members

| Name        | Kind     | Type                         | Required | Description |
| ----------- | -------- | ---------------------------- | -------- | ----------- |
| description | property | `React.ReactNode`            | no       |             |
| mode        | property | `ZoraThemeMode \| undefined` | no       |             |
| onDismiss   | property | `(() => void) \| undefined`  | no       |             |
| status      | property | `ToastStatus \| undefined`   | no       |             |
| testID      | property | `string \| undefined`        | no       |             |
| themeId     | property | `string \| undefined`        | no       |             |
| title       | property | `React.ReactNode`            | no       |             |

## ToastProvider

Kind: `function`
Module: `src/components/toast/ToastProvider.tsx`
Source: `src/components/toast/ToastProvider.tsx:11:1`

Provides toast state and rendering context for `useToast` and `Toast`.

### Signatures

- `({ children, defaultDuration }: ToastProviderProps) => React.JSX.Element`
  - { children, defaultDuration }: `ToastProviderProps`
  - returns: `React.JSX.Element`

## ToastProviderProps

Kind: `type`
Module: `src/components/toast/types.ts`
Source: `src/components/toast/types.ts:15:1`

### Members

| Name            | Kind     | Type                  | Required | Description |
| --------------- | -------- | --------------------- | -------- | ----------- |
| children        | property | `React.ReactNode`     | yes      |             |
| defaultDuration | property | `number \| undefined` | no       |             |

## ToastStatus

Kind: `unknown`
Module: `src/components/toast/types.ts`
Source: `src/components/toast/types.ts:10:1`

## Toolbar

Kind: `value`
Module: `src/components/toolbar/Toolbar.tsx`
Source: `src/components/toolbar/Toolbar.tsx:47:14`

Horizontal toolbar surface for grouping actions and controls.

## ToolbarAction

Kind: `value`
Module: `src/components/toolbar/ToolbarAction.tsx`
Source: `src/components/toolbar/ToolbarAction.tsx:28:14`

Convenience icon action for toolbars with active state styling.

## ToolbarActionProps

Kind: `type`
Module: `src/components/toolbar/types.ts`
Source: `src/components/toolbar/types.ts:15:1`

### Members

| Name     | Kind     | Type                         | Required | Description |
| -------- | -------- | ---------------------------- | -------- | ----------- |
| active   | property | `boolean \| undefined`       | no       |             |
| disabled | property | `boolean \| undefined`       | no       |             |
| icon     | property | `ButtonIconSpec`             | yes      |             |
| label    | property | `string`                     | yes      |             |
| mode     | property | `ZoraThemeMode \| undefined` | no       |             |
| onPress  | property | `(() => void) \| undefined`  | no       |             |
| testID   | property | `string \| undefined`        | no       |             |
| themeId  | property | `string \| undefined`        | no       |             |

## ToolbarPosition

Kind: `unknown`
Module: `src/components/toolbar/types.ts`
Source: `src/components/toolbar/types.ts:6:1`

## ToolbarProps

Kind: `type`
Module: `src/components/toolbar/types.ts`
Source: `src/components/toolbar/types.ts:8:1`

### Members

| Name     | Kind     | Type                           | Required | Description |
| -------- | -------- | ------------------------------ | -------- | ----------- |
| children | property | `React.ReactNode`              | no       |             |
| compact  | property | `boolean \| undefined`         | no       |             |
| floating | property | `boolean \| undefined`         | no       |             |
| mode     | property | `ZoraThemeMode \| undefined`   | no       |             |
| position | property | `ToolbarPosition \| undefined` | no       |             |
| testID   | property | `string \| undefined`          | no       |             |
| themeId  | property | `string \| undefined`          | no       |             |

## TopbarLayout

Kind: `value`
Module: `src/layout/topbar-layout/TopbarLayout.tsx`
Source: `src/layout/topbar-layout/TopbarLayout.tsx:29:14`

Layout that composes a top bar with optional sidebar and content.

## TopbarLayoutProps

Kind: `type`
Module: `src/layout/topbar-layout/types.ts`
Source: `src/layout/topbar-layout/types.ts:5:1`

### Members

| Name     | Kind     | Type                         | Required | Description |
| -------- | -------- | ---------------------------- | -------- | ----------- |
| children | property | `React.ReactNode`            | no       |             |
| mode     | property | `ZoraThemeMode \| undefined` | no       |             |
| sidebar  | property | `React.ReactNode`            | no       |             |
| testID   | property | `string \| undefined`        | no       |             |
| themeId  | property | `string \| undefined`        | no       |             |
| topbar   | property | `React.ReactNode`            | yes      |             |

## TreeItem

Kind: `value`
Module: `src/patterns/tree-view/TreeItem.tsx`
Source: `src/patterns/tree-view/TreeItem.tsx:98:14`

Single tree node row used within `TreeView`.

## TreeItemNode

Kind: `type`
Module: `src/patterns/tree-view/types.ts`
Source: `src/patterns/tree-view/types.ts:6:1`

### Members

| Name     | Kind     | Type                                        | Required | Description |
| -------- | -------- | ------------------------------------------- | -------- | ----------- |
| actions  | property | `ReactNode`                                 | no       |             |
| children | property | `readonly TreeItemNode<TId>[] \| undefined` | no       |             |
| disabled | property | `boolean \| undefined`                      | no       |             |
| icon     | property | `ButtonIconSpec \| undefined`               | no       |             |
| id       | property | `TId`                                       | yes      |             |
| label    | property | `ReactNode`                                 | yes      |             |
| meta     | property | `ReactNode`                                 | no       |             |

## TreeItemRenderProps

Kind: `type`
Module: `src/patterns/tree-view/types.ts`
Source: `src/patterns/tree-view/types.ts:16:1`

### Members

| Name        | Kind     | Type                | Required | Description |
| ----------- | -------- | ------------------- | -------- | ----------- |
| depth       | property | `number`            | yes      |             |
| expanded    | property | `boolean`           | yes      |             |
| hasChildren | property | `boolean`           | yes      |             |
| node        | property | `TreeItemNode<TId>` | yes      |             |
| selected    | property | `boolean`           | yes      |             |

## TreeView

Kind: `value`
Module: `src/patterns/tree-view/TreeView.tsx`
Source: `src/patterns/tree-view/TreeView.tsx:60:14`

Tree view pattern for hierarchical navigation and expandable lists.

## TreeViewProps

Kind: `type`
Module: `src/patterns/tree-view/types.ts`
Source: `src/patterns/tree-view/types.ts:24:1`

### Members

| Name               | Kind     | Type                                                            | Required | Description |
| ------------------ | -------- | --------------------------------------------------------------- | -------- | ----------- |
| defaultExpandedIds | property | `readonly TId[] \| undefined`                                   | no       |             |
| expandedIds        | property | `readonly TId[] \| undefined`                                   | no       |             |
| mode               | property | `ZoraThemeMode \| undefined`                                    | no       |             |
| nodes              | property | `readonly TreeItemNode<TId>[]`                                  | yes      |             |
| onExpandedChange   | property | `((ids: readonly TId[]) => void) \| undefined`                  | no       |             |
| onSelect           | property | `((id: TId) => void) \| undefined`                              | no       |             |
| renderItem         | property | `((props: TreeItemRenderProps<TId>) => ReactNode) \| undefined` | no       |             |
| selectedId         | property | `TId \| undefined`                                              | no       |             |
| testID             | property | `string \| undefined`                                           | no       |             |
| themeId            | property | `string \| undefined`                                           | no       |             |

## useFormController

Kind: `function`
Module: `src/components/form/useFormController.ts`
Source: `src/components/form/useFormController.ts:24:1`

### Signatures

- `({
  fields,
  initialValues,
  values: controlledValues,
  errors: externalErrors,
  onChange,
  onSubmit,
  validateOnChange = false,
}: UseFormControllerOptions<TName>) => UseFormControllerResult<TName>`
  - {
    fields,
    initialValues,
    values: controlledValues,
    errors: externalErrors,
    onChange,
    onSubmit,
    validateOnChange = false,
    }: `UseFormControllerOptions<TName>`
  - returns: `UseFormControllerResult<TName>`

## UseFormControllerOptions

Kind: `type`
Module: `src/components/form/types.ts`
Source: `src/components/form/types.ts:97:1`

### Members

| Name             | Kind     | Type                                                                  | Required | Description |
| ---------------- | -------- | --------------------------------------------------------------------- | -------- | ----------- |
| errors           | property | `Partial<Record<TName, React.ReactNode>> \| undefined`                | no       |             |
| fields           | property | `readonly FormFieldConfig<TName>[]`                                   | yes      |             |
| initialValues    | property | `Partial<FormValues<TName>> \| undefined`                             | no       |             |
| onChange         | property | `((values: FormValues<TName>) => void) \| undefined`                  | no       |             |
| onSubmit         | property | `((values: FormValues<TName>) => void \| Promise<void>) \| undefined` | no       |             |
| validateOnChange | property | `boolean \| undefined`                                                | no       |             |
| values           | property | `FormValues<TName> \| undefined`                                      | no       |             |

## UseFormControllerResult

Kind: `type`
Module: `src/components/form/types.ts`
Source: `src/components/form/types.ts:107:1`

### Members

| Name          | Kind     | Type                                           | Required | Description |
| ------------- | -------- | ---------------------------------------------- | -------- | ----------- |
| errors        | property | `Partial<Record<TName, React.ReactNode>>`      | yes      |             |
| handleSubmit  | property | `() => Promise<void>`                          | yes      |             |
| reset         | property | `() => void`                                   | yes      |             |
| setFieldValue | property | `(name: TName, value: FormFieldValue) => void` | yes      |             |
| setValues     | property | `(values: FormValues<TName>) => void`          | yes      |             |
| validate      | property | `() => FormValidationResult<TName>`            | yes      |             |
| values        | property | `FormValues<TName>`                            | yes      |             |

## useSelection

Kind: `function`
Module: `src/patterns/selection/SelectionProvider.tsx`
Source: `src/patterns/selection/SelectionProvider.tsx:26:1`

Accesses selection state provided by `SelectionProvider`.

### Signatures

- `() => UseSelectionResult`
  - returns: `UseSelectionResult`

## UseSelectionResult

Kind: `type`
Module: `src/patterns/selection/types.ts`
Source: `src/patterns/selection/types.ts:16:1`

### Members

| Name          | Kind     | Type                      | Required | Description |
| ------------- | -------- | ------------------------- | -------- | ----------- |
| clear         | property | `() => void`              | yes      |             |
| disabled      | property | `boolean`                 | yes      |             |
| hasSelection  | property | `boolean`                 | yes      |             |
| isSelected    | property | `(id: string) => boolean` | yes      |             |
| mode          | property | `SelectionMode`           | yes      |             |
| select        | property | `(id: string) => void`    | yes      |             |
| selectedCount | property | `number`                  | yes      |             |
| selectedIds   | property | `readonly string[]`       | yes      |             |
| toggle        | property | `(id: string) => void`    | yes      |             |

## useToast

Kind: `function`
Module: `node_modules/@ankhorage/surface/dist/components/toast/ToastProvider.d.ts`
Source: `node_modules/@ankhorage/surface/dist/components/toast/ToastProvider.d.ts:11:1`

### Signatures

- `() => ToastContextValue`
  - returns: `ToastContextValue`

## useZoraTheme

Kind: `function`
Module: `src/theme/useZoraTheme.ts`
Source: `src/theme/useZoraTheme.ts:3:1`

### Signatures

- `() => { theme: import("/Users/a_rtiphishl_e/git/zora/node_modules/@ankhorage/surface/dist/index").SurfaceTheme; mode: "light" | "dark"; setThemeConfig: (config: Partial<import("/Users/a_rtiphishl_e/git/zora/node_modules/@ankhorage/surface/dist/index").ThemeConfig>) => void; setMode: (mode: "light" | "dark") => void; _hasProvider?: boolean; }`
  - returns: `{ theme: import("/Users/a_rtiphishl_e/git/zora/node_modules/@ankhorage/surface/dist/index").SurfaceTheme; mode: "light" | "dark"; setThemeConfig: (config: Partial<import("/Users/a_rtiphishl_e/git/zora/node_modules/@ankhorage/surface/dist/index").ThemeConfig>) => void; setMode: (mode: "light" | "dark") => void; _hasProvider?: boolean; }`

## validateField

Kind: `function`
Module: `src/components/form/validation.ts`
Source: `src/components/form/validation.ts:58:1`

### Signatures

- `(field: FormFieldConfig<TName>, values: FormValues<TName>) => string | undefined`
  - field: `FormFieldConfig<TName>`
  - values: `FormValues<TName>`
  - returns: `string | undefined`

## validateFields

Kind: `function`
Module: `src/components/form/validation.ts`
Source: `src/components/form/validation.ts:65:1`

### Signatures

- `(fields: readonly FormFieldConfig<TName>[], values: FormValues<TName>) => FormValidationResult<TName>`
  - fields: `readonly FormFieldConfig<TName>[]`
  - values: `FormValues<TName>`
  - returns: `FormValidationResult<TName>`

## validateValue

Kind: `function`
Module: `src/components/form/validation.ts`
Source: `src/components/form/validation.ts:15:1`

### Signatures

- `(value: string, rules: readonly ValidationRule[] | undefined) => string | undefined`
  - rules: `readonly ValidationRule[] | undefined`
  - value: `string`
  - returns: `string | undefined`

## ValidationRule

Kind: `unknown`
Module: `src/components/form/types.ts`
Source: `src/components/form/types.ts:7:1`

## withZoraThemeScope

Kind: `function`
Module: `src/theme/withZoraThemeScope.tsx`
Source: `src/theme/withZoraThemeScope.tsx:6:1`

### Signatures

- `(Component: (props: P) => React.ReactElement | null) => (props: P) => React.ReactElement | null`
  - Component: `(props: P) => React.ReactElement | null`
  - returns: `(props: P) => React.ReactElement | null`

## ZORA_BINDABLE_COMPONENT_META

Kind: `value`
Module: `src/metadata/bindableComponentMeta.ts`
Source: `src/metadata/bindableComponentMeta.ts:3:14`

## ZORA_COLORS

Kind: `value`
Module: `src/internal/colorModel.ts`
Source: `src/internal/colorModel.ts:28:14`

## ZORA_COMPONENT_META

Kind: `value`
Module: `src/metadata/componentMeta.ts`
Source: `src/metadata/componentMeta.ts:96:14`

## ZORA_EMPHASES

Kind: `value`
Module: `src/internal/colorModel.ts`
Source: `src/internal/colorModel.ts:34:14`

## ZORA_PALETTE_COLORS

Kind: `value`
Module: `src/internal/colorModel.ts`
Source: `src/internal/colorModel.ts:13:14`

## ZORA_STATUS_COLORS

Kind: `value`
Module: `src/internal/colorModel.ts`
Source: `src/internal/colorModel.ts:21:14`

## ZoraBaseProps

Kind: `type`
Module: `src/theme/ZoraBaseProps.ts`
Source: `src/theme/ZoraBaseProps.ts:3:1`

### Members

| Name    | Kind     | Type                         | Required | Description |
| ------- | -------- | ---------------------------- | -------- | ----------- |
| mode    | property | `ZoraThemeMode \| undefined` | no       |             |
| testID  | property | `string \| undefined`        | no       |             |
| themeId | property | `string \| undefined`        | no       |             |

## ZoraBindableComponentType

Kind: `unknown`
Module: `src/metadata/bindableComponentMeta.ts`
Source: `src/metadata/bindableComponentMeta.ts:476:1`

## ZoraColor

Kind: `unknown`
Module: `src/internal/colorModel.ts`
Source: `src/internal/colorModel.ts:10:1`

## ZoraComponentBlueprint

Kind: `type`
Module: `src/metadata/types.ts`
Source: `src/metadata/types.ts:42:1`

### Members

| Name         | Kind     | Type                                                            | Required | Description |
| ------------ | -------- | --------------------------------------------------------------- | -------- | ----------- |
| defaultProps | property | `Readonly<Record<string, ZoraComponentPropValue>> \| undefined` | no       |             |
| icon         | property | `{ name: string; provider?: string; } \| undefined`             | no       |             |
| label        | property | `string`                                                        | yes      |             |

## ZoraComponentCategory

Kind: `unknown`
Module: `src/metadata/types.ts`
Source: `src/metadata/types.ts:3:1`

## ZoraComponentEventMeta

Kind: `type`
Module: `src/metadata/types.ts`
Source: `src/metadata/types.ts:75:1`

### Members

| Name          | Kind     | Type                                                         | Required | Description |
| ------------- | -------- | ------------------------------------------------------------ | -------- | ----------- |
| description   | property | `string \| undefined`                                        | no       |             |
| eventType     | property | `ZoraComponentEventPayloadKind`                              | yes      |             |
| label         | property | `string`                                                     | yes      |             |
| payloadFields | property | `readonly ZoraComponentEventPayloadFieldMeta[] \| undefined` | no       |             |

## ZoraComponentEventPayloadFieldMeta

Kind: `type`
Module: `src/metadata/types.ts`
Source: `src/metadata/types.ts:68:1`

### Members

| Name        | Kind     | Type                                 | Required | Description |
| ----------- | -------- | ------------------------------------ | -------- | ----------- |
| description | property | `string \| undefined`                | no       |             |
| label       | property | `string \| undefined`                | no       |             |
| path        | property | `string`                             | yes      |             |
| type        | property | `ZoraComponentEventPayloadFieldType` | yes      |             |

## ZoraComponentEventPayloadFieldType

Kind: `unknown`
Module: `src/metadata/types.ts`
Source: `src/metadata/types.ts:60:1`

## ZoraComponentEventPayloadKind

Kind: `unknown`
Module: `src/metadata/types.ts`
Source: `src/metadata/types.ts:58:1`

## ZoraComponentI18nMeta

Kind: `type`
Module: `src/metadata/types.ts`
Source: `src/metadata/types.ts:51:1`

### Members

| Name   | Kind     | Type                                                       | Required | Description |
| ------ | -------- | ---------------------------------------------------------- | -------- | ----------- |
| fields | property | `readonly { keyProp: string; defaultTextProp: string; }[]` | yes      |             |

## ZoraComponentMeta

Kind: `type`
Module: `src/metadata/types.ts`
Source: `src/metadata/types.ts:87:1`

### Members

| Name               | Kind     | Type                                                            | Required | Description |
| ------------------ | -------- | --------------------------------------------------------------- | -------- | ----------- |
| allowedChildren    | property | `readonly string[]`                                             | yes      |             |
| blueprint          | property | `ZoraComponentBlueprint \| undefined`                           | no       |             |
| category           | property | `ZoraComponentCategory`                                         | yes      |             |
| description        | property | `string \| undefined`                                           | no       |             |
| directManifestNode | property | `boolean`                                                       | yes      |             |
| events             | property | `Readonly<Record<string, ZoraComponentEventMeta>> \| undefined` | no       |             |
| i18n               | property | `ZoraComponentI18nMeta \| undefined`                            | no       |             |
| name               | property | `string`                                                        | yes      |             |
| note               | property | `string \| undefined`                                           | no       |             |
| props              | property | `Readonly<Record<string, ZoraComponentPropSchema>>`             | yes      |             |
| slots              | property | `Readonly<Record<string, ZoraComponentSlotMeta>> \| undefined`  | no       |             |

## ZoraComponentMetaRegistry

Kind: `unknown`
Module: `src/metadata/types.ts`
Source: `src/metadata/types.ts:101:1`

## ZoraComponentPropArrayItemSchema

Kind: `type`
Module: `src/metadata/types.ts`
Source: `src/metadata/types.ts:28:1`

### Members

| Name   | Kind     | Type                      | Required | Description |
| ------ | -------- | ------------------------- | -------- | ----------- |
| key    | property | `string`                  | yes      |             |
| schema | property | `ZoraComponentPropSchema` | yes      |             |

## ZoraComponentPropSchema

Kind: `type`
Module: `src/metadata/types.ts`
Source: `src/metadata/types.ts:33:1`

### Members

| Name       | Kind     | Type                                                       | Required | Description |
| ---------- | -------- | ---------------------------------------------------------- | -------- | ----------- |
| category   | property | `string`                                                   | yes      |             |
| default    | property | `ZoraComponentPropValue \| undefined`                      | no       |             |
| enum       | property | `readonly (string \| number)[] \| undefined`               | no       |             |
| itemSchema | property | `readonly ZoraComponentPropArrayItemSchema[] \| undefined` | no       |             |
| label      | property | `string \| undefined`                                      | no       |             |
| type       | property | `ZoraComponentPropType`                                    | yes      |             |

## ZoraComponentPropType

Kind: `unknown`
Module: `src/metadata/types.ts`
Source: `src/metadata/types.ts:5:1`

## ZoraComponentPropValue

Kind: `unknown`
Module: `src/metadata/types.ts`
Source: `src/metadata/types.ts:20:1`

## ZoraComponentSlotMeta

Kind: `type`
Module: `src/metadata/types.ts`
Source: `src/metadata/types.ts:82:1`

### Members

| Name            | Kind     | Type                             | Required | Description |
| --------------- | -------- | -------------------------------- | -------- | ----------- |
| allowedChildren | property | `readonly string[] \| undefined` | no       |             |
| label           | property | `string \| undefined`            | no       |             |

## ZoraComputedTheme

Kind: `type`
Module: `src/theme/types.ts`
Source: `src/theme/types.ts:30:1`

### Members

| Name          | Kind     | Type                    | Required | Description |
| ------------- | -------- | ----------------------- | -------- | ----------- |
| dark          | property | `ZoraComputedThemeMode` | yes      |             |
| id            | property | `string`                | yes      |             |
| light         | property | `ZoraComputedThemeMode` | yes      |             |
| name          | property | `string`                | yes      |             |
| source        | property | `ZoraTheme`             | yes      |             |
| surfaceConfig | property | `ThemeConfig`           | yes      |             |

## ZoraComputedThemeMode

Kind: `type`
Module: `src/theme/types.ts`
Source: `src/theme/types.ts:22:1`

### Members

| Name           | Kind     | Type                                              | Required | Description |
| -------------- | -------- | ------------------------------------------------- | -------- | ----------- |
| generated      | property | `GeneratedThemeModeColors`                        | yes      |             |
| mode           | property | `ZoraThemeMode`                                   | yes      |             |
| semanticColors | property | `Record<SemanticColorToken, string> \| undefined` | no       |             |
| surfaceTheme   | property | `SurfaceTheme`                                    | yes      |             |
| swatches       | property | `GeneratedThemeSwatches`                          | yes      |             |

## zoraDefaultTheme

Kind: `value`
Module: `src/theme/zoraDefaultTheme.ts`
Source: `src/theme/zoraDefaultTheme.ts:3:14`

## ZoraDrawerContent

Kind: `value`
Module: `src/patterns/zora-drawer-content/ZoraDrawerContent.tsx`
Source: `src/patterns/zora-drawer-content/ZoraDrawerContent.tsx:58:14`

Standard drawer content pattern for ZORA navigation lists.

## ZoraDrawerContentProps

Kind: `type`
Module: `src/patterns/zora-drawer-content/types.ts`
Source: `src/patterns/zora-drawer-content/types.ts:11:1`

### Members

| Name        | Kind     | Type                                                                                                                                                           | Required | Description |
| ----------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| compact     | property | `boolean \| undefined`                                                                                                                                         | no       |             |
| descriptors | property | `Readonly<Record<string, import("/Users/a_rtiphishl_e/git/zora/src/internal/resolveZoraNavigationItems").ZoraNavigationDescriptor \| undefined>> \| undefined` | no       |             |
| footer      | property | `React.ReactNode`                                                                                                                                              | no       |             |
| header      | property | `React.ReactNode`                                                                                                                                              | no       |             |
| mode        | property | `ZoraThemeMode \| undefined`                                                                                                                                   | no       |             |
| navigation  | property | `ZoraDrawerNavigation`                                                                                                                                         | yes      |             |
| routeMap    | property | `Partial<Record<string, import("/Users/a_rtiphishl_e/git/zora/src/index").ZoraNavigationRouteMetadata>> \| undefined`                                          | no       |             |
| state       | property | `ZoraNavigationState`                                                                                                                                          | yes      |             |
| testID      | property | `string \| undefined`                                                                                                                                          | no       |             |
| themeId     | property | `string \| undefined`                                                                                                                                          | no       |             |

## ZoraEmphasis

Kind: `unknown`
Module: `src/internal/colorModel.ts`
Source: `src/internal/colorModel.ts:11:1`

## ZoraImageAsset

Kind: `unknown`
Module: `src/patterns/image-preview/types.ts`
Source: `src/patterns/image-preview/types.ts:12:1`

## ZoraImageMetadata

Kind: `type`
Module: `src/patterns/image-preview/types.ts`
Source: `src/patterns/image-preview/types.ts:6:1`

### Members

| Name      | Kind     | Type                  | Required | Description |
| --------- | -------- | --------------------- | -------- | ----------- |
| createdAt | property | `string \| undefined` | no       |             |
| fileName  | property | `string \| undefined` | no       |             |
| sizeBytes | property | `number \| undefined` | no       |             |

## ZoraNavigationRouteMap

Kind: `unknown`
Module: `src/components/navigation-list/types.ts`
Source: `src/components/navigation-list/types.ts:6:1`

## ZoraNavigationRouteMetadata

Kind: `type`
Module: `src/components/navigation-item/types.ts`
Source: `src/components/navigation-item/types.ts:6:1`

### Members

| Name               | Kind     | Type                          | Required | Description |
| ------------------ | -------- | ----------------------------- | -------- | ----------- |
| accessibilityLabel | property | `string \| undefined`         | no       |             |
| badge              | property | `React.ReactNode`             | no       |             |
| disabled           | property | `boolean \| undefined`        | no       |             |
| icon               | property | `ButtonIconSpec \| undefined` | no       |             |
| label              | property | `React.ReactNode`             | no       |             |
| testID             | property | `string \| undefined`         | no       |             |

## ZoraNavigationRouteState

Kind: `type`
Module: `src/components/navigation-item/types.ts`
Source: `src/components/navigation-item/types.ts:15:1`

### Members

| Name | Kind     | Type     | Required | Description |
| ---- | -------- | -------- | -------- | ----------- |
| key  | property | `string` | yes      |             |
| name | property | `string` | yes      |             |

## ZoraPaletteColor

Kind: `unknown`
Module: `src/internal/colorModel.ts`
Source: `src/internal/colorModel.ts:8:1`

## ZoraPickedImage

Kind: `type`
Module: `src/patterns/image-upload-field/types.ts`
Source: `src/patterns/image-upload-field/types.ts:6:1`

### Members

| Name        | Kind     | Type                  | Required | Description |
| ----------- | -------- | --------------------- | -------- | ----------- |
| contentType | property | `string \| undefined` | no       |             |
| fileName    | property | `string \| undefined` | no       |             |
| height      | property | `number \| undefined` | no       |             |
| sizeBytes   | property | `number \| undefined` | no       |             |
| uri         | property | `string`              | yes      |             |
| width       | property | `number \| undefined` | no       |             |

## ZoraProvider

Kind: `function`
Module: `src/theme/ZoraProvider.tsx`
Source: `src/theme/ZoraProvider.tsx:26:1`

Installs the ZORA theme runtime and underlying Surface theme provider.

Wrap an app with `ZoraProvider` once near the root so components, patterns,
layouts, and theme hooks resolve the same design tokens and color mode.

### Signatures

- `({
  children,
  theme = zoraDefaultTheme,
  initialMode = 'light',
}: ZoraProviderProps) => React.JSX.Element`
  - {
    children,
    theme = zoraDefaultTheme,
    initialMode = 'light',
    }: `ZoraProviderProps`
  - returns: `React.JSX.Element`

## ZoraProviderProps

Kind: `type`
Module: `src/theme/ZoraProvider.tsx`
Source: `src/theme/ZoraProvider.tsx:9:1`

### Members

| Name        | Kind     | Type                         | Required | Description |
| ----------- | -------- | ---------------------------- | -------- | ----------- |
| children    | property | `React.ReactNode`            | yes      |             |
| initialMode | property | `ZoraThemeMode \| undefined` | no       |             |
| theme       | property | `ZoraTheme \| undefined`     | no       |             |

## ZoraStatusColor

Kind: `unknown`
Module: `src/internal/colorModel.ts`
Source: `src/internal/colorModel.ts:9:1`

## ZoraTabBar

Kind: `value`
Module: `src/patterns/zora-tab-bar/ZoraTabBar.tsx`
Source: `src/patterns/zora-tab-bar/ZoraTabBar.tsx:149:14`

Bottom tab bar pattern with badge support and active state styling.

## ZoraTabBarProps

Kind: `type`
Module: `src/patterns/zora-tab-bar/types.ts`
Source: `src/patterns/zora-tab-bar/types.ts:9:1`

### Members

| Name        | Kind     | Type                                                                                                                                                           | Required | Description |
| ----------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| chrome      | property | `"none" \| "raised" \| undefined`                                                                                                                              | no       |             |
| compact     | property | `boolean \| undefined`                                                                                                                                         | no       |             |
| descriptors | property | `Readonly<Record<string, import("/Users/a_rtiphishl_e/git/zora/src/internal/resolveZoraNavigationItems").ZoraNavigationDescriptor \| undefined>> \| undefined` | no       |             |
| insets      | property | `{ top?: number; bottom?: number; left?: number; right?: number; } \| undefined`                                                                               | no       |             |
| mode        | property | `ZoraThemeMode \| undefined`                                                                                                                                   | no       |             |
| navigation  | property | `ZoraTabBarNavigation`                                                                                                                                         | yes      |             |
| routeMap    | property | `Partial<Record<string, import("/Users/a_rtiphishl_e/git/zora/src/index").ZoraNavigationRouteMetadata>> \| undefined`                                          | no       |             |
| state       | property | `ZoraNavigationState`                                                                                                                                          | yes      |             |
| testID      | property | `string \| undefined`                                                                                                                                          | no       |             |
| themeId     | property | `string \| undefined`                                                                                                                                          | no       |             |

## ZoraTheme

Kind: `type`
Module: `src/theme/types.ts`
Source: `src/theme/types.ts:14:1`

### Members

| Name         | Kind     | Type                                                                                                                                                                                                                                                                                                                                                                                                                                          | Required | Description |
| ------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| appCategory  | property | `"books_reading" \| "business_productivity" \| "developer_tools" \| "education_learning" \| "entertainment_media" \| "finance_money" \| "food_drink" \| "games" \| "graphics_design" \| "health_fitness" \| "kids_family" \| "lifestyle" \| "medical" \| "music_audio" \| "navigation_travel" \| "news_magazines" \| "photo_video" \| "reference" \| "shopping_commerce" \| "social_community" \| "sports" \| "utilities_tools" \| "weather"` | yes      |             |
| harmony      | property | `"complementary" \| "monochromatic" \| "analogous" \| "triadic" \| "tetradic" \| "splitComplementary"`                                                                                                                                                                                                                                                                                                                                        | yes      |             |
| id           | property | `string`                                                                                                                                                                                                                                                                                                                                                                                                                                      | yes      |             |
| name         | property | `string`                                                                                                                                                                                                                                                                                                                                                                                                                                      | yes      |             |
| primaryColor | property | `string`                                                                                                                                                                                                                                                                                                                                                                                                                                      | yes      |             |

## ZoraThemeId

Kind: `unknown`
Module: `src/theme/types.ts`
Source: `src/theme/types.ts:10:1`

## ZoraThemeMode

Kind: `unknown`
Module: `src/theme/types.ts`
Source: `src/theme/types.ts:12:1`

## ZoraThemeScope

Kind: `function`
Module: `src/theme/ZoraThemeScope.tsx`
Source: `src/theme/ZoraThemeScope.tsx:64:1`

### Signatures

- `({ children, themeId, mode }: ZoraThemeScopeProps) => string | number | bigint | boolean | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | React.JSX.Element | null | undefined`
  - { children, themeId, mode }: `ZoraThemeScopeProps`
  - returns: `string | number | bigint | boolean | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | React.JSX.Element | null | undefined`

## ZoraThemeScopeProps

Kind: `type`
Module: `src/theme/ZoraThemeScope.tsx`
Source: `src/theme/ZoraThemeScope.tsx:9:1`

### Members

| Name     | Kind     | Type                         | Required | Description |
| -------- | -------- | ---------------------------- | -------- | ----------- |
| children | property | `React.ReactNode`            | yes      |             |
| mode     | property | `ZoraThemeMode \| undefined` | no       |             |
| themeId  | property | `string \| undefined`        | no       |             |
