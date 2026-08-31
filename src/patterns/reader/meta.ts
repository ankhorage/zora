import type { ZoraComponentMeta } from '../../metadata';
import { CONTAINER_ALLOWED_CHILDREN } from '../../metadata/allowedChildren';

const EMPTY_EVENT_FIELDS = [] as const;

export const readerSurfaceMeta = {
  name: 'ReaderSurface',
  category: 'pattern',
  description:
    'Adapter-neutral EPUB and PDF reader shell with controlled chrome, progress, and navigation events.',
  directManifestNode: true,
  requirements: {
    capabilities: [{ capability: 'ebookReader' }],
  },
  allowedChildren: [],
  blueprint: {
    label: 'Reader',
    defaultProps: {
      format: 'epub',
      status: 'idle',
      showChrome: true,
      readerColorScheme: 'system',
      fontScale: 1,
      lineHeight: 'normal',
    },
  },
  events: {
    previousPage: {
      label: 'Previous page',
      eventType: 'reader.previousPage',
      description: 'Requests navigation to the previous page.',
      payloadFields: EMPTY_EVENT_FIELDS,
    },
    nextPage: {
      label: 'Next page',
      eventType: 'reader.nextPage',
      description: 'Requests navigation to the next page.',
      payloadFields: EMPTY_EVENT_FIELDS,
    },
    locationChange: {
      label: 'Location change',
      eventType: 'reader.locationChange',
      description: 'Emitted by the adapter after the destination has been displayed.',
      payloadFields: [
        { path: 'format', type: 'string', label: 'Format' },
        { path: 'locator', type: 'string', label: 'Opaque locator' },
        { path: 'page', type: 'number', label: 'Page' },
        { path: 'pageCount', type: 'number', label: 'Page count' },
        { path: 'progression', type: 'number', label: 'Progression' },
        { path: 'chapterId', type: 'string', label: 'Chapter ID' },
        { path: 'chapterTitle', type: 'string', label: 'Chapter title' },
        { path: 'trigger', type: 'string', label: 'Navigation trigger' },
      ],
    },
    openContents: {
      label: 'Open contents',
      eventType: 'reader.openContents',
      description: 'Requests the app-owned table of contents.',
      payloadFields: EMPTY_EVENT_FIELDS,
    },
    openAppearance: {
      label: 'Open appearance',
      eventType: 'reader.openAppearance',
      description: 'Requests the app-owned reader appearance controls.',
      payloadFields: EMPTY_EVENT_FIELDS,
    },
    toggleHighlight: {
      label: 'Toggle highlight',
      eventType: 'reader.toggleHighlight',
      description: 'Requests the app-owned highlight action.',
      payloadFields: EMPTY_EVENT_FIELDS,
    },
    openExternalLink: {
      label: 'Open external link',
      eventType: 'reader.openExternalLink',
      description: 'Emitted when publication content requests an external URL.',
      payloadFields: [{ path: 'url', type: 'string', label: 'URL' }],
    },
    readerError: {
      label: 'Reader error',
      eventType: 'reader.error',
      description: 'Emitted when the adapter rejects or cannot load a document.',
      payloadFields: [
        { path: 'code', type: 'string', label: 'Error code' },
        { path: 'format', type: 'string', label: 'Format' },
        { path: 'message', type: 'string', label: 'Message' },
      ],
    },
  },
  slots: {
    viewport: {
      label: 'Reader viewport adapter',
      allowedChildren: [],
    },
    headerActions: {
      label: 'Header actions',
      allowedChildren: [...CONTAINER_ALLOWED_CHILDREN],
    },
    footerActions: {
      label: 'Footer actions',
      allowedChildren: [...CONTAINER_ALLOWED_CHILDREN],
    },
  },
  props: {
    source: {
      type: 'media',
      category: 'Document',
      label: 'Source',
      mediaKinds: ['file'],
    },
    format: {
      type: 'enum',
      category: 'Document',
      label: 'Format',
      enum: ['epub', 'pdf'],
      default: 'epub',
    },
    location: {
      type: 'string',
      category: 'State',
      label: 'Location',
    },
    status: {
      type: 'enum',
      category: 'State',
      label: 'Status',
      enum: ['idle', 'loading', 'ready', 'error'],
      default: 'idle',
    },
    page: {
      type: 'number',
      category: 'State',
      label: 'Page',
    },
    pageCount: {
      type: 'number',
      category: 'State',
      label: 'Page count',
    },
    progress: {
      type: 'number',
      category: 'State',
      label: 'Progress',
    },
    canGoPrevious: {
      type: 'boolean',
      category: 'State',
      label: 'Can go previous',
    },
    canGoNext: {
      type: 'boolean',
      category: 'State',
      label: 'Can go next',
    },
    title: {
      type: 'string',
      category: 'Content',
      label: 'Title',
    },
    subtitle: {
      type: 'string',
      category: 'Content',
      label: 'Subtitle',
    },
    chapterLabel: {
      type: 'string',
      category: 'Content',
      label: 'Chapter label',
    },
    pageLabel: {
      type: 'string',
      category: 'Content',
      label: 'Page label',
    },
    previousPageLabel: {
      type: 'string',
      category: 'Content',
      label: 'Previous page label',
      default: 'Previous page',
    },
    nextPageLabel: {
      type: 'string',
      category: 'Content',
      label: 'Next page label',
      default: 'Next page',
    },
    contentsLabel: {
      type: 'string',
      category: 'Content',
      label: 'Contents label',
      default: 'Table of contents',
    },
    appearanceLabel: {
      type: 'string',
      category: 'Content',
      label: 'Appearance label',
      default: 'Reading appearance',
    },
    highlightLabel: {
      type: 'string',
      category: 'Content',
      label: 'Highlight label',
      default: 'Toggle highlight',
    },
    loadingLabel: {
      type: 'string',
      category: 'Content',
      label: 'Loading label',
      default: 'Loading document…',
    },
    errorTitle: {
      type: 'string',
      category: 'Content',
      label: 'Error title',
      default: 'Unable to open this document.',
    },
    unavailableTitle: {
      type: 'string',
      category: 'Content',
      label: 'Unavailable title',
      default: 'Reader preview unavailable.',
    },
    showChrome: {
      type: 'boolean',
      category: 'Chrome',
      label: 'Show chrome',
      default: true,
    },
    readerColorScheme: {
      type: 'enum',
      category: 'Appearance',
      label: 'Color scheme',
      enum: ['system', 'light', 'dark', 'sepia'],
      default: 'system',
    },
    fontScale: {
      type: 'number',
      category: 'Appearance',
      label: 'Font scale',
      default: 1,
    },
    lineHeight: {
      type: 'enum',
      category: 'Appearance',
      label: 'Line height',
      enum: ['compact', 'normal', 'relaxed'],
      default: 'normal',
    },
    highlighted: {
      type: 'boolean',
      category: 'State',
      label: 'Highlighted',
      default: false,
    },
    onPreviousPage: {
      type: 'action',
      category: 'Events',
      label: 'Previous page action',
    },
    onNextPage: {
      type: 'action',
      category: 'Events',
      label: 'Next page action',
    },
    onLocationChange: {
      type: 'action',
      category: 'Events',
      label: 'Location change action',
    },
    onOpenContents: {
      type: 'action',
      category: 'Events',
      label: 'Open contents action',
    },
    onOpenAppearance: {
      type: 'action',
      category: 'Events',
      label: 'Open appearance action',
    },
    onToggleHighlight: {
      type: 'action',
      category: 'Events',
      label: 'Toggle highlight action',
    },
    onOpenExternalLink: {
      type: 'action',
      category: 'Events',
      label: 'Open external link action',
    },
    onReaderError: {
      type: 'action',
      category: 'Events',
      label: 'Reader error action',
    },
  },
} as const satisfies ZoraComponentMeta;
