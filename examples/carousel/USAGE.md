# Carousel – interactive example

A self-contained **React Native Web** preview demonstrating ZORA's public
`Carousel` component with four original bundled vector illustrations and
editorial slide content.

From the ZORA repository root:

```sh
bun install --frozen-lockfile
bun examples/carousel/serve.ts
```

Then open **http://127.0.0.1:3217**. Set `PORT` to use another port.

The example builds the ZORA public web artifacts before bundling the preview
and imports only `@ankhorage/zora/web/carousel` and
`@ankhorage/zora/web/runtime`. No Next.js or unpublished sibling source is
required. The slides and their artwork work without network image requests.

Try **Fade / Slide / None**, autoplay intervals, arrows, dots, progress,
and reduced motion. The carousel demonstrates both image backgrounds and
arbitrary React content within each slide. Its heading, copy and CTA are
provided by the consumer, not hard-coded into the library.

The downstream website migration remains tracked separately in
[ankhorage/ch-deinjob #53](https://github.com/ankhorage/ch-deinjob/issues/53)
and must consume the verified published web artifact.
