import type { GameSession } from '@ankhorage/game';

/*** Create the canonical Runtime context namespace for one local game session. */
export function createGameBindingContext(session: GameSession): Record<string, unknown> {
  return {
    game: {
      entities: Object.values(session.entities),
      session,
    },
  };
}
