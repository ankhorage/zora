import type { ZoraComponentMeta } from '../../metadata/types';

export const CONTENT_RAIL_SPACING_VALUES = ['none', 'xs', 's', 'm', 'l', 'xl'] as const;

export const LAYOUT_PROPS = {
  p: { type: 'spacing', category: 'Spacing' },
  px: { type: 'spacing', category: 'Spacing' },
  py: { type: 'spacing', category: 'Spacing' },
  pt: { type: 'spacing', category: 'Spacing' },
  pb: { type: 'spacing', category: 'Spacing' },
  m: { type: 'spacing', category: 'Spacing' },
  width: { type: 'number', category: 'Layout' },
  height: { type: 'number', category: 'Layout' },
  minWidth: { type: 'number', category: 'Layout' },
  maxWidth: { type: 'number', category: 'Layout' },
  minHeight: { type: 'number', category: 'Layout' },
  maxHeight: { type: 'number', category: 'Layout' },
  flex: { type: 'number', category: 'Layout' },
  radius: { type: 'radius', category: 'Style' },
  accessibilityLabel: { type: 'string', category: 'Accessibility' },
} as const satisfies ZoraComponentMeta['props'];
