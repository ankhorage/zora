import type { Capability } from '@ankhorage/contracts/capability';

import { createEventCapabilities } from '../features/registry/createEventCapabilities';

export const CAPABILITIES = [
  {
    id: 'zora.create',
    owner: '@ankhorage/zora',
    access: ['invoke'],
    binding: {
      kind: 'action',
      bindableAs: ['target'],
    },
    label: 'Materialize ZORA web component',
    description: 'Materialize a declared ZORA component and reconcile its web runtime.',
    input: {
      schema: {
        type: 'object',
        required: ['component', 'platform'],
        properties: {
          component: { type: 'string' },
          platform: { type: 'string', const: 'web' },
        },
        additionalProperties: false,
      },
    },
    output: {
      schema: {
        type: 'object',
        required: ['exitCode'],
        properties: { exitCode: { type: 'integer' } },
        additionalProperties: false,
      },
    },
  },
  {
    id: 'zora.sync',
    owner: '@ankhorage/zora',
    access: ['invoke'],
    binding: {
      kind: 'action',
      bindableAs: ['target'],
    },
    label: 'Synchronize ZORA web components',
    description: 'Reconcile the web runtime from the declared ZORA component set.',
    input: {
      schema: {
        type: 'object',
        required: ['platform'],
        properties: {
          platform: { type: 'string', const: 'web' },
        },
        additionalProperties: false,
      },
    },
    output: {
      schema: {
        type: 'object',
        required: ['exitCode'],
        properties: { exitCode: { type: 'integer' } },
        additionalProperties: false,
      },
    },
  },
  ...createEventCapabilities(),
] satisfies readonly Capability[];
