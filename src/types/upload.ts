import type React from 'react';

import type { ZoraBaseProps } from '../theme/ZoraBaseProps';

export type UploadType = 'image' | 'video' | 'document' | 'file';

export interface UploadAssetBase {
  fileName?: string;
  sizeBytes?: number;
  contentType?: string;
  width?: number;
  height?: number;
  alt?: string;
  createdAt?: string;
}

export type UploadAsset =
  | (UploadAssetBase & {
      kind: 'local';
      uri: string;
    })
  | (UploadAssetBase & {
      kind: 'url';
      url: string;
    })
  | (UploadAssetBase & {
      kind: 'storage';
      storageId?: string;
      bucket: string;
      path: string;
      publicUrl?: string;
    });

export interface UploadProgressContext {
  setProgress: (progress: number | null) => void;
}

export interface ValidateUploadAssetInput {
  asset: UploadAsset;
  accept?: string;
  maxSizeBytes?: number;
  validate?: (asset: UploadAsset) => string | undefined;
}

export interface UploaderProps extends ZoraBaseProps {
  value?: UploadAsset | null;
  onChange?: (next: UploadAsset | null) => void;
  onValueChange?: (next: UploadAsset | null) => void;
  onUploadRequest?: (event: { asset: UploadAsset }) => void;
  onRemoveRequest?: (event: { asset: UploadAsset }) => void;
  onValidationError?: (event: { message: string }) => void;
  uploadState?: 'idle' | 'uploading' | 'removing';
  uploadProgress?: number;
  label?: React.ReactNode;
  description?: React.ReactNode;
  helperText?: React.ReactNode;
  errorText?: React.ReactNode;
  type?: UploadType;
  accept?: string;
  maxSizeBytes?: number;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  validatePicked?: (asset: UploadAsset) => string | undefined;
  onUpload?: (asset: UploadAsset, context: UploadProgressContext) => Promise<UploadAsset>;
  onRemove?: (current: UploadAsset) => void | Promise<void>;
  aspectRatio?: number;
}
