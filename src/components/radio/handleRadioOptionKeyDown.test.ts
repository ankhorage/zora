import { expect, test } from 'bun:test';
import type { KeyboardEvent } from 'react';

import {
  handleRadioOptionKeyDown,
  type RadioOptionKeyboardTarget,
} from './handleRadioOptionKeyDown';

test('Space selects the focused radio and prevents page scrolling', () => {
  let selected = 0;
  let prevented = 0;
  handleRadioOptionKeyDown(
    { key: ' ', preventDefault: () => prevented++ } as KeyboardEvent<RadioOptionKeyboardTarget>,
    () => selected++,
  );
  expect(selected).toBe(1);
  expect(prevented).toBe(1);
});

test('arrow navigation wraps and skips disabled radio options', () => {
  const activated: number[] = [];
  const focused: number[] = [];
  const options: RadioOptionKeyboardTarget[] = [0, 1, 2].map((index) => ({
    closest: () => ({ querySelectorAll: () => options }),
    getAttribute: () => (index === 1 ? 'true' : 'false'),
    focus: () => focused.push(index),
    click: () => activated.push(index),
  }));
  for (const [key, currentTarget] of [
    ['ArrowRight', options[0]],
    ['ArrowRight', options[2]],
  ] as const) {
    handleRadioOptionKeyDown(
      {
        key,
        currentTarget,
        preventDefault() {
          return undefined;
        },
      } as KeyboardEvent<RadioOptionKeyboardTarget>,
      () => undefined,
    );
  }
  expect(focused).toEqual([2, 0]);
  expect(activated).toEqual([2, 0]);
});
