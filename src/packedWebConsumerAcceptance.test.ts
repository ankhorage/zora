import { expect, test } from 'bun:test';

/** Verifies the published web package in a fresh consumer installation. */
test(
  'installs, SSR-renders, hydrates, and interacts through published web entrypoints',
  () => {
    const subprocess = Bun.spawnSync({
      cmd: [process.execPath, 'scripts/verify-packed-web-consumer.ts', '--skip-build'],
      stderr: 'pipe',
      stdout: 'pipe',
    });
    const output = `${subprocess.stdout.toString()}\n${subprocess.stderr.toString()}`;

    expect(subprocess.exitCode, output).toBe(0);
    expect(output).toContain(
      'Packed ZORA web consumer SSR, hydration, and Select interaction passed.',
    );
  },
  { timeout: 120_000 },
);
