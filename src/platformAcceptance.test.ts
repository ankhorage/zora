import { expect, test } from 'bun:test';

test('passes the isolated Surface 3 and RN Web 0.21 acceptance suite', () => {
  const subprocess = Bun.spawnSync({
    cmd: [process.execPath, 'test', 'test-fixtures/platformAcceptance.test.tsx'],
    stderr: 'pipe',
    stdout: 'pipe',
  });
  const output = `${subprocess.stdout.toString()}\n${subprocess.stderr.toString()}`;

  expect(subprocess.exitCode, output).toBe(0);
  expect(output).toContain('5 pass');
  expect(output).toContain('0 fail');
});
