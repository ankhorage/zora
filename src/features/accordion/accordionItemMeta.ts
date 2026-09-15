import type { ZoraComponentMeta } from '../authoring';
import { CONTAINER_ALLOWED_CHILDREN } from '../authoring/allowedChildren';

export const accordionItemMeta = {
  name: 'AccordionItem',
  category: 'component',
  description: 'One expandable accordion item with authored content and optional actions.',
  directManifestNode: true,
  allowedChildren: [...CONTAINER_ALLOWED_CHILDREN],
  blueprint: {
    label: 'Accordion item',
    defaultProps: { value: 'item', title: 'Accordion item' },
  },
  slots: {
    actions: {
      label: 'Actions',
      allowedChildren: ['Button', 'ButtonGroup', 'IconButton'],
    },
  },
  props: {
    value: {
      type: 'string',
      category: 'Behavior',
      label: 'Value',
      authoring: { authority: 'instance' },
    },
    title: {
      type: 'string',
      category: 'Content',
      label: 'Title',
      authoring: { authority: 'instance' },
    },
    description: {
      type: 'string',
      category: 'Content',
      label: 'Description',
      authoring: { authority: 'instance' },
    },
    disabled: {
      type: 'boolean',
      category: 'State',
      label: 'Disabled',
      default: false,
    },
  },
} as const satisfies ZoraComponentMeta;
