import { expect, test } from 'bun:test';

test('generated public artifacts provide responsive context independently and together', () => {
  const subprocess = Bun.spawnSync({
    cmd: [process.execPath, 'test', 'test-fixtures/webArtifactRuntime.test.tsx'],
    stderr: 'pipe',
    stdout: 'pipe',
  });
  const output = `${subprocess.stdout.toString()}\n${subprocess.stderr.toString()}`;
  expect(subprocess.exitCode, output).toBe(0);
  expect(output).toContain('2 pass');
  expect(output).toContain('0 fail');
});
