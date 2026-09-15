import type { ZoraComponentMeta } from '../authoring';

export const accordionMeta = {
  name: 'Accordion',
  category: 'component',
  description: 'Groups expandable content items with single or multiple expansion behavior.',
  directManifestNode: true,
  allowedChildren: ['AccordionItem'],
  blueprint: {
    label: 'Accordion',
    defaultProps: { type: 'single', collapsible: true },
  },
  props: {
    type: {
      type: 'enum',
      category: 'Behavior',
      label: 'Expansion mode',
      enum: ['single', 'multiple'],
      default: 'single',
    },
    collapsible: {
      type: 'boolean',
      category: 'Behavior',
      label: 'Collapsible',
      default: true,
    },
    disabled: {
      type: 'boolean',
      category: 'State',
      label: 'Disabled',
      default: false,
    },
  },
} as const satisfies ZoraComponentMeta;
