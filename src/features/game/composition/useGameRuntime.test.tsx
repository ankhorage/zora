import type { GameDefinition, GameEvent, GameOutput } from '@ankhorage/game';
import { describe, expect, test } from 'bun:test';
import { Window } from 'happy-dom';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';

import type { GameRuntimeValue } from '../../../types/gameRuntime';
import { useGameRuntime } from './useGameRuntime';

interface RuntimeHarnessProps {
  readonly autoAdvanceTime: boolean;
  readonly definition: GameDefinition;
  readonly dispatchRef: { current: GameRuntimeValue['dispatch'] | undefined };
  readonly onOutput: (output: GameOutput) => void;
}

function RuntimeHarness({
  autoAdvanceTime,
  definition,
  dispatchRef,
  onOutput,
}: RuntimeHarnessProps) {
  const runtime = useGameRuntime({ autoAdvanceTime, definition, onOutput });
  dispatchRef.current = runtime.dispatch;
  return null;
}

const batchedOutputDefinition: GameDefinition = {
  id: 'batched-output-test',
  stages: [{ id: 'main' }],
  rules: [
    {
      id: 'emit-first',
      event: 'emit.first',
      effects: [{ kind: 'emit', type: 'first' }],
    },
    {
      id: 'emit-second',
      event: 'emit.second',
      effects: [{ kind: 'emit', type: 'second' }],
    },
  ],
};

const pausedScheduleDefinition: GameDefinition = {
  id: 'paused-schedule-test',
  stages: [{ id: 'main' }],
  rules: [
    {
      id: 'schedule-output',
      event: 'schedule.output',
      effects: [
        {
          kind: 'schedule',
          delayMs: { kind: 'literal', value: 500 },
          effects: [{ kind: 'emit', type: 'scheduled' }],
        },
      ],
    },
    {
      id: 'noop',
      event: 'noop',
      effects: [],
    },
  ],
};

describe('useGameRuntime', () => {
  test('delivers outputs from every state update in one React batch', () => {
    const browser = new Window();
    const restoreGlobals = installBrowserGlobals(browser);
    const host = document.createElement('div');
    document.body.appendChild(host);
    const root = createRoot(host);
    const outputs: GameOutput[] = [];
    const dispatchRef: { current: ((event: GameEvent) => void) | undefined } = {
      current: undefined,
    };

    try {
      act(() =>
        root.render(
          <RuntimeHarness
            autoAdvanceTime
            definition={batchedOutputDefinition}
            dispatchRef={dispatchRef}
            onOutput={(output) => outputs.push(output)}
          />,
        ),
      );

      act(() => {
        dispatchRef.current?.({ type: 'emit.first' });
        dispatchRef.current?.({ type: 'emit.second' });
      });

      expect(outputs.map((output) => output.type)).toEqual(['first', 'second']);
    } finally {
      act(() => root.unmount());
      browser.close();
      restoreGlobals();
    }
  });

  test('does not advance scheduled effects across time spent paused', () => {
    const browser = new Window();
    const restoreGlobals = installBrowserGlobals(browser);
    const originalNow = Date.now;
    const host = document.createElement('div');
    document.body.appendChild(host);
    const root = createRoot(host);
    const outputs: GameOutput[] = [];
    const dispatchRef: { current: ((event: GameEvent) => void) | undefined } = {
      current: undefined,
    };
    let now = 100;
    Date.now = () => now;

    const render = (autoAdvanceTime: boolean) => (
      <RuntimeHarness
        autoAdvanceTime={autoAdvanceTime}
        definition={pausedScheduleDefinition}
        dispatchRef={dispatchRef}
        onOutput={(output) => outputs.push(output)}
      />
    );

    try {
      act(() => root.render(render(false)));
      act(() => dispatchRef.current?.({ type: 'schedule.output' }));

      now = 10_000;
      act(() => root.render(render(true)));
      act(() => dispatchRef.current?.({ type: 'noop' }));

      expect(outputs).toEqual([]);
    } finally {
      Date.now = originalNow;
      act(() => root.unmount());
      browser.close();
      restoreGlobals();
    }
  });
});

function installBrowserGlobals(browser: Window): () => void {
  const keys = ['window', 'document', 'Node', 'navigator', 'IS_REACT_ACT_ENVIRONMENT'] as const;
  const previous = keys.map(
    (key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)] as const,
  );

  Object.assign(globalThis, {
    window: browser,
    document: browser.document,
    Node: browser.Node,
    navigator: browser.navigator,
    IS_REACT_ACT_ENVIRONMENT: true,
  });

  return () => {
    for (const [key, descriptor] of previous) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  };
}
