import type { GameEvent, GameOutput, GameSession } from '@ankhorage/game';
import type { InteractionPolicy } from '@ankhorage/surface';

export interface GameMeasurementBounds {
  readonly left: number;
  readonly right: number;
  readonly top: number;
  readonly bottom: number;
  readonly width: number;
  readonly height: number;
}

export type GameMeasurementReader = () => Promise<GameMeasurementBounds | undefined>;

export interface GameMeasurementRegistry {
  readonly registerMeasurement: (id: string, reader: GameMeasurementReader) => () => void;
  readonly measure: (id: string) => Promise<GameMeasurementBounds | undefined>;
}

export interface GameRuntimeValue {
  readonly session: GameSession;
  readonly dispatch: (event: GameEvent) => void;
}

export interface GameRuntimeContextValue extends GameRuntimeValue, GameMeasurementRegistry {
  readonly interactionPolicy?: InteractionPolicy;
}

export interface GameRuntimeState {
  readonly key: string;
  readonly session: GameSession;
  readonly outputs: readonly GameOutput[];
  readonly revision: number;
}
