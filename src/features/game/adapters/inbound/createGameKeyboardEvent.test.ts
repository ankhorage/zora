import { describe, expect, test } from 'bun:test';

import { createGameKeyboardEvent } from './createGameKeyboardEvent';

describe('createGameKeyboardEvent', () => {
  test('maps a configured key through fallback event and entity values', () => {
    expect(
      createGameKeyboardEvent({
        bindings: [{ key: 'ArrowLeft', preventDefault: true }],
        fallbackEventType: 'player.move',
        fallbackEntityId: 'player',
        key: 'ArrowLeft',
      }),
    ).toEqual({
      event: {
        type: 'player.move',
        entityId: 'player',
        payload: { key: 'ArrowLeft' },
      },
      preventDefault: true,
    });
  });

  test('allows one key binding to override the event target', () => {
    expect(
      createGameKeyboardEvent({
        bindings: [{ key: ' ', eventType: 'player.action', entityId: 'actor' }],
        fallbackEventType: 'player.move',
        fallbackEntityId: 'player',
        key: ' ',
      }),
    ).toEqual({
      event: {
        type: 'player.action',
        entityId: 'actor',
        payload: { key: ' ' },
      },
      preventDefault: false,
    });
  });

  test('ignores keys without a binding', () => {
    expect(
      createGameKeyboardEvent({
        bindings: [{ key: 'ArrowLeft' }],
        fallbackEventType: 'player.move',
        key: 'ArrowRight',
      }),
    ).toBeUndefined();
  });
});
