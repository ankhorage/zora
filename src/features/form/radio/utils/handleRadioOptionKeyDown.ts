import { DIRECTION_MODIFIERS } from '../constants';

/*** Select a focused radio option through the React Native keyboard event contract. */
export function handleRadioOptionKeyDown(
  key: string,
  preventDefault: () => void,
  select: () => void,
  navigate: (direction: -1 | 1) => void,
): void {
  if (key === ' ') {
    preventDefault();
    select();
    return;
  }
  const direction = DIRECTION_MODIFIERS.get(key);
  if (direction !== -1 && direction !== 1) return;
  preventDefault();
  navigate(direction);
}
