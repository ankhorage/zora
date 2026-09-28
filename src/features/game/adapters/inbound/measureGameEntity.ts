import type { View } from 'react-native';

import type { GameMeasurementBounds } from '../../../../types/gameRuntime';

/*** Measure one rendered React Native or React Native Web game entity in window coordinates. */
export function measureGameEntity(
  element: View | null,
): Promise<GameMeasurementBounds | undefined> {
  if (element === null) return Promise.resolve(undefined);

  return new Promise((resolve) => {
    element.measureInWindow((left, top, width, height) => {
      if (![left, top, width, height].every(Number.isFinite) || width < 0 || height < 0) {
        resolve(undefined);
        return;
      }

      resolve({
        left,
        right: left + width,
        top,
        bottom: top + height,
        width,
        height,
      });
    });
  });
}
