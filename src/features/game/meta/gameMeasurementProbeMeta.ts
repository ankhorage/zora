import type { ZoraComponentMeta } from '../../../types/authoring';

/*** Describe a non-visual source/target geometry sampling adapter for one Game instance. */
export const gameMeasurementProbeMeta = {
  name: 'GameMeasurementProbe',
  category: 'component',
  description:
    'Measures two registered game entities and reports their raw rendered bounds through a generic Game event.',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: {
    label: 'Game measurement probe',
    defaultProps: {
      sourceId: 'source',
      targetId: 'target',
      eventType: 'game.measurement',
      delayMs: 0,
      enabled: true,
    },
  },
  bindings: {
    props: {
      sourceId: { value: { type: 'string' }, acceptsFallback: true },
      targetId: { value: { type: 'string' }, acceptsFallback: true },
      eventType: { value: { type: 'string' }, acceptsFallback: true },
      entityId: { value: { type: 'string' }, acceptsFallback: true },
      delayMs: { value: { type: 'number' }, acceptsFallback: true },
      enabled: { value: { type: 'boolean' }, acceptsFallback: true },
    },
  },
  props: {
    sourceId: {
      type: 'string',
      category: 'Measurement',
      label: 'Source id',
      authoring: { authority: 'instance' },
    },
    targetId: {
      type: 'string',
      category: 'Measurement',
      label: 'Target id',
      authoring: { authority: 'instance' },
    },
    eventType: {
      type: 'string',
      category: 'Measurement',
      label: 'Event type',
      default: 'game.measurement',
      authoring: { authority: 'instance' },
    },
    entityId: {
      type: 'string',
      category: 'Measurement',
      label: 'Game entity id',
      authoring: { authority: 'instance' },
    },
    delayMs: {
      type: 'number',
      category: 'Measurement',
      label: 'Delay (ms)',
      default: 0,
      authoring: { authority: 'instance' },
    },
    enabled: {
      type: 'boolean',
      category: 'State',
      label: 'Enabled',
      default: true,
      authoring: { authority: 'instance' },
    },
  },
} as const satisfies ZoraComponentMeta;
