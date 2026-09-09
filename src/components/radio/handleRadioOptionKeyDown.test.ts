import { expect, test } from 'bun:test';
import type { KeyboardEvent } from 'react';

import { DIRECTION_MODIFIERS } from '../../constants/keyboard';
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

for (const [key, direction] of DIRECTION_MODIFIERS) {
  test(`${key} wraps and skips disabled radio options`, () => {
    const activated: number[] = [];
    const focused: number[] = [];
    let prevented = 0;
    const options: RadioOptionKeyboardTarget[] = [0, 1, 2, 3].map((index) => ({
      closest: () => ({ querySelectorAll: () => options }),
      getAttribute: () => (index === 1 ? 'true' : 'false'),
      focus: () => focused.push(index),
      click: () => activated.push(index),
    }));
    for (const currentTarget of [options[0], options[2], options[3]]) {
      handleRadioOptionKeyDown(
        {
          key,
          currentTarget,
          preventDefault: () => prevented++,
        } as KeyboardEvent<RadioOptionKeyboardTarget>,
        () => undefined,
      );
    }
    const expected = direction === 1 ? [2, 3, 0] : [3, 0, 2];
    expect(focused).toEqual(expected);
    expect(activated).toEqual(expected);
    expect(prevented).toBe(3);
  });
}
