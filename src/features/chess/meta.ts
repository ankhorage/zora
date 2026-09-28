import type { ZoraComponentMeta } from '../../types/authoring';

export const chessBoardMeta = {
  name: 'ChessBoard',
  category: 'component',
  description:
    'Renders caller-owned chess pieces, highlights, and move-attempt interactions without chess rules.',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: {
    label: 'Chess board',
    defaultProps: { pieces: [], orientation: 'white', showCoordinates: true },
  },
  events: {
    squarePress: {
      label: 'Square press',
      eventType: 'chess.squarePress',
      payloadFields: [{ path: 'square', type: 'string', label: 'Square' }],
    },
    moveAttempt: {
      label: 'Move attempt',
      eventType: 'chess.moveAttempt',
      payloadFields: [
        { path: 'from', type: 'string', label: 'From' },
        { path: 'to', type: 'string', label: 'To' },
      ],
    },
  },
  bindings: {
    props: {
      pieces: {
        label: 'Pieces',
        value: { type: 'array', itemType: 'object' },
        acceptsFallback: true,
        acceptsTransforms: true,
      },
      legalTargets: {
        label: 'Legal targets',
        value: { type: 'array', itemType: 'string' },
        acceptsFallback: true,
        acceptsTransforms: true,
      },
    },
  },
  props: {
    pieces: {
      type: 'array',
      category: 'Board',
      label: 'Pieces',
      default: [],
      authoring: { authority: 'instance' },
    },
    orientation: {
      type: 'enum',
      category: 'Board',
      label: 'Orientation',
      enum: ['white', 'black'],
      default: 'white',
      authoring: { authority: 'instance' },
    },
    selectedSquare: {
      type: 'string',
      category: 'Board',
      label: 'Selected square',
      authoring: { authority: 'instance' },
    },
    legalTargets: {
      type: 'array',
      category: 'Board',
      label: 'Legal targets',
      default: [],
      authoring: { authority: 'instance' },
    },
    showCoordinates: {
      type: 'boolean',
      category: 'Style',
      label: 'Show coordinates',
      default: false,
      authoring: { authority: 'instance' },
    },
    disabled: {
      type: 'boolean',
      category: 'State',
      label: 'Disabled',
      default: false,
      authoring: { authority: 'instance' },
    },
  },
} as const satisfies ZoraComponentMeta;
export const openingBookMeta = {
  name: 'OpeningBook',
  category: 'component',
  description:
    'Presents caller-owned opening suggestions and their loading, empty, selected, and press states.',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: {
    label: 'Opening book',
    defaultProps: {
      moves: [],
      title: 'Opening book',
      emptyText: 'No book moves for this position.',
    },
  },
  events: {
    movePress: {
      label: 'Move press',
      eventType: 'chess.openingMovePress',
      payloadFields: [
        { path: 'san', type: 'string', label: 'SAN' },
        { path: 'uci', type: 'string', label: 'UCI' },
        { path: 'fen', type: 'string', label: 'Position' },
      ],
    },
  },
  bindings: {
    props: {
      moves: {
        label: 'Moves',
        value: { type: 'array', itemType: 'object' },
        acceptsFallback: true,
        acceptsTransforms: true,
      },
    },
  },
  props: {
    moves: {
      type: 'array',
      category: 'Content',
      label: 'Moves',
      default: [],
      authoring: { authority: 'instance' },
    },
    title: {
      type: 'string',
      category: 'Content',
      label: 'Title',
      default: 'Opening book',
      authoring: { authority: 'instance' },
    },
    emptyText: {
      type: 'string',
      category: 'Content',
      label: 'Empty text',
      default: 'No book moves for this position.',
      authoring: { authority: 'instance' },
    },
    loading: {
      type: 'boolean',
      category: 'State',
      label: 'Loading',
      default: false,
      authoring: { authority: 'instance' },
    },
    errorText: {
      type: 'string',
      category: 'State',
      label: 'Error text',
      authoring: { authority: 'instance' },
    },
    selectedMove: {
      type: 'string',
      category: 'State',
      label: 'Selected move',
      authoring: { authority: 'instance' },
    },
  },
} as const satisfies ZoraComponentMeta;
