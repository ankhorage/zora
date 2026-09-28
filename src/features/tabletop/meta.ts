import type { ZoraComponentMeta } from '../../types/authoring';

export const cardBackMeta = {
  name: 'CardBack',
  category: 'component',
  description: 'Renders one face-down playing card.',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Public card primitive composed by code-facing tabletop components, not a direct manifest node.',
  blueprint: { label: 'Card back', defaultProps: { size: 'medium' } },
  props: {
    size: {
      type: 'enum',
      category: 'Style',
      label: 'Size',
      enum: ['small', 'medium', 'large'],
      default: 'medium',
      authoring: { authority: 'instance' },
    },
    muted: {
      type: 'boolean',
      category: 'State',
      label: 'Muted',
      default: false,
      authoring: { authority: 'instance' },
    },
  },
} as const satisfies ZoraComponentMeta;
export const cardHandMeta = {
  name: 'CardHand',
  category: 'component',
  description: 'Renders a compact caller-owned card hand.',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Public hand primitive composed by code-facing tabletop components, not a direct manifest node.',
  blueprint: { label: 'Card hand', defaultProps: { cards: [], faceDownCards: 0, size: 'medium' } },
  props: {
    cards: {
      type: 'array',
      category: 'Cards',
      label: 'Cards',
      default: [],
      authoring: { authority: 'instance' },
    },
    faceDownCards: {
      type: 'number',
      category: 'Cards',
      label: 'Face-down cards',
      default: 0,
      authoring: { authority: 'instance' },
    },
    size: {
      type: 'enum',
      category: 'Style',
      label: 'Size',
      enum: ['small', 'medium', 'large'],
      default: 'medium',
      authoring: { authority: 'instance' },
    },
  },
} as const satisfies ZoraComponentMeta;
export const playingCardMeta = {
  name: 'PlayingCard',
  category: 'component',
  description: 'Renders one face-up caller-owned playing card.',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Public card primitive composed by code-facing tabletop components, not a direct manifest node.',
  blueprint: {
    label: 'Playing card',
    defaultProps: { card: { rank: 'A', suit: 'spades' }, size: 'medium' },
  },
  bindings: {
    props: { card: { label: 'Card', value: { type: 'object' }, acceptsFallback: true } },
  },
  props: {
    size: {
      type: 'enum',
      category: 'Style',
      label: 'Size',
      enum: ['small', 'medium', 'large'],
      default: 'medium',
      authoring: { authority: 'instance' },
    },
    selected: {
      type: 'boolean',
      category: 'State',
      label: 'Selected',
      default: false,
      authoring: { authority: 'instance' },
    },
  },
} as const satisfies ZoraComponentMeta;
export const tabletopTableMeta = {
  name: 'TabletopTable',
  category: 'component',
  description:
    'Arranges caller-owned player seats and shared cards around a responsive tabletop surface.',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: {
    label: 'Tabletop table',
    defaultProps: { seats: [], centerCards: [], shape: 'oval', cardSize: 'small' },
  },
  bindings: {
    props: {
      seats: {
        label: 'Seats',
        value: { type: 'array', itemType: 'object' },
        acceptsFallback: true,
        acceptsTransforms: true,
      },
      centerCards: {
        label: 'Center cards',
        value: { type: 'array', itemType: 'object' },
        acceptsFallback: true,
        acceptsTransforms: true,
      },
      centerLabel: {
        label: 'Center label',
        value: { type: 'string' },
        acceptsFallback: true,
        acceptsTransforms: true,
      },
      centerSublabel: {
        label: 'Center sublabel',
        value: { type: 'string' },
        acceptsFallback: true,
        acceptsTransforms: true,
      },
      disabled: {
        label: 'Disabled',
        value: { type: 'boolean' },
        acceptsFallback: true,
        acceptsTransforms: true,
      },
    },
  },
  props: {
    seats: {
      type: 'array',
      category: 'Players',
      label: 'Seats',
      default: [],
      authoring: { authority: 'instance' },
    },
    centerCards: {
      type: 'array',
      category: 'Table',
      label: 'Center cards',
      default: [],
      authoring: { authority: 'instance' },
    },
    centerLabel: {
      type: 'string',
      category: 'Table',
      label: 'Center label',
      authoring: { authority: 'instance' },
    },
    centerSublabel: {
      type: 'string',
      category: 'Table',
      label: 'Center sublabel',
      authoring: { authority: 'instance' },
    },
    shape: {
      type: 'enum',
      category: 'Table',
      label: 'Shape',
      enum: ['circle', 'oval', 'rounded'],
      default: 'oval',
      authoring: { authority: 'instance' },
    },
    seatCount: {
      type: 'enum',
      category: 'Players',
      label: 'Seat count',
      enum: [2, 3, 4, 5, 6, 7, 8, 9, 10],
      authoring: { authority: 'instance' },
    },
    cardSize: {
      type: 'enum',
      category: 'Cards',
      label: 'Card size',
      enum: ['small', 'medium', 'large'],
      default: 'small',
      authoring: { authority: 'instance' },
    },
    disabled: {
      type: 'boolean',
      category: 'State',
      label: 'Disabled',
      default: false,
      authoring: { authority: 'instance' },
    },
    accessibilityLabel: {
      type: 'string',
      category: 'Accessibility',
      label: 'Accessibility label',
      authoring: { authority: 'instance' },
    },
  },
} as const satisfies ZoraComponentMeta;
export const pokerTrainingTableMeta = {
  name: 'PokerTrainingTable',
  category: 'pattern',
  description: 'Maps serializable poker table data into the reusable tabletop presentation.',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: {
    label: 'Poker training table',
    defaultProps: { task: {}, defaultStackBigBlinds: 100, shape: 'oval', cardSize: 'small' },
  },
  bindings: {
    props: {
      task: {
        label: 'Poker training task',
        description: 'Table-relevant fields from a poker training task.',
        value: {
          type: 'object',
          fields: [
            { path: 'blinds', type: 'object', label: 'Blinds' },
            { path: 'heroPosition', type: 'string', label: 'Hero position' },
            { path: 'heroCards', type: 'array', label: 'Hero cards' },
            { path: 'communityCards', type: 'array', label: 'Community cards' },
            { path: 'pot', type: 'number', label: 'Pot' },
            { path: 'players', type: 'array', label: 'Players' },
          ],
        },
        acceptsFallback: true,
      },
      disabled: {
        label: 'Disabled',
        value: { type: 'boolean' },
        acceptsFallback: true,
        acceptsTransforms: true,
      },
    },
  },
  props: {
    defaultStackBigBlinds: {
      type: 'number',
      category: 'Players',
      label: 'Default stack in big blinds',
      default: 100,
      authoring: { authority: 'instance' },
    },
    shape: {
      type: 'enum',
      category: 'Table',
      label: 'Shape',
      enum: ['circle', 'oval', 'rounded'],
      default: 'oval',
      authoring: { authority: 'instance' },
    },
    cardSize: {
      type: 'enum',
      category: 'Cards',
      label: 'Card size',
      enum: ['small', 'medium', 'large'],
      default: 'small',
      authoring: { authority: 'instance' },
    },
    disabled: {
      type: 'boolean',
      category: 'State',
      label: 'Disabled',
      default: false,
      authoring: { authority: 'instance' },
    },
    accessibilityLabel: {
      type: 'string',
      category: 'Accessibility',
      label: 'Accessibility label',
      authoring: { authority: 'instance' },
    },
  },
} as const satisfies ZoraComponentMeta;
