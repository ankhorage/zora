import type { ZoraComponentMeta } from '../../../types/authoring';

/*** Describe the embeddable config-driven Game runtime/presentation boundary for ZORA authoring. */
export const gameMeta = {
  name: 'Game',
  category: 'pattern',
  description:
    'Embeds one config-driven game session inside ordinary ZORA layout and emits domain-neutral game outputs.',
  directManifestNode: true,
  allowedChildren: [
    'GameEntity',
    'GameInputZone',
    'GameMeasurementProbe',
    'GameOverlay',
    'Gradient',
    'Image',
    'View',
  ],
  blueprint: {
    label: 'Game',
    defaultProps: {
      definition: {
        id: 'game',
        initialPhase: 'playing',
        stages: [{ id: 'main' }],
        rules: [],
      },
      seed: 0,
      resetKey: '',
      autoAdvanceTime: true,
      minHeight: 320,
      fill: false,
      clip: true,
    },
  },
  bindings: {
    props: {
      definition: {
        value: { type: 'object' },
        acceptsFallback: true,
      },
      input: {
        value: { type: 'record' },
        acceptsFallback: true,
      },
    },
  },
  events: {
    output: {
      label: 'Game output',
      eventType: 'game.output',
      description: 'Emitted when the platform-neutral game runtime produces an app/domain output.',
      payloadFields: [
        { path: 'type', type: 'string' },
        { path: 'payload', type: 'record' },
      ],
    },
  },
  props: {
    seed: {
      type: 'number',
      category: 'Runtime',
      label: 'Initial seed',
      default: 0,
      authoring: { authority: 'instance' },
    },
    resetKey: {
      type: 'string',
      category: 'Runtime',
      label: 'Reset key',
      default: '',
      authoring: { authority: 'instance' },
    },
    autoAdvanceTime: {
      type: 'boolean',
      category: 'Runtime',
      label: 'Advance scheduled effects',
      default: true,
      authoring: { authority: 'instance' },
    },
    aspectRatio: {
      type: 'number',
      category: 'Layout',
      label: 'Aspect ratio',
      authoring: { authority: 'instance' },
    },
    minHeight: {
      type: 'number',
      category: 'Layout',
      label: 'Minimum height',
      default: 320,
      authoring: { authority: 'instance' },
    },
    fill: {
      type: 'boolean',
      category: 'Layout',
      label: 'Fill available space',
      default: false,
      authoring: { authority: 'instance' },
    },
    clip: {
      type: 'boolean',
      category: 'Layout',
      label: 'Clip overflow',
      default: true,
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
