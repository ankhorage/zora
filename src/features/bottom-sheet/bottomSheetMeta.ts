import { CONTAINER_ALLOWED_CHILDREN } from '../../metadata/allowedChildren';
import type { ZoraComponentMeta } from '../../metadata/types';

export const bottomSheetMeta = {
  name: 'BottomSheet',
  category: 'layout',
  directManifestNode: true,
  allowedChildren: [...CONTAINER_ALLOWED_CHILDREN],
  description:
    'Controlled presentation through the shared single-sheet host. Bind dismiss to clear open.',
  events: {
    dismiss: { label: 'Dismiss', eventType: 'bottomSheet.dismiss', payloadFields: [] },
    indexChange: {
      label: 'Index change',
      eventType: 'bottomSheet.indexChange',
      payloadFields: [{ path: 'index', type: 'number' }],
    },
  },
  props: {
    open: { type: 'boolean', category: 'State', default: false },
    snapPoints: { type: 'array', category: 'Layout' },
    initialIndex: { type: 'number', category: 'State' },
    enableDynamicSizing: { type: 'boolean', category: 'Layout' },
    enablePanDownToClose: { type: 'boolean', category: 'Behavior' },
    dismissOnBackdropPress: { type: 'boolean', category: 'Behavior' },
    keyboardBehavior: {
      type: 'enum',
      category: 'Behavior',
      enum: ['extend', 'fillParent', 'interactive'],
    },
    keyboardBlurBehavior: { type: 'enum', category: 'Behavior', enum: ['none', 'restore'] },
  },
} as const satisfies ZoraComponentMeta;
