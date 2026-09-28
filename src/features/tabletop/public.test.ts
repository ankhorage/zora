import { describe, expect, test } from 'bun:test';

import type { PokerTrainingTableProps, TabletopTableProps } from '../..';

describe('Tabletop public contract', () => {
  test('publishes generic table and poker-training presentation inputs through the package root', () => {
    const table: TabletopTableProps = {
      centerCards: [{ rank: 'A', suit: 'spades' }],
      seats: [{ id: 'hero', label: 'Hero', selected: true }],
    };
    const poker: PokerTrainingTableProps = {
      task: {
        communityCards: [{ rank: 'A', suit: 'spades' }],
        heroCards: [{ rank: 'K', suit: 'hearts' }],
        players: [{ isHero: true, position: 'BTN' }],
      },
    };

    expect(() => JSON.stringify(table)).not.toThrow();
    expect(() => JSON.stringify(poker)).not.toThrow();
  });

  test('keeps training policy outside the tabletop presentation implementation', async () => {
    const source = await Bun.file('src/features/tabletop/adapters/inbound/Tabletop.tsx').text();

    expect(source).not.toContain('fetch(');
    expect(source).not.toContain('AsyncStorage');
    expect(source).toContain('PokerTrainingTable');
    expect(source).toContain('TabletopTable');
  });
});
