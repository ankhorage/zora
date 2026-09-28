import React from 'react';
import type { View } from 'react-native';

import { measureGameEntity } from '../adapters/inbound/measureGameEntity';
import { GameRuntimeContext } from '../composition/GameRuntimeContext';

/*** Register one optional measurable GameEntity view inside its local Game scope. */
export function useGameEntityMeasurement(
  elementRef: React.RefObject<View | null>,
  measurementId: string | undefined,
): void {
  const runtime = React.useContext(GameRuntimeContext);
  const registerMeasurement = runtime?.registerMeasurement;

  React.useEffect(() => {
    if (measurementId === undefined || registerMeasurement === undefined) return undefined;
    return registerMeasurement(measurementId, () => measureGameEntity(elementRef.current));
  }, [elementRef, measurementId, registerMeasurement]);
}
