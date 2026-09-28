import {
  Game,
  GameEntity,
  GameInputZone,
  GameMeasurementProbe,
  GameOverlay,
  Text,
  ZoraProvider,
  type ZoraTheme,
} from '@ankhorage/zora';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const theme: ZoraTheme = {
  id: 'zora-game-expo-acceptance',
  name: 'ZORA Game Expo acceptance',
  appCategory: 'games',
  primaryColor: '#2563eb',
  harmony: 'analogous',
};

const definition = {
  id: 'expo-acceptance',
  initialPhase: 'playing',
  initialState: { measurementCount: 0 },
  stages: [{ id: 'main' }],
  rules: [
    {
      id: 'accept-measurement',
      event: 'geometry.sample',
      effects: [
        {
          kind: 'increment',
          path: 'measurementCount',
          value: { kind: 'literal', value: 1 },
        },
      ],
    },
  ],
} as const;

/***
 * Exercise core ZORA Game presentation, input, motion, and measurement on Expo.
 *
 * @usage
 */
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ZoraProvider initialMode="light" theme={theme}>
        <Game
          definition={definition}
          fill
          minHeight={360}
          accessibilityLabel="Game acceptance field"
        >
          <GameEntity
            x={20}
            y={28}
            measurementId="moving-orb"
            motionOffsetX={42}
            motionDurationMs={900}
            motionEasing="ease-in-out"
            motionRepeat
            motionAlternate
            transitionDurationMs={80}
          >
            <Text>●</Text>
          </GameEntity>
          <GameEntity x={62} y={64} measurementId="target">
            <Text>◆</Text>
          </GameEntity>
          <GameMeasurementProbe
            sourceId="moving-orb"
            targetId="target"
            eventType="geometry.sample"
            delayMs={50}
          />
          <GameInputZone
            eventType="game.pointer"
            x={0}
            y={70}
            width={100}
            height={30}
            keyboardBindings={[
              { key: 'ArrowLeft', eventType: 'game.left', preventDefault: true },
              { key: 'ArrowRight', eventType: 'game.right', preventDefault: true },
            ]}
          />
          <GameOverlay placement="top" padding={12}>
            <Text>Expo 57 · RN · RN Web</Text>
          </GameOverlay>
        </Game>
      </ZoraProvider>
    </GestureHandlerRootView>
  );
}
