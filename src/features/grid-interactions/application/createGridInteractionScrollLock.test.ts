import { expect, test } from 'bun:test';

import type { ScrollGestureLock } from '../../../types/layout';
import { createGridInteractionScrollLock } from './createGridInteractionScrollLock';

/*** Counts held and released ancestor scroll locks. */
function createCountingScrollLock() {
  const state = { acquired: 0, released: 0 };
  const lock: ScrollGestureLock = {
    acquire: () => {
      state.acquired += 1;
      return () => {
        state.released += 1;
      };
    },
  };
  return { lock, state };
}

test('takes the ancestor scroll lock once per gesture even when grant repeats', () => {
  const { lock, state } = createCountingScrollLock();
  const gesture = createGridInteractionScrollLock(lock);

  gesture.acquire();
  gesture.acquire();

  expect(state).toEqual({ acquired: 1, released: 0 });
});

test('releases on release or termination and can lock again for the next gesture', () => {
  const { lock, state } = createCountingScrollLock();
  const gesture = createGridInteractionScrollLock(lock);

  gesture.acquire();
  gesture.release();
  gesture.release();
  gesture.acquire();
  gesture.release();

  expect(state).toEqual({ acquired: 2, released: 2 });
});
