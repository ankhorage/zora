import { expect, test } from 'bun:test';

test('exposes the shared flow canvas and node components through its public facade', async () => {
  const facade = await Bun.file('src/features/flow/public.ts').text();

  expect(facade).toContain("export { FlowCanvas } from './adapters/inbound/FlowCanvas';");
  expect(facade).toContain("export { FlowNode } from './adapters/inbound/FlowNode';");
});
