# Expo and React Native Applications

An Expo application is an independently installable application and may use ports-and-adapters
principles for its application behavior. Expo Router route files are framework-owned inbound
adapters, not the home of domain logic.

## Structure

```text
app/                         # Expo Router route tree
src/
  app/                       # providers and app composition
  <domain>/                  # application-owned domains
    domain/
    application/
    ports/
  platform/                  # app-local native/web adapters only
  utils/                     # app-wide internal utilities
```

Keep route files thin: resolve route parameters and navigation context, invoke or render the owning
application boundary, and declare route-specific framework configuration. Substantial UI belongs
with its owning domain or reusable UI package.

## Ankhorage ownership

- Use Contracts for portable authored state.
- Use Runtime for manifest/action/data execution.
- Use ZORA and Surface for reusable UI.
- Use Expo Runtime and provider packages for platform integration.
- Do not copy package behavior into the generated app merely to avoid a public API or release.
- Do not import Studio source or rely on the Studio workspace.

## Standalone lifecycle

Each generated app owns its package manifest, lockfile, installation, validation, build, and
deployment inputs. A parent dashboard may invoke commands with the app as `cwd`, but must not
install it through a hidden shared workspace contract.

## Platform variants

Use `.native`, `.web`, `.ios`, and `.android` variants only when the platform behavior genuinely
differs. Keep the portable contract in the unsuffixed module and concrete behavior at the edge.
