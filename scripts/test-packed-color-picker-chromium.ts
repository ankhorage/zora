import { strict as assert } from 'node:assert';
import { cpSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const repositoryRoot = resolve(import.meta.dir, '..');
const temporaryRoot = mkdtempSync(join(tmpdir(), 'zora-packed-color-picker-chromium-'));
const packageSourceRoot = join(temporaryRoot, 'package-source');
const chromiumCommand =
  process.env.CHROME_BIN ??
  (process.platform === 'darwin'
    ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    : 'google-chrome');

/*** Exercise the packed public color controls with real Chromium pointer and keyboard input. */
async function testPackedColorPickerChromiumAsync() {
  const packageRoot = join(temporaryRoot, 'package');
  const consumerRoot = join(temporaryRoot, 'consumer');
  createIsolatedPackageSource();
  mkdirSync(packageRoot);
  mkdirSync(consumerRoot);
  run(['bun', 'install', '--frozen-lockfile'], packageSourceRoot, {
    BUN_INSTALL_CACHE_DIR: join(temporaryRoot, 'bun-cache'),
    TMPDIR: temporaryRoot,
  });
  run(['bun', 'run', 'build'], packageSourceRoot);
  const tarball = pack(packageRoot, packageSourceRoot);
  writeConsumer(consumerRoot, tarball);
  run(['bun', 'install', '--ignore-scripts'], consumerRoot, {
    BUN_INSTALL_CACHE_DIR: join(temporaryRoot, 'bun-cache'),
    TMPDIR: temporaryRoot,
  });
  const build = await Bun.build({
    entrypoints: [join(consumerRoot, 'app.tsx')],
    format: 'esm',
    naming: 'app.js',
    outdir: consumerRoot,
    target: 'browser',
  });
  assert(build.success, build.logs.map(({ message }) => message).join('\n'));
  const server = Bun.serve({
    fetch: (request) =>
      new URL(request.url).pathname === '/app.js'
        ? new Response(Bun.file(join(consumerRoot, 'app.js')))
        : new Response('<div id="root"></div><script type="module" src="/app.js"></script>', {
            headers: { 'content-type': 'text/html; charset=utf-8' },
          }),
    port: 0,
  });
  const browser = await Chrome.createAsync();
  try {
    await browser.navigateAsync(`http://127.0.0.1:${server.port}`);
    await browser.waitAsync(`window.colorAcceptance?.read().hydrated === true`);
    await browser.captureScreenshotAsync(process.env.COLOR_PICKER_SCREENSHOT_PATH);
    await browser.clickAsync('[aria-label^="Select #"]');
    await browser.waitAsync(`window.colorAcceptance.read().gridChanges >= 1`);
    await browser.clickAsync('[role="tab"]', 0.5, 0.5, 'Wheel');
    await browser.clickAsync('svg[aria-label="Color wheel"]', 0.2, 0.5);
    await browser.dragAsync('svg[aria-label="Color wheel"]', 0.2, 0.5, 0.5, 0.2);
    await browser.keyAsync('[role="slider"]', 'ArrowRight');
    await browser.waitAsync(`window.colorAcceptance.read().wheelChanges >= 3`);
    const state = await browser.evaluateAsync(`window.colorAcceptance.read()`);
    assert(
      state.gridChanges >= 1 && state.wheelChanges >= 3,
      'Grid and Wheel actions were not controlled.',
    );
    assert.equal(
      await browser.evaluateAsync(`document.querySelector('polygon') !== null`),
      true,
      'Triadic harmony did not render its triangle.',
    );
    assert.equal(state.errors.length, 0, state.errors.join('\n'));
    await browser.captureScreenshotAsync(process.env.COLOR_PICKER_SCREENSHOT_PATH);
    console.log(
      'Packed ColorPicker Chromium acceptance passed: controlled Grid selection, Wheel pointer/keyboard input, triadic overlay, and tab persistence.',
    );
  } finally {
    browser.close();
    server.stop();
  }
}

function run(command: readonly string[], cwd: string, env: Record<string, string> = {}) {
  const result = Bun.spawnSync({
    cmd: command,
    cwd,
    env: { ...process.env, CI: '1', ...env },
    stderr: 'pipe',
    stdout: 'pipe',
  });
  assert.equal(
    result.exitCode,
    0,
    `${command.join(' ')} failed:\n${result.stdout}\n${result.stderr}`,
  );
}

function createIsolatedPackageSource(): void {
  cpSync(repositoryRoot, packageSourceRoot, {
    filter: (source) =>
      !['.git', 'dist', 'node_modules', 'web-dist'].includes(source.split('/').at(-1) ?? ''),
    recursive: true,
  });
}

function pack(packageRoot: string, packageSourceRoot: string): string {
  run(
    ['npm', 'pack', '--ignore-scripts', '--silent', '--pack-destination', packageRoot],
    packageSourceRoot,
    { npm_config_cache: join(temporaryRoot, 'npm-cache') },
  );
  const tarballs = readdirSync(packageRoot).filter((name) => name.endsWith('.tgz'));
  assert.equal(tarballs.length, 1);
  return join(packageRoot, tarballs[0] as string);
}

function writeConsumer(root: string, tarball: string): void {
  writeFileSync(
    join(root, 'package.json'),
    JSON.stringify({
      name: 'zora-color-acceptance',
      private: true,
      type: 'module',
      dependencies: {
        '@ankhorage/zora': `file:${tarball}`,
        '@ankhorage/surface': '^9.5.15',
        react: '19.2.3',
        'react-dom': '19.2.3',
        'react-native': '0.86.3',
        'react-native-svg': '15.15.4',
        'react-native-web': '0.21.4',
      },
    }),
  );
  writeFileSync(
    join(root, 'app.tsx'),
    `import React from 'react'; import { createRoot } from 'react-dom/client'; import { ColorPicker } from '@ankhorage/zora/web/color-picker'; import { ZoraProvider } from '@ankhorage/zora/web/runtime'; function App(){const [value,setValue]=React.useState({primaryColor:'#2563eb',harmony:'triadic',tone:'jewel'});const [activeTab,setActiveTab]=React.useState('grid');const [gridChanges,setGridChanges]=React.useState(0);const [wheelChanges,setWheelChanges]=React.useState(0);return <ZoraProvider mode="dark"><ColorPicker activeTab={activeTab} onActiveTabChange={setActiveTab} onDismiss={()=>undefined} onValueChange={(next)=>{setValue(next);setGridChanges((count)=>activeTab==='grid'?count+1:count);setWheelChanges((count)=>activeTab==='wheel'?count+1:count)}} primaryColor={value.primaryColor} harmony={value.harmony} tone={value.tone} tones={[{id:'jewel',accent:'Jewel',accentTarget:{lightness:.53,chroma:.18}}]} tabs={['grid','wheel']} width={560}/><output data-testid="state">{JSON.stringify({gridChanges,wheelChanges,triangle:document.querySelector('polygon')!==null})}</output></ZoraProvider>} const errors=[]; window.addEventListener('error',(event)=>errors.push(String(event.error))); createRoot(document.getElementById('root')).render(<App/>); window.colorAcceptance={read:()=>({...JSON.parse(document.querySelector('[data-testid="state"]')?.textContent??'{}'),errors,hydrated:true})};`,
  );
}

class Chrome {
  private id = 0;
  private readonly pending = new Map<number, (value: any) => void>();
  private constructor(
    private readonly process: ReturnType<typeof Bun.spawn>,
    private readonly socket: WebSocket,
  ) {
    socket.onmessage = (event) => {
      const message = JSON.parse(String(event.data));
      const resolve = this.pending.get(message.id);
      if (resolve) {
        this.pending.delete(message.id);
        resolve(message.result);
      }
    };
  }
  static async createAsync(): Promise<Chrome> {
    const port = await portAsync();
    const process = Bun.spawn([
      chromiumCommand,
      '--headless=new',
      '--no-first-run',
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${join(temporaryRoot, 'chrome')}`,
      'about:blank',
    ]);
    await waitAsync(`http://127.0.0.1:${port}/json/version`);
    const target = (await (
      await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })
    ).json()) as { webSocketDebuggerUrl: string };
    const socket = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise<void>((resolve, reject) => {
      socket.onopen = () => resolve();
      socket.onerror = () => reject(new Error('Chrome socket failed.'));
    });
    const chrome = new Chrome(process, socket);
    await chrome.sendAsync('Page.enable');
    await chrome.sendAsync('Runtime.enable');
    return chrome;
  }
  async navigateAsync(url: string) {
    await this.sendAsync('Page.navigate', { url });
  }
  async evaluateAsync(expression: string): Promise<any> {
    const result = await this.sendAsync('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    return result.result.value;
  }
  async waitAsync(expression: string) {
    for (let index = 0; index < 100; index++) {
      if (await this.evaluateAsync(expression)) return;
      await Bun.sleep(100);
    }
    throw new Error(`Timed out: ${expression}`);
  }
  async clickAsync(selector: string, x = 0.5, y = 0.5, text?: string) {
    const rect = await this.resolvePointAsync(selector, x, y, text);
    for (const type of ['mousePressed', 'mouseReleased'])
      await this.sendAsync('Input.dispatchMouseEvent', {
        type,
        x: rect.x,
        y: rect.y,
        button: 'left',
        buttons: type === 'mousePressed' ? 1 : 0,
        clickCount: 1,
        pointerType: 'mouse',
      });
  }
  async dragAsync(selector: string, startX: number, startY: number, endX: number, endY: number) {
    const start = await this.resolvePointAsync(selector, startX, startY);
    const end = await this.resolvePointAsync(selector, endX, endY);
    await this.sendAsync('Input.dispatchMouseEvent', {
      type: 'mousePressed',
      x: start.x,
      y: start.y,
      button: 'left',
      clickCount: 1,
    });
    for (let step = 1; step <= 4; step++)
      await this.sendAsync('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        x: start.x + ((end.x - start.x) * step) / 4,
        y: start.y + ((end.y - start.y) * step) / 4,
        button: 'left',
        buttons: 1,
      });
    await this.sendAsync('Input.dispatchMouseEvent', {
      type: 'mouseReleased',
      x: end.x,
      y: end.y,
      button: 'left',
      clickCount: 1,
    });
  }
  async keyAsync(selector: string, key: string, text?: string) {
    const point = await this.resolvePointAsync(selector, 0.5, 0.5, text);
    await this.sendAsync('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: point.x,
      y: point.y,
    });
    await this.evaluateAsync(
      `(()=>{const candidates=[...document.querySelectorAll(${JSON.stringify(selector)})];const element=${text ? `candidates.find((node)=>node.textContent?.trim()===${JSON.stringify(text)})` : 'candidates[0]'};element?.focus()})()`,
    );
    await this.sendAsync('Input.dispatchKeyEvent', { type: 'keyDown', key, code: key });
    await this.sendAsync('Input.dispatchKeyEvent', { type: 'keyUp', key, code: key });
  }
  async captureScreenshotAsync(path: string | undefined) {
    if (!path) return;
    const screenshot = await this.sendAsync('Page.captureScreenshot', { format: 'png' });
    writeFileSync(path, Buffer.from(screenshot.data, 'base64'));
  }
  private async resolvePointAsync(
    selector: string,
    x: number,
    y: number,
    text?: string,
  ): Promise<{ x: number; y: number }> {
    const rect = await this.evaluateAsync(
      `(()=>{const candidates=[...document.querySelectorAll(${JSON.stringify(selector)})];const element=${text ? `candidates.find((node)=>node.textContent?.trim()===${JSON.stringify(text)})` : 'candidates[0]'};if(!element)return null;const r=element.getBoundingClientRect();return {x:r.x+r.width*${x},y:r.y+r.height*${y}}})()`,
    );
    assert(rect, `Missing ${text ?? selector}`);
    return rect;
  }
  private sendAsync(method: string, params: Record<string, unknown> = {}) {
    const id = ++this.id;
    this.socket.send(JSON.stringify({ id, method, params }));
    return new Promise<any>((resolve) => this.pending.set(id, resolve));
  }
  close() {
    this.socket.close();
    this.process.kill();
  }
}
async function portAsync() {
  const server = Bun.serve({ fetch: () => new Response(''), port: 0 });
  const port = server.port;
  server.stop();
  return port;
}
async function waitAsync(url: string) {
  for (let index = 0; index < 100; index++) {
    try {
      if ((await fetch(url)).ok) return;
    } catch {}
    await Bun.sleep(100);
  }
  throw new Error(`Chrome unavailable: ${url}`);
}
try {
  await testPackedColorPickerChromiumAsync();
} finally {
  rmSync(temporaryRoot, { force: true, recursive: true });
}
