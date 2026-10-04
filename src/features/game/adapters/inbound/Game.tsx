import { RuntimeRendererConfigProvider } from '@ankhorage/runtime';
import React from 'react';

import type { GameProps } from '../../../../types/gamePresentation';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { createGameBindingContext } from '../../composition/createGameBindingContext';
import { createGameMeasurementRegistry } from '../../composition/createGameMeasurementRegistry';
import { GameRuntimeContext } from '../../composition/GameRuntimeContext';
import { useGameRuntime } from '../../composition/useGameRuntime';
import { GameField } from './GameField';

/*** Bind one serializable game definition to a local transient session and presentation field. */
export const Game = withZoraThemeScope(GameInner);

/*** Render the game session inside the inherited ZORA theme scope. */
function GameInner(props: GameProps) {
  const runtime = useGameRuntime(props);
  const [measurementRegistry] = React.useState(createGameMeasurementRegistry);
  const runtimeContext = React.useMemo(
    () => ({ ...runtime, ...measurementRegistry, interactionPolicy: props.interactionPolicy }),
    [measurementRegistry, props.interactionPolicy, runtime],
  );
  const runtimeBindingConfig = React.useMemo(
    () => ({ bindingContext: createGameBindingContext(runtime.session) }),
    [runtime.session],
  );

  return (
    <GameRuntimeContext.Provider value={runtimeContext}>
      <RuntimeRendererConfigProvider value={runtimeBindingConfig}>
        <GameField
          {...(props.aspectRatio === undefined ? {} : { aspectRatio: props.aspectRatio })}
          {...(props.minHeight === undefined ? {} : { minHeight: props.minHeight })}
          {...(props.fill === undefined ? {} : { fill: props.fill })}
          {...(props.clip === undefined ? {} : { clip: props.clip })}
          {...(props.accessibilityLabel === undefined
            ? {}
            : { accessibilityLabel: props.accessibilityLabel })}
          {...(props.testID === undefined ? {} : { testID: props.testID })}
          interactionPolicy={props.interactionPolicy}
        >
          {props.children}
        </GameField>
      </RuntimeRendererConfigProvider>
    </GameRuntimeContext.Provider>
  );
}
