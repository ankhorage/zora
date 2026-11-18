import { expect, test } from 'bun:test';

import { handleRadioOptionKeyDown } from './handleRadioOptionKeyDown';

test('Space selects the focused radio and prevents page scrolling', () => {
  let selected = 0;
  let prevented = 0;
  handleRadioOptionKeyDown(
    ' ',
    () => prevented++,
    () => selected++,
    () => undefined,
  );
  expect(selected).toBe(1);
  expect(prevented).toBe(1);
});

test('Arrow keys delegate directional selection to the radio group', () => {
  const directions: number[] = [];
  let prevented = 0;
  handleRadioOptionKeyDown(
    'ArrowDown',
    () => prevented++,
    () => undefined,
    (direction) => directions.push(direction),
  );
  expect(directions).toEqual([1]);
  expect(prevented).toBe(1);
});
