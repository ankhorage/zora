import type { ZoraComponentMeta } from '../../metadata';

const instanceAuthoring = { authority: 'instance' } as const;

export const missingElementMeta = {
  name: 'MissingElement',
  category: 'pattern',
  description:
    'Draft-only marker for an unresolved semantic ZORA capability that must be replaced before release.',
  directManifestNode: true,
  allowedChildren: [],
  manifestPolicy: {
    kind: 'unresolved-element',
    availability: 'draft-only',
    releaseGate: 'blocked',
  },
  blueprint: {
    label: 'Missing element',
    defaultProps: {
      requestedCapability: 'Unresolved interface capability',
      reason: 'No matching ZORA element is available.',
      minimumWidth: 240,
      minimumHeight: 160,
    },
  },
  props: {
    requestedCapability: {
      type: 'string',
      category: 'Gap',
      label: 'Requested capability',
      default: 'Unresolved interface capability',
      authoring: instanceAuthoring,
    },
    reason: {
      type: 'string',
      category: 'Gap',
      label: 'Reason',
      default: 'No matching ZORA element is available.',
      authoring: instanceAuthoring,
    },
    evidenceId: {
      type: 'string',
      category: 'Evidence',
      label: 'Evidence ID',
      authoring: instanceAuthoring,
    },
    minimumWidth: {
      type: 'number',
      category: 'Layout',
      label: 'Minimum width',
      default: 240,
      authoring: instanceAuthoring,
    },
    minimumHeight: {
      type: 'number',
      category: 'Layout',
      label: 'Minimum height',
      default: 160,
      authoring: instanceAuthoring,
    },
  },
} as const satisfies ZoraComponentMeta;
