import { clampGamePercentage } from './clampGamePercentage';

/*** Convert one game percentage coordinate to React Native percentage style syntax. */
export function toGamePercentage(value: number): `${number}%` {
  return `${clampGamePercentage(value)}%`;
}
