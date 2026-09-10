import type { ZoraComponentMeta } from '../../metadata/types';

export const uploaderMeta = {
  name: 'Uploader',
  category: 'pattern',
  directManifestNode: true,
  allowedChildren: [],
  description:
    'Selects files with Expo pickers; bind upload and removal requests to application actions.',
  bindings: {
    props: {
      value: {
        value: {
          type: 'object',
          fields: [
            { path: 'kind', type: 'string' },
            { path: 'uri', type: 'string' },
            { path: 'url', type: 'string' },
            { path: 'fileName', type: 'string' },
            { path: 'contentType', type: 'string' },
            { path: 'sizeBytes', type: 'number' },
            { path: 'bucket', type: 'string' },
            { path: 'path', type: 'string' },
            { path: 'publicUrl', type: 'string' },
          ],
        },
        acceptsFallback: true,
      },
    },
  },
  events: {
    valueChange: {
      label: 'Value change',
      eventType: 'uploader.valueChange',
      payloadFields: [{ path: 'value', type: 'object' }],
    },
    uploadRequest: {
      label: 'Upload request',
      eventType: 'uploader.uploadRequest',
      payloadFields: [{ path: 'asset', type: 'object' }],
    },
    removeRequest: {
      label: 'Remove request',
      eventType: 'uploader.removeRequest',
      payloadFields: [{ path: 'asset', type: 'object' }],
    },
    validationError: {
      label: 'Validation error',
      eventType: 'uploader.validationError',
      payloadFields: [{ path: 'message', type: 'string' }],
    },
  },
  props: {
    type: { type: 'enum', category: 'Selection', enum: ['image', 'video', 'document', 'file'] },
    accept: { type: 'string', category: 'Validation' },
    maxSizeBytes: { type: 'number', category: 'Validation' },
    required: { type: 'boolean', category: 'Validation' },
    disabled: { type: 'boolean', category: 'State' },
    readOnly: { type: 'boolean', category: 'State' },
    label: { type: 'string', category: 'Content' },
    description: { type: 'string', category: 'Content' },
    helperText: { type: 'string', category: 'Content' },
    errorText: { type: 'string', category: 'State' },
    uploadState: { type: 'enum', category: 'State', enum: ['idle', 'uploading', 'removing'] },
    uploadProgress: { type: 'number', category: 'State' },
    aspectRatio: { type: 'number', category: 'Layout' },
  },
} as const satisfies ZoraComponentMeta;
