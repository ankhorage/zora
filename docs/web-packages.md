# ZORA Web packages

Standalone Web-only applications consume ZORA from its published package subpaths. Mount
`ZoraProvider` from `@ankhorage/zora/web/runtime` once at the client root, then import each UI
component from `@ankhorage/zora/web/<component>`.

```ts
import { Button } from '@ankhorage/zora/web/button';
import { ZoraProvider } from '@ankhorage/zora/web/runtime';
```

`web-dist` is package-static release output. It contains the JavaScript, declarations, shared
runtime, chunks, assets, and export manifest produced from the ZORA source and selected by the
package export map. Its only inputs are the installed `@ankhorage/zora` release and its published
dependencies. Consumers must neither copy it into their project nor alias it as `@zora/*`.

No ZORA Web-only project state is generated. A consumer-specific build remains responsible for its
own source imports, bundler or SSR configuration, and declared `react` and `react-dom`
dependencies. React Native, Expo, and cross-platform React Native Web applications continue to
import from `@ankhorage/zora`; the Web-only subpaths are not a replacement for that runtime.
