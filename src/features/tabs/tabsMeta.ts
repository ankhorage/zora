import type { ZoraComponentMeta } from '../../types/authoring';
import { LAYOUT_PROPS } from '../layout/constants';

export const tabsMeta = {
  name: 'Tabs',
  category: 'component',
  directManifestNode: true,
  allowedChildren: ['TabList', 'TabPanel'],
  description: 'Owns the active value for an accessible tablist and its panels.',
  events: {
    valueChange: {
      label: 'Value change',
      eventType: 'tabs.valueChange',
      payloadFields: [{ path: 'value', type: 'string', label: 'Value' }],
    },
  },
  bindings: {
    props: {
      value: {
        label: 'Value',
        description: 'Current active tab value.',
        value: { type: 'string' },
        acceptsFallback: true,
        acceptsTransforms: true,
      },
    },
    events: {
      valueChange: {
        label: 'Value change',
        description: 'Runs when the active tab changes.',
        payload: {
          eventType: 'tabs.valueChange',
          fields: [{ path: 'value', type: 'string', label: 'Value' }],
        },
      },
    },
  },
  props: {
    ...LAYOUT_PROPS,
    overflow: { type: 'enum', category: 'Layout', enum: ['visible', 'hidden'] },
    value: { type: 'string', category: 'State', label: 'Value' },
    defaultValue: { type: 'string', category: 'State', label: 'Default value' },
  },
} as const satisfies ZoraComponentMeta;
