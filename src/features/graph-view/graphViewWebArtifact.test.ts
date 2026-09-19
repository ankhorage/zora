import { expect, test } from 'bun:test';

test('GraphView browser artifact exposes the canonical public discovery facade', async () => {
  const source = await Bun.file(
    'src/features/graph-view/adapters/inbound/web-artifact/public.ts',
  ).text();

  expect(source).toContain('GraphView');
  expect(source).toContain("from './GraphView'");
});
