import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { describe, expect, test } from 'bun:test';
import { Window } from 'happy-dom';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import type {
  CardHand as CardHandComponent,
  PokerTrainingTable as PokerTrainingTableComponent,
  TabletopTable as TabletopTableComponent,
} from './public';
import { pokerTrainingTableMeta, tabletopTableMeta } from './meta';
import { createPokerTrainingTableState } from './utils/createPokerTrainingTableState';
import { createTabletopGameSeats } from './utils/createTabletopGameSeats';
import { getTabletopSeatPosition } from './utils/getTabletopSeatPosition';

const webDistRoot = join(import.meta.dir, '../../../web-dist');
const load = (path: string) => import(pathToFileURL(join(webDistRoot, path)).href);

describe('Tabletop presentation', () => {
  test('reconstructs the complete hero-oriented ring without training policy', () => {
    const state = createPokerTrainingTableState({
      tableSize: '6max',
      heroPosition: 'CO',
      heroCards: [{ rank: 'A', suit: 'spades' }],
      blinds: { small: 1, big: 2 },
      pot: 24,
      players: [
        { position: 'CO', stack: 200 },
        { position: 'BTN', folded: true },
      ],
    });
    expect(state.seatCount).toBe(6);
    expect(state.seats.map((seat) => seat.id)).toEqual(['CO', 'BTN', 'SB', 'BB', 'UTG', 'HJ']);
    expect(state.seats[0]).toMatchObject({
      selected: true,
      sublabel: '100 BB',
      cards: [{ rank: 'A', suit: 'spades' }],
    });
    expect(state.seats[2]).toMatchObject({
      disabled: true,
      muted: true,
      sublabel: '100 BB · Folded',
    });
    expect(state.seats[1]?.tokenLabel).toBe('D');
    expect(state.centerLabel).toBe('Pot 24');
    expect(state.centerSublabel).toBe('Blinds 1 / 2');
    expect(state.accessibilityLabel).toContain('Hero CO');
    expect(getTabletopSeatPosition(0, 6)).toEqual({ top: '84%', left: '50%' });
  });

  test('joins ordered seats with participant display overrides', () => {
    expect(
      createTabletopGameSeats({
        seats: [
          { id: 'north', defaultState: { label: 'North' } },
          { id: 'south', defaultState: { label: 'South' } },
        ],
        participants: [{ seatId: 'south', state: { selected: true } }],
      }),
    ).toEqual([
      { id: 'north', label: 'North', disabled: true, muted: true },
      { id: 'south', label: 'South', selected: true },
    ]);
  });

  test('preserves the standalone Tabletop authoring bindings in core metadata', () => {
    expect(Object.keys(tabletopTableMeta.bindings.props)).toEqual([
      'seats',
      'centerCards',
      'centerLabel',
      'centerSublabel',
      'disabled',
    ]);
    expect(pokerTrainingTableMeta.bindings.props.disabled.value.type).toBe('boolean');
  });

  test('renders card sizing, per-card IDs, seat accessibility, and table shapes', async () => {
    const { CardHand } = (await load('components/card-hand/index.js')) as {
      CardHand: typeof CardHandComponent;
    };
    const { TabletopTable } = (await load('components/tabletop-table/index.js')) as {
      TabletopTable: typeof TabletopTableComponent;
    };
    const { PokerTrainingTable } = (await load('components/poker-training-table/index.js')) as {
      PokerTrainingTable: typeof PokerTrainingTableComponent;
    };
    const markup = renderToStaticMarkup(
      <>
        <CardHand
          cards={[{ rank: 'A', suit: 'spades' }]}
          colorScheme={{ cardSurface: '#000000' }}
          faceDownCards={1}
          testID="hand"
        />
        <TabletopTable
          shape="circle"
          seats={[
            { id: 'hero', label: 'Hero', sublabel: '100 BB', selected: true, tokenLabel: 'D' },
          ]}
          testID="table"
        />
        <PokerTrainingTable task={{ tableSize: '6max', heroPosition: 'CO' }} testID="poker" />
      </>,
    );
    const browser = new Window();
    browser.document.body.innerHTML = markup;
    const card = browser.document.querySelector('[data-testid="hand-card-0"]');
    expect(card?.getAttribute('aria-label')).toBe('ace of spades');
    expect(card?.getAttribute('style')).toContain('height:56px');
    expect(card?.getAttribute('style')).toContain('width:40px');
    expect(card?.getAttribute('style')).toContain('background-color:rgba(0,0,0,1.00)');
    expect(card?.textContent).toContain('A');
    expect(card?.firstElementChild.getAttribute('style')).toContain('color:rgba(255,255,255,1.00)');
    expect(
      browser.document.querySelector('[data-testid="hand-hidden-0"]')?.getAttribute('aria-label'),
    ).toBe('Hidden card');
    expect(
      browser.document.querySelector('[data-testid="table-seat-hero"]')?.getAttribute('aria-label'),
    ).toBe('Hero, 100 BB, D, selected');
    expect(browser.document.querySelectorAll('[data-testid^="poker-seat-"]')).toHaveLength(6);
    expect(
      browser.document.querySelector('[data-testid="poker"]')?.getAttribute('aria-label'),
    ).toContain('Six-player poker table');
    const circleTable = browser.document.querySelector('[data-testid="table"]');
    expect(circleTable?.getAttribute('style')).toContain('aspect-ratio:1');
    const circleSurface = circleTable?.firstElementChild.getAttribute('class');
    browser.document.body.innerHTML = renderToStaticMarkup(
      <TabletopTable seats={[]} shape="rounded" testID="table" />,
    );
    const roundedSurface = browser.document
      .querySelector('[data-testid="table"]')
      ?.firstElementChild.getAttribute('class');
    expect(circleSurface).not.toBe(roundedSurface);
    browser.close();
  });
});
