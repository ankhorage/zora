import { strict as assert } from 'node:assert';
import { spawn, execFile } from 'node:child_process';
import { once } from 'node:events';
import { cp, mkdtemp, rm } from 'node:fs/promises';
import { createServer } from 'node:net';
import { join } from 'node:path';
import { promisify } from 'node:util';

import { chromium } from 'playwright-core';

import { sync } from '../../src/cli/commands/sync';

const packageRoot = join(import.meta.dir, '..', '..');
const sandbox = await mkdtemp(join(packageRoot, '.zora-next-acceptance-'));
const projectRoot = join(sandbox, 'app');
const nextBin = join(packageRoot, 'node_modules', 'next', 'dist', 'bin', 'next');

try {
  await cp(join(import.meta.dir, 'fixtures', 'next-app'), projectRoot, { recursive: true });
  const context = {
    cwd: projectRoot,
    writeStdout() {},
    writeStderr(message: string) {
      throw new Error(message);
    },
  };
  assert.equal((await sync({ argv: ['--web'], context })).exitCode, 0);

  const { stdout, stderr } = await promisify(execFile)('node', [nextBin, 'build'], {
    cwd: projectRoot,
    env: { ...process.env, CI: '1', NEXT_TELEMETRY_DISABLED: '1' },
    maxBuffer: 8 * 1024 * 1024,
    timeout: 180_000,
  });
  assert(stdout.includes('Generating static pages'), `${stdout}\n${stderr}`);

  const port = await reservePortAsync();
  const server = spawn('node', [nextBin, 'start', '-p', String(port)], {
    cwd: projectRoot,
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const serverOutput: string[] = [];
  server.stdout.on('data', (chunk: Buffer) => serverOutput.push(chunk.toString()));
  server.stderr.on('data', (chunk: Buffer) => serverOutput.push(chunk.toString()));
  try {
    const url = `http://127.0.0.1:${port}`;
    await waitForServerAsync(url, server, serverOutput);
    const browser = await chromium.launch({ channel: 'chrome', headless: true });
    try {
      const page = await browser.newPage();
      const runtimeErrors: string[] = [];
      page.on('pageerror', (error) => runtimeErrors.push(error.message));
      page.on('console', (message) => {
        if (message.type() === 'error') runtimeErrors.push(message.text());
      });
      const response = await page.goto(url, { waitUntil: 'networkidle' });
      assert.equal(response?.status(), 200);
      await page.getByText('Next materialization').waitFor();
      await page.locator('[data-testid="next-layout-trigger"]').click();
      await page.locator('[data-testid="next-layout-option-circle"]').click();
      await page.locator('[data-testid="next-layout-trigger"]').getByText('Circle').waitFor();
      assert.deepEqual(runtimeErrors, []);
    } finally {
      await browser.close();
    }
  } finally {
    server.kill();
    if (server.exitCode === null) await once(server, 'close');
  }
  process.stdout.write('Next.js Turbopack prerender, hydration, and Select passed.\n');
} finally {
  await rm(sandbox, { force: true, recursive: true });
}

async function reservePortAsync(): Promise<number> {
  const server = createServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = server.address();
  assert(address && typeof address !== 'string');
  server.close();
  await once(server, 'close');
  return address.port;
}

async function waitForServerAsync(
  url: string,
  server: ReturnType<typeof spawn>,
  output: readonly string[],
): Promise<void> {
  for (const _attempt of Array.from({ length: 100 })) {
    if (server.exitCode !== null) throw new Error(`Next.js exited early: ${output.join('')}`);
    const response = await fetch(url).catch(() => undefined);
    if (response?.ok) return;
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error(`Next.js did not start: ${output.join('')}`);
}
