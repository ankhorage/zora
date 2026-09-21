import { expect, test } from 'bun:test';

test('materialized components share the generated provider through SSR and interaction', () => {
  const subprocess = Bun.spawnSync({
    cmd: [process.execPath, 'scripts/web-artifacts/verifyWebMaterialization.ts'],
    stderr: 'pipe',
    stdout: 'pipe',
  });
  const output = `${subprocess.stdout.toString()}\n${subprocess.stderr.toString()}`;
  expect(subprocess.exitCode, output).toBe(0);
  expect(output).toContain(
    'Materialized ZORA provider, SSR hydration, and Select interaction passed.',
  );
});
