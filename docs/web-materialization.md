# Web materialization

ZORA web components can be generated for an application without adding the full ZORA, Surface,
React Native, or Expo runtime to that application's dependencies. The application still provides
its own `react` and `react-dom` dependencies.

From the application root, add a component with `ankh zora create select --web`. This updates the
version-controlled `zora.web.json` declaration and generates `.ankh/zora/web`. The generated output
is replaceable and should be ignored by Git; keep `zora.web.json` committed.

`ankh zora sync --web` reads `zora.web.json` and regenerates all declared components from one
resolved ZORA provider release. Run it after updating that release and on a clean checkout. Sync
also removes generated components and chunks no longer required by the declaration. It stages a
complete generation before switching the `.ankh/zora/web` link, so failed builds leave the prior
materialization available.

Mount `.ankh/zora/web/runtime/ZoraProvider` once at the application's client root. Import selected
components from `.ankh/zora/web/components/<component>`; each directory has a generated JavaScript
and TypeScript entry. A consumer can map `@zora/*` to `.ankh/zora/web/components/*` once. All generated imports share the
same bundled ZORA and Surface runtime chunks. Pass `mode="light"` or `mode="dark"` when the
application owns a changing theme mode; the provider updates its shared theme runtime without
remounting children. Do not copy the Ankh provider cache into the project or wrap each generated
component with a separate provider.

The generated `materialization.json` records the ZORA owner version, selected components, platform,
schema version, and file inventory. It reports generated state; `zora.web.json` remains the desired
state authority.
