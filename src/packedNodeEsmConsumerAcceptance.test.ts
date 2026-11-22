import { expect, test } from 'bun:test';

/*** Verifies the packed package resolves under a clean Node ESM consumer. */
test(
  'installs and imports emitted Node ESM modules from a packed artifact',
  () => {
    const subprocess = Bun.spawnSync({
      cmd: [process.execPath, 'scripts/verify-packed-node-esm-consumer.ts', '--skip-build'],
      stderr: 'pipe',
      stdout: 'pipe',
    });
    const output = `${subprocess.stdout.toString()}\n${subprocess.stderr.toString()}`;

    expect(subprocess.exitCode, output).toBe(0);
    expect(output).toContain(
      'Packed ZORA Node ESM consumer imports explicit emitted module specifiers.',
    );
  },
  { timeout: 120_000 },
);
