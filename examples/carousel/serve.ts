import { resolve } from 'node:path';

import { carouselExampleCss } from './carouselExampleCss';

const rootDirectory = resolve(import.meta.dir, '../..');
const media = new Set(['01-horizon.svg', '02-orbit.svg', '03-form.svg', '04-platform.svg']);
const build = Bun.spawnSync({
  cmd: ['bun', 'run', 'build'],
  cwd: rootDirectory,
  stdout: 'inherit',
  stderr: 'inherit',
});
if (build.exitCode !== 0) throw new Error('ZORA public web artifacts must build first.');

const bundle = await Bun.build({
  entrypoints: [resolve(import.meta.dir, 'main.tsx')],
  outdir: resolve(import.meta.dir, '.cache'),
  target: 'browser',
  format: 'esm',
  jsx: { runtime: 'automatic', importSource: 'react' },
});
if (!bundle.success) {
  throw new Error(bundle.logs.map(String).join('\n'));
}
const jsOutput = bundle.outputs.find((output) => output.path.endsWith('.js'));
if (!jsOutput) throw new Error('Carousel browser example bundle was not emitted.');
const js = await jsOutput.text();
const css = carouselExampleCss;
const html = [
  '<!doctype html>',
  '<html lang="en">',
  '<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>',
  '<meta name="theme-color" content="#091323"/>',
  '<title>ZORA — Carousel / Stories in Motion</title>',
  '<link rel="stylesheet" href="/styles.css"/></head>',
  '<body><div id="root"></div><script type="module" src="/app.js"></script></body></html>',
].join('');

const server = Bun.serve({
  hostname: '127.0.0.1',
  port: Number(Bun.env.PORT ?? '3217'),
  async fetch(request) {
    const { pathname } = new URL(request.url);
    if (pathname === '/app.js') {
      return new Response(js, { headers: { 'content-type': 'application/javascript' } });
    }
    if (pathname === '/styles.css') {
      return new Response(css, { headers: { 'content-type': 'text/css' } });
    }
    if (pathname.startsWith('/media/')) {
      const name = pathname.slice('/media/'.length);
      if (!media.has(name)) return new Response('Not found', { status: 404 });
      return new Response(Bun.file(resolve(import.meta.dir, 'media', name)), {
        headers: { 'content-type': 'image/svg+xml', 'cache-control': 'public,max-age=3600' },
      });
    }
    if (pathname !== '/') return new Response('Not found', { status: 404 });
    return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
  },
});

console.info(`ZORA Carousel example: http://127.0.0.1:${server.port}`);
