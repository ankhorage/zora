import { describe, expect, test } from 'bun:test';

import { resolveSelectionEventIntent } from './resolveSelectionEventIntent';

describe('resolveSelectionEventIntent', () => {
  test('replaces for an unmodified desktop pointer event', () => {
    expect(resolveSelectionEventIntent({}, 'pointer')).toBe('replace');
  });

  test('toggles for Command and Control modifiers', () => {
    expect(resolveSelectionEventIntent({ metaKey: true }, 'pointer')).toBe('toggle');
    expect(resolveSelectionEventIntent({ nativeEvent: { ctrlKey: true } }, 'pointer')).toBe(
      'toggle',
    );
  });

  test('toggles pointer events reported as touch', () => {
    expect(
      resolveSelectionEventIntent({ originalEvent: { pointerType: 'touch' } }, 'pointer'),
    ).toBe('toggle');
  });

  test('toggles renderer touch events without pointerType', () => {
    expect(
      resolveSelectionEventIntent(
        { originalEvent: { type: 'touchend', changedTouches: [] } },
        'pointer',
      ),
    ).toBe('toggle');
  });

  test('toggles native touch fallback without modifier data', () => {
    expect(resolveSelectionEventIntent({}, 'touch')).toBe('toggle');
  });
});
