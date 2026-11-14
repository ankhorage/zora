# FlowCanvas manual preview

Keep the browser preview running for interactive Chromium inspection:

```sh
FLOW_CHROMIUM_PREVIEW=1 bun run test:flow-canvas:chromium
```

The command prints its loopback URL and exits on `Ctrl-C`.

To inspect the exact packed Expo consumer, retain the generated candidate, then start Expo from the
printed `consumer` directory:

```sh
FLOW_NATIVE_KEEP_ARTIFACTS=1 bun run test:flow-canvas:native
cd /tmp/zora-flow-native-*/consumer
bun start
```

Use Expo's platform commands from that consumer after Metro starts. The retained directory contains
the package tarball and lockfile used by the preview; it does not import the repository checkout.
