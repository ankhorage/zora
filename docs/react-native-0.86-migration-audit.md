# Expo 57 / React Native 0.86 ZORA migration audit

This audit covers roadmap step `[expo 4]` and the move from React 19.1 / React
Native 0.81 to React 19.2.3 / React Native 0.86.2. ZORA remains the portable
React Native and React Native Web UI owner; Expo setup is confined to ZORA-owned
example applications.

The review uses the React Native release posts for
[0.82](https://reactnative.dev/blog/2025/10/08/react-native-0.82),
[0.83](https://reactnative.dev/blog/2025/12/10/react-native-0.83),
[0.84](https://reactnative.dev/blog/2026/02/11/react-native-0.84),
[0.85](https://reactnative.dev/blog/2026/04/07/react-native-0.85), and
[0.86](https://reactnative.dev/blog/2026/06/11/react-native-0.86), plus the
released `@ankhorage/surface@3.0.0` icon contract and
`@ankhorage/expo-runtime@2.7.0/platform` projection.

## Target and ownership decisions

- **CHANGE REQUIRED — platform contract.** React is `19.2.3`, React Native is
  `0.86.2`, React Native Web is `~0.21.0`, TypeScript is `~6.0.3`, Node typings
  are `^24.13.3`, and Bun policy is `1.3.14`.
- **CHANGE REQUIRED — Surface contract.** ZORA consumes released
  `@ankhorage/surface@3.0.0` through `^3.0.0` and reuses its discriminated
  `IconSource`/`ButtonIconSpec` types instead of reconstructing icon specs.
- **CHANGE REQUIRED — Expo optionality.** Published ZORA source and package
  metadata contain no Expo runtime dependency or peer. `Gradient` receives a
  renderer from `GradientRendererProvider`; the Expo showcase adapts
  `expo-linear-gradient@~57.0.1` at the app boundary. `expo-font@~57.0.1` is
  Web-only example setup for RNVI fonts.
- **VERIFIED: NO CHANGE REQUIRED — portable picker ownership.** `Select`
  remains backed by `@react-native-picker/picker`; Expo UI is not substituted.

Package manifests cannot execute TypeScript and therefore cannot import the
canonical Expo platform projection. The scaffold keeps a narrow script-only
version object aligned to released `@ankhorage/expo-runtime@2.7.0/platform`.
Adding Expo Runtime as a ZORA development dependency would install its required
Expo peers into the portable base repository, defeating the optionality gate.
Committed example JSON necessarily records concrete versions, while portable
ZORA runtime source does not duplicate platform metadata.

## Release-by-release findings

| Release | ZORA-relevant upstream surface                                                                                                                                     | Outcome                                                                                                                                                                                                                          |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0.82    | New Architecture became the only architecture; Fabric host refs retained public measurement capabilities and added DOM-like APIs.                                  | **VERIFIED: NO CHANGE REQUIRED** — ZORA has no native module, Paper/Fabric branch, UIManager switch, direct measurement call, or exposed imperative host ref.                                                                    |
| 0.83    | React moved to 19.2 and RN reported no user-facing breaking changes.                                                                                               | **CHANGE REQUIRED** — provider and hook behavior is compiled and rendered with React 19.2.3; no compatibility branch remains.                                                                                                    |
| 0.84    | Hermes V1 became default, React synchronized to 19.2.3, legacy native classes were removed, and Node 22 became minimum.                                            | **CHANGE REQUIRED** — React and Node tooling move to the Ankhorage React 19.2.3 / Node 24 baseline. ZORA has no Hermes or removed-native-class implementation.                                                                   |
| 0.85    | `StyleSheet.absoluteFillObject` was removed, the RN Jest preset moved, TypeScript utility types changed, and Metro moved to 0.84.                                  | **CHANGE REQUIRED** — `AppShell` now composes supported `StyleSheet.absoluteFill`; icon unions and public RN types compile under TypeScript 6. Bun tests require no Jest migration.                                              |
| 0.86    | Edge-to-edge measurement, keyboard, Modal, Yoga, hit-testing, Pressable ripple, TextInput, and Metro behavior were corrected with no user-facing breaking changes. | **CHANGE REQUIRED** — RNW pointer events move into styles, safe-area/picker/RNW peers align to the platform, and representative overlay/layout/input rendering is revalidated. No compensating edge-to-edge workaround is added. |

## Mandatory area decisions

Each requested audit area has one decision.

| Audit area                            | Decision                         | Evidence and action                                                                                                                                                                                                                          |
| ------------------------------------- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Components / removed APIs             | **CHANGE REQUIRED**              | `AppShell` used removed `StyleSheet.absoluteFillObject`; it now composes `StyleSheet.absoluteFill`. No other removed component API is active.                                                                                                |
| TypeScript types                      | **CHANGE REQUIRED**              | ZORA compiles with TypeScript 6.0.3, React 19.2 declarations, RN 0.86.2 declarations, and the discriminated Surface icon union. Icon forwarding preserves the complete provider/variant discriminant.                                        |
| Fabric / New Architecture             | **VERIFIED: NO CHANGE REQUIRED** | ZORA is TypeScript/React UI only: no native module, codegen component, bridge branch, UIManager-type check, or legacy-architecture flag exists.                                                                                              |
| Layout / measurement                  | **CHANGE REQUIRED**              | The removed absolute-fill style path is replaced and RNW 0.21 static render/hydration covers responsive Container/Grid/Show plus AppShell overlay positioning. ZORA performs no manual measurement or inset correction.                      |
| Pressable behavior                    | **VERIFIED: NO CHANGE REQUIRED** | Public `onPress`, pressed, hover, focus, keyboard, and accessibility-state contracts remain valid. ZORA does not render hidden React `Activity` boundaries or depend on listener teardown timing.                                            |
| Input / event semantics               | **CHANGE REQUIRED**              | Passive `Select` pointer blocking uses the RN/RNW style `pointerEvents` contract; picker value callbacks stay normalized strings and do not expose native events. RN 0.86 TextInput fixes require no compatibility branch.                   |
| Refs / imperative handles             | **VERIFIED: NO CHANGE REQUIRED** | ZORA exports no native host ref or imperative handle and uses no `findNodeHandle`, private host instance, or direct measurement API.                                                                                                         |
| Modal                                 | **VERIFIED: NO CHANGE REQUIRED** | ZORA delegates visible/dismiss/backdrop behavior to Surface 3. RN 0.86 forwarding of Modal container style is additive; ZORA does not override status-bar or edge-to-edge behavior.                                                          |
| Drawer                                | **VERIFIED: NO CHANGE REQUIRED** | Drawer UI and dismissal remain delegated to Surface 3. ZORA navigation callbacks use normalized route names and optional `closeDrawer`, without native drawer internals.                                                                     |
| Overlays / portals                    | **CHANGE REQUIRED**              | `AppShell` and scanner overlay styles use supported absolute-fill and style-level pointer events. No custom portal, global host, or platform offset workaround is introduced.                                                                |
| Safe areas / edge-to-edge             | **CHANGE REQUIRED**              | The Surface peer projection is aligned to `react-native-safe-area-context~5.7.0`. Applications retain provider and Android edge-to-edge ownership; ZORA adds no status/navigation-bar background workaround.                                 |
| Lists / scrolling                     | **VERIFIED: NO CHANGE REQUIRED** | DataTable, TimePicker, and ResponsivePanel use public ScrollView props and no removed list ref, responder, clipping, or scroll event shape. No FlatList/SectionList private API is used.                                                     |
| Picker / native component integration | **CHANGE REQUIRED**              | `@react-native-picker/picker` is exactly `2.11.4`, remains a required portable peer, and is exercised by the Expo 57 showcase and its Web export.                                                                                            |
| React Native Web behavior             | **CHANGE REQUIRED**              | RNW `~0.21.0` is explicit. Deprecated host `pointerEvents` props move to styles. Real RNW 0.21 server render/hydration covers theme/provider, responsive layout, overlay markup, and all Surface 3 icon font families used by ZORA.          |
| Metro / module resolution             | **CHANGE REQUIRED**              | ZORA consumes Surface 3's published RNVI `/static` exports. Expo examples register RNVI plugins for native builds and use app-owned Web font loading. No Babel file, Metro alias, singleton resolver, or font resolver is retained or added. |

## Icon contract and application setup

Surface 3 supports Ionicons and FontAwesome without variants, and FontAwesome5
or FontAwesome6 only with `regular`, `solid`, or `brand`. ZORA preserves the
semantic provider and glyph for every OAuth default. In particular:

- Apple and GitHub remain FontAwesome glyphs without variants.
- Microsoft/Azure, Discord, Figma, GitLab, Slack, and Twitch are FontAwesome5
  `brand` glyphs.
- Zoom is FontAwesome5 `video` with the `solid` variant.
- X is FontAwesome6 `x-twitter` with the `brand` variant.

Expo example app configs register the Ionicons, FontAwesome, FontAwesome5, and
FontAwesome6 RNVI config plugins for development builds. Their Web-only font
hook loads Ionicons, FontAwesome, FA5 Brands, FA5 Solid, and FA6 Brands. Native
changes require rebuilding the Android/iOS development client; ZORA performs no
native font bootstrapping.

## Downstream consumer inventory

### `@ankhorage/zora-chess`

- Published/development version inspected: `0.1.2`.
- Public peers remain broad and valid: ZORA `>=0.1.0`, React `>=18.2.0`, and RN
  `>=0.72.0`; they should not be narrowed solely for this validation baseline.
- Development validation is stale: ZORA `^2.5.4`, React `^19.1.0`, RN
  `^0.79.5`, TypeScript `^5.9.3`, Node 25 typings, Devtools `^1.0.6`, and Bun
  `1.3.13`.
- **Owner follow-up required:** in the zora-chess repository, retain broad
  public peers but move development/tooling validation to released ZORA 3,
  React 19.2.3, RN 0.86.2, TypeScript 6.0.3, Node 24 typings, Devtools 1.6.0,
  and Bun 1.3.14, then run its full gates and changeset/release flow.

### `@ankhorage/zora-tabletop`

- Published/development version inspected: `0.0.5`.
- Public peers remain broad and valid: ZORA `>=0.1.0`, React `>=18.2.0`, and RN
  `>=0.72.0`; they should not be narrowed solely for this validation baseline.
- Development validation is stale: ZORA `^2.6.1`, React `^19.1.0`, RN
  `^0.81.5`, TypeScript `^5.9.3`, Node 25 typings, Devtools `^1.0.6`, and Bun
  `1.3.13`.
- **Owner follow-up required:** in the zora-tabletop repository, retain broad
  public peers but move development/tooling validation to released ZORA 3 and
  the same React/RN/TypeScript/Node/Devtools/Bun baseline, then run its full
  gates and changeset/release flow.

Cross-repository writes are intentionally not mixed into this ZORA worktree.
Fresh temporary clones pass their current full build, lint, test, and Knip
gates (zora-chess: 16 tests; zora-tabletop: 13 tests). Their only ZORA runtime
import is `useZoraTheme`, which is unchanged by this migration. Installation of
the packed ZORA candidate into those clones is not a substitute for updating
their stale development matrices after ZORA 3 is released. This is
baseline/source-inventory evidence rather than a claim that those matrices
already accept ZORA 3. Merge and publish ZORA 3 first; each consumer owner must
then commit, validate, and release its own development-matrix migration before
roadmap issue #294 closes.

## Automated acceptance results

- Root build, strict TypeScript 6 typecheck, current Devtools lint/format/Knip,
  214-test suite, docs generation, Ankh doctor, and package creation pass.
- React Compiler healthcheck compiled 219 of 219 components and reported no
  incompatible libraries.
- Root lint owns only portable `src` plus its root-owned validation scripts.
  `examples:validate` performs frozen installs in all nine example project
  roots, runs every example typecheck, and then runs type-aware example lint
  with those app-owned dependency graphs present. This reproduces clean CI
  without adding Expo packages to portable ZORA.
- `expo:candidate` builds and packs the actual branch artifact, copies the
  showcase and restaurant Router app into isolated temporary projects, removes
  their source declaration aliases and registry locks, points each disposable
  manifest to the tarball, generates a lock, deletes `node_modules`, and repeats
  a frozen install. The gate fails unless each lock names the tarball, the
  installed package contains the candidate-only `GradientRendererProvider`
  implementation, its Surface range is `^3.0.0`, and the installed Surface is
  exactly `3.0.0` with no Surface 2 graph.
- All seven Expo Router examples keep implementation files outside `app/`:
  shared app bars live in `src/components`, while the platform-specific icon
  font hooks live in `src/hooks`. `examples:validate` rejects app-tree modules
  that are not route/layout modules with default exports, and the scaffold now
  generates its font hooks under `src/hooks`.
- The current pre-changeset tarball is
  `ankhorage-zora-2.13.2.tgz`; `.changeset/modern-ravens-upgrade.md` promotes it
  to ZORA 3 during the release flow. The temporary dependency is intentionally
  file-backed only inside acceptance; committed example manifests continue to
  name the latest released ZORA until 3.0.0 exists.
- Candidate-backed TypeScript and Expo install compatibility checks pass for
  both fixtures. Expo Doctor 1.20.2 passes all checks for the candidate-backed
  showcase.
- Candidate-backed Expo 57 Web export passes for the showcase and the static
  restaurant Router app. Its exact 12-route export consists of five public app
  routes, Expo's five `(tabs)` route-group representations, and the generated
  sitemap/not-found routes; candidate acceptance explicitly rejects helper
  routes such as `/ExampleAppBar` and `/useZoraIconFonts`. Both exported bundles
  include the five scoped RNVI faces used by acceptance: Ionicons, FontAwesome,
  FA5 Brands, FA5 Solid, and FA6 Brands.
- Expo config evaluation passes for both showcase and Router app. An automated
  iOS prebuild succeeds and records Ionicons, FontAwesome, all three FA5 styles,
  and all three FA6 styles in `UIAppFonts`.
- Registry ZORA 2.13.2 and Surface 2 are therefore no longer used as runtime
  evidence for the migrated showcase/Router acceptance.

## Native acceptance boundary

ZORA has no committed `ios/` or `android/` native project. Repository automation
can validate app config plugin resolution, Expo prebuild/config evaluation, Web
font rendering, and native TypeScript/bundle surfaces. It cannot claim visual
font, picker, gradient, modal, drawer, safe-area, or navigation acceptance on a
physical device. After merging/releasing, rebuild the Expo 57 development
clients and visually exercise those behaviors on supported Android and iOS
devices.
