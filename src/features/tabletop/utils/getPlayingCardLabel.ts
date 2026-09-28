import type { PlayingCardValue } from '../../../types/tabletop';

const rankLabels: Readonly<Record<string, string>> = { A: 'ace', J: 'jack', K: 'king', Q: 'queen' };

/*** Gives a face-up card a spoken rank and suit. */
export function getPlayingCardLabel(card: PlayingCardValue): string {
  return `${rankLabels[card.rank] ?? card.rank} of ${card.suit}`;
}
