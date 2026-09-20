import { describe, expect, it } from 'bun:test';
import cytoscape, { type LayoutOptions } from 'cytoscape';

import { runDetachedGraphLayout } from './runDetachedGraphLayout';

it('allows the real ELK adapter to finish after its display graph is destroyed', async () => {
  // Exercise the browser-bundled ELK worker, whose CommonJS loader differs from Bun's source loader.
  const build = await Bun.build({
    entrypoints: ['./test-fixtures/graphLayoutLifecycle.ts'],
    target: 'browser',
  });
  expect(build.success).toBe(true);
  const [output] = build.outputs;
  if (output === undefined) throw new Error('Missing ELK regression bundle.');
  const execution = Bun.spawn(['node', '--input-type=module'], {
    stdin: output,
    stdout: 'pipe',
    stderr: 'pipe',
  });
  const [exitCode, stderr] = await Promise.all([
    execution.exited,
    new Response(execution.stderr).text(),
  ]);
  expect(stderr).toBe('');
  expect(exitCode).toBe(0);
});

describe('runDetachedGraphLayout', () => {
  it('does not access a destroyed display graph when an uncancellable layout completes', () => {
    const pending = registerDeferredLayout('detached-destroy');
    const cy = createGraph();
    const completed: boolean[] = [];
    const session = runDetachedGraphLayout(cy, { name: 'detached-destroy' }, () =>
      completed.push(true),
    );
    session.stop();
    cy.destroy();

    expect(() => pending.finish()).not.toThrow();
    expect(completed).toEqual([]);
    expect(pending.graph()?.destroyed()).toBe(true);
  });

  it('discards stale positions when another generation has replaced the displayed graph', () => {
    const pending = registerDeferredLayout('detached-replace');
    const cy = createGraph();
    const completed: boolean[] = [];
    const session = runDetachedGraphLayout(cy, { name: 'detached-replace' }, () =>
      completed.push(true),
    );
    session.stop();
    cy.getElementById('a').position({ x: 400, y: 300 });
    pending.finish();

    expect(cy.getElementById('a').position()).toEqual({ x: 400, y: 300 });
    expect(completed).toEqual([]);
    cy.destroy();
  });

  it('applies current positions once while retaining selection and viewport', () => {
    const pending = registerDeferredLayout('detached-complete');
    const cy = createGraph();
    cy.getElementById('a').select();
    cy.viewport({ zoom: 0.7, pan: { x: 50, y: 20 } });
    const completed: boolean[] = [];
    runDetachedGraphLayout(cy, { name: 'detached-complete' }, () => completed.push(true));
    pending.finish();

    expect(cy.getElementById('a').position()).toEqual({ x: 100, y: 200 });
    expect(cy.getElementById('a').selected()).toBe(true);
    expect(cy.zoom()).toBe(0.7);
    expect(cy.pan()).toEqual({ x: 50, y: 20 });
    expect(completed).toEqual([true]);
    expect(pending.graph()?.destroyed()).toBe(true);
    cy.destroy();
  });
});

function createGraph() {
  return cytoscape({ headless: true, elements: [{ data: { id: 'a' } }, { data: { id: 'b' } }] });
}

function registerDeferredLayout(name: string) {
  const state: { finish?: () => void; cy?: cytoscape.Core } = {};
  function DeferredLayout(this: { options: LayoutOptions }, options: LayoutOptions) {
    this.options = options;
  }
  DeferredLayout.prototype = {
    run(this: DeferredInstance) {
      const { cy, eles } = this.options;
      state.cy = cy;
      state.finish = () => eles.layoutPositions(this, this.options, () => ({ x: 100, y: 200 }));
      return this;
    },
    stop(this: DeferredInstance) {
      return this;
    },
  };
  cytoscape('layout', name, DeferredLayout);
  return { finish: () => state.finish?.(), graph: () => state.cy };
}

type DeferredInstance = cytoscape.Layouts & {
  options: cytoscape.BaseLayoutOptions & { cy: cytoscape.Core; eles: cytoscape.NodeCollection };
};
