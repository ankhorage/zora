import type React from 'react';

import type { ZoraBaseProps } from './base';

export type PlayingCardSuit = 'clubs' | 'diamonds' | 'hearts' | 'spades';
export type TabletopCardSize = 'large' | 'medium' | 'small';
export type TabletopShape = 'circle' | 'oval' | 'rounded';
export type TabletopSeatCount = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface PlayingCardValue {
  readonly rank: string;
  readonly suit: PlayingCardSuit;
}
export interface TabletopSeatState {
  readonly id: string;
  readonly label: React.ReactNode;
  readonly sublabel?: React.ReactNode;
  readonly cards?: readonly PlayingCardValue[];
  readonly faceDownCards?: number;
  readonly selected?: boolean;
  readonly muted?: boolean;
  readonly disabled?: boolean;
  readonly tokenLabel?: React.ReactNode;
  readonly accessibilityLabel?: string;
}
export type TabletopGameSeatPresentation = Omit<TabletopSeatState, 'id'>;
export interface TabletopGameSeatDefinition {
  readonly id: string;
  readonly defaultState: TabletopGameSeatPresentation;
}
export interface TabletopGameParticipantState {
  readonly seatId: string;
  readonly state: Partial<TabletopGameSeatPresentation>;
}
export interface CreateTabletopGameSeatsInput {
  readonly seats: readonly TabletopGameSeatDefinition[];
  readonly participants: readonly TabletopGameParticipantState[];
  readonly missingParticipantState?: Partial<TabletopGameSeatPresentation>;
}
export interface TabletopColorScheme {
  readonly cardBack: string;
  readonly cardBackBorder: string;
  readonly cardBorder: string;
  readonly cardSurface: string;
  readonly cardText: string;
  readonly mutedText: string;
  readonly redSuitText: string;
  readonly seatBorder: string;
  readonly seatMutedText: string;
  readonly seatSelectedBorder: string;
  readonly seatSurface: string;
  readonly seatText: string;
  readonly tableBorder: string;
  readonly tableFelt: string;
  readonly tableInnerBorder: string;
  readonly tableMutedText: string;
  readonly tableText: string;
  readonly tokenSurface: string;
  readonly tokenText: string;
}
export type TabletopColorOverrides = Partial<TabletopColorScheme>;
export interface CardBackProps extends ZoraBaseProps {
  readonly size?: TabletopCardSize;
  readonly muted?: boolean;
  readonly accessibilityLabel?: string;
  readonly colorScheme?: TabletopColorOverrides;
}
export interface CardHandProps extends ZoraBaseProps {
  readonly cards?: readonly PlayingCardValue[];
  readonly faceDownCards?: number;
  readonly size?: TabletopCardSize;
  readonly muted?: boolean;
  readonly colorScheme?: TabletopColorOverrides;
  readonly accessibilityLabel?: string;
}
export interface PlayingCardProps extends ZoraBaseProps {
  readonly card: PlayingCardValue;
  readonly size?: TabletopCardSize;
  readonly selected?: boolean;
  readonly muted?: boolean;
  readonly accessibilityLabel?: string;
  readonly colorScheme?: TabletopColorOverrides;
}
export interface TabletopTableProps extends ZoraBaseProps {
  readonly seats: readonly TabletopSeatState[];
  readonly centerCards?: readonly PlayingCardValue[];
  readonly centerLabel?: React.ReactNode;
  readonly centerSublabel?: React.ReactNode;
  readonly shape?: TabletopShape;
  readonly seatCount?: TabletopSeatCount;
  readonly cardSize?: TabletopCardSize;
  readonly disabled?: boolean;
  readonly colorScheme?: TabletopColorOverrides;
  readonly accessibilityLabel?: string;
}
export interface PokerTrainingPlayer {
  readonly position: string;
  readonly stack?: number;
  readonly bet?: number;
  readonly cards?: readonly PlayingCardValue[];
  readonly folded?: boolean;
  readonly isHero?: boolean;
}
export type PokerTrainingTableSize = '6max' | '9max';
export interface PokerTrainingTaskTableData {
  readonly tableSize?: PokerTrainingTableSize;
  readonly blinds?: { readonly small: number; readonly big: number };
  readonly heroPosition?: string;
  readonly heroCards?: readonly PlayingCardValue[];
  readonly communityCards?: readonly PlayingCardValue[];
  readonly pot?: number;
  readonly players?: readonly PokerTrainingPlayer[];
}
export interface PokerTrainingTableProps extends Omit<
  TabletopTableProps,
  'seatCount' | 'seats' | 'centerCards' | 'centerLabel' | 'centerSublabel'
> {
  readonly task?: PokerTrainingTaskTableData;
  readonly defaultStackBigBlinds?: number;
}
export interface CreatePokerTrainingTableStateOptions {
  readonly defaultStackBigBlinds?: number;
}
export interface PokerTrainingTableState {
  readonly seatCount: TabletopSeatCount;
  readonly seats: readonly TabletopSeatState[];
  readonly centerCards: readonly PlayingCardValue[];
  readonly centerLabel?: string;
  readonly centerSublabel?: string;
  readonly accessibilityLabel: string;
}
