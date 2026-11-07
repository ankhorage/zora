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
    defaultProps: {
      columns: 8,
      pieces: [],
      orientation: 'white',
      rows: 8,
      showCoordinates: true,
    },
  },
  events: {
    cellPress: {
      label: 'Cell press',
      eventType: 'chess.cellPress',
      payloadFields: [
        { path: 'column', type: 'number', label: 'Column' },
        { path: 'row', type: 'number', label: 'Row' },
      ],
    },
    moveAttempt: {
      label: 'Move attempt',
      eventType: 'chess.moveAttempt',
      payloadFields: [
        { path: 'from.column', type: 'number', label: 'From column' },
        { path: 'from.row', type: 'number', label: 'From row' },
        { path: 'to.column', type: 'number', label: 'To column' },
        { path: 'to.row', type: 'number', label: 'To row' },
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
      selectedCell: {
        label: 'Selected cell',
        value: {
          type: 'object',
          fields: [
            { path: 'column', type: 'number', label: 'Column' },
            { path: 'row', type: 'number', label: 'Row' },
          ],
        },
        acceptsFallback: true,
        acceptsTransforms: true,
      },
      legalTargets: {
        label: 'Legal targets',
        value: {
          type: 'array',
          itemType: 'object',
          fields: [
            { path: '[].column', type: 'number', label: 'Column' },
            { path: '[].row', type: 'number', label: 'Row' },
          ],
        },
        acceptsFallback: true,
        acceptsTransforms: true,
      },
    },
  },
  props: {
    columns: {
      type: 'number',
      category: 'Board',
      label: 'Columns',
      default: 8,
      authoring: { authority: 'instance' },
    },
    rows: {
      type: 'number',
      category: 'Board',
      label: 'Rows',
      default: 8,
      authoring: { authority: 'instance' },
    },
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
    selectedCell: {
      type: 'object',
      category: 'Board',
      label: 'Selected cell',
      itemSchema: [
        { key: 'column', schema: { type: 'number', category: 'Cell' } },
        { key: 'row', schema: { type: 'number', category: 'Cell' } },
      ],
      authoring: { authority: 'instance' },
    },
    legalTargets: {
      type: 'array',
      category: 'Board',
      label: 'Legal targets',
      default: [],
      itemSchema: [
        { key: 'column', schema: { type: 'number', category: 'Cell' } },
        { key: 'row', schema: { type: 'number', category: 'Cell' } },
      ],
      authoring: { authority: 'instance' },
    },
    showCoordinates: {
      type: 'boolean',
      category: 'Style',
      label: 'Show coordinates',
      default: false,
      authoring: { authority: 'instance' },
    },
    resizable: {
      type: 'boolean',
      category: 'Behavior',
      label: 'Resizable',
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
