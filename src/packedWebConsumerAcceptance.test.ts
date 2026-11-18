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

/** Verifies the published authoring package in an independent Vite/RNW consumer installation. */
test(
  'installs, renders, and bundles the public authoring entrypoint',
  () => {
    const subprocess = Bun.spawnSync({
      cmd: [
        process.execPath,
        'scripts/verify-packed-web-consumer.ts',
        '--skip-build',
        '--authoring',
      ],
      stderr: 'pipe',
      stdout: 'pipe',
    });
    const output = `${subprocess.stdout.toString()}\n${subprocess.stderr.toString()}`;

    expect(subprocess.exitCode, output).toBe(0);
    expect(output).toContain(
      'Packed ZORA authoring consumer Vite/RNW render and controlled selection passed.',
    );
  },
  { timeout: 120_000 },
);

/** Verifies Flow diagnostics stay redacted in an independent packed React Native Web consumer. */
test(
  'does not render untrusted Flow error or trace text in the packed RNW consumer',
  () => {
    const subprocess = Bun.spawnSync({
      cmd: [process.execPath, 'scripts/verify-packed-web-consumer.ts', '--skip-build', '--flow-ui'],
      stderr: 'pipe',
      stdout: 'pipe',
    });
    const output = `${subprocess.stdout.toString()}\n${subprocess.stderr.toString()}`;

    expect(subprocess.exitCode, output).toBe(0);
    expect(output).toContain('Packed ZORA RNW Flow UI consumer redaction boundary passed.');
  },
  { timeout: 120_000 },
);
