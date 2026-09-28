import type { CreateTabletopGameSeatsInput, TabletopSeatState } from '../../../types/tabletop';

/***
 * Joins an ordered game layout with the participant states currently present in a scene.
 *
 * Missing participants retain their seat definition and receive the configured fallback state,
 * which lets card games represent folded, eliminated, disconnected, or otherwise inactive seats
 * without embedding those game rules in the tabletop renderer.
 *
 * @param input - Ordered seats, participant overrides, and the fallback for missing participants.
 * @returns Normalized tabletop seats in the same order as the supplied seat definitions.
 */
export function createTabletopGameSeats({
  seats,
  participants,
  missingParticipantState = { disabled: true, muted: true },
}: CreateTabletopGameSeatsInput): readonly TabletopSeatState[] {
  const participantsBySeat = new Map(
    participants.map((participant) => [participant.seatId, participant] as const),
  );

  return seats.map((seat) => {
    const participant = participantsBySeat.get(seat.id);

    return {
      id: seat.id,
      ...seat.defaultState,
      ...(participant === undefined ? missingParticipantState : participant.state),
    };
  });
}
