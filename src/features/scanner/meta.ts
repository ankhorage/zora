import type { ZoraComponentMeta } from '../../metadata';
import { CONTAINER_ALLOWED_CHILDREN } from '../../metadata/allowedChildren';

export const scanOverlayMeta = {
  name: 'ScanOverlay',
  category: 'pattern',
  description: 'Camera-agnostic scan frame overlay for barcode and QR scanning flows.',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: {
    label: 'Scan overlay',
    defaultProps: {
      title: 'Align the barcode',
      description: 'Hold the barcode inside the frame. Scanning starts automatically.',
      cornerLabel: 'SCAN',
    },
  },
  props: {
    title: {
      type: 'string',
      category: 'Content',
      label: 'Title',
      default: 'Align the barcode',
    },
    description: {
      type: 'string',
      category: 'Content',
      label: 'Description',
      default: 'Hold the barcode inside the frame. Scanning starts automatically.',
    },
    cornerLabel: {
      type: 'string',
      category: 'Content',
      label: 'Corner label',
      default: 'SCAN',
    },
  },
} as const satisfies ZoraComponentMeta;

export const cameraPermissionViewMeta = {
  name: 'CameraPermissionView',
  category: 'pattern',
  description: 'ZORA-owned camera permission state for scanner flows.',
  directManifestNode: true,
  allowedChildren: [],
  requirements: {
    permissions: [{ permission: 'camera' }],
  },
  blueprint: {
    label: 'Camera permission',
    defaultProps: {
      status: 'unknown',
      requestLabel: 'Allow camera access',
      manualEntryLabel: 'Enter barcode manually',
    },
  },
  props: {
    status: {
      type: 'enum',
      category: 'State',
      label: 'Permission status',
      enum: ['unknown', 'requesting', 'denied'],
      default: 'unknown',
    },
    title: {
      type: 'string',
      category: 'Content',
      label: 'Title',
    },
    description: {
      type: 'string',
      category: 'Content',
      label: 'Description',
    },
    requestLabel: {
      type: 'string',
      category: 'Content',
      label: 'Request label',
      default: 'Allow camera access',
    },
    deniedLabel: {
      type: 'string',
      category: 'Content',
      label: 'Denied label',
      default: 'Open settings',
    },
    manualEntryLabel: {
      type: 'string',
      category: 'Content',
      label: 'Manual entry label',
      default: 'Enter barcode manually',
    },
    onRequestPermission: {
      type: 'action',
      category: 'Events',
      label: 'Request permission action',
    },
    onManualEntry: {
      type: 'action',
      category: 'Events',
      label: 'Manual entry action',
    },
  },
} as const satisfies ZoraComponentMeta;

export const barcodeScannerViewMeta = {
  name: 'BarcodeScannerView',
  category: 'pattern',
  description:
    'Composed scanner shell with permission, camera slot, scan overlay, and manual entry affordance.',
  directManifestNode: true,
  allowedChildren: [...CONTAINER_ALLOWED_CHILDREN],
  requirements: {
    permissions: [{ permission: 'camera' }],
    capabilities: [{ capability: 'barcodeScanner' }],
  },
  blueprint: {
    label: 'Barcode scanner',
    defaultProps: {
      permissionStatus: 'unknown',
      title: 'Scan barcode',
      description: 'Point the camera at a barcode to continue.',
    },
  },
  events: {
    onBarcodeScanned: {
      label: 'Barcode scanned',
      eventType: 'scan',
      description: 'Emitted by the app camera adapter after a barcode has been scanned.',
      payloadFields: [
        { path: 'value', type: 'string', label: 'Barcode value' },
        { path: 'type', type: 'string', label: 'Barcode type' },
      ],
    },
  },
  slots: {
    camera: {
      label: 'Camera adapter',
      allowedChildren: [],
    },
    children: {
      label: 'Scanner footer',
      allowedChildren: [...CONTAINER_ALLOWED_CHILDREN],
    },
  },
  props: {
    permissionStatus: {
      type: 'enum',
      category: 'State',
      label: 'Permission status',
      enum: ['unknown', 'requesting', 'granted', 'denied'],
      default: 'unknown',
    },
    title: {
      type: 'string',
      category: 'Content',
      label: 'Title',
      default: 'Scan barcode',
    },
    description: {
      type: 'string',
      category: 'Content',
      label: 'Description',
      default: 'Point the camera at a barcode to continue.',
    },
    overlayTitle: {
      type: 'string',
      category: 'Content',
      label: 'Overlay title',
    },
    overlayDescription: {
      type: 'string',
      category: 'Content',
      label: 'Overlay description',
    },
    requestPermissionLabel: {
      type: 'string',
      category: 'Content',
      label: 'Request permission label',
    },
    manualEntryLabel: {
      type: 'string',
      category: 'Content',
      label: 'Manual entry label',
    },
    onRequestPermission: {
      type: 'action',
      category: 'Events',
      label: 'Request permission action',
    },
    onManualEntry: {
      type: 'action',
      category: 'Events',
      label: 'Manual entry action',
    },
  },
} as const satisfies ZoraComponentMeta;
