import type React from 'react';

import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';
import type { ZoraImageAsset } from '../image-preview';

export interface ZoraPickedImage {
  uri: string;
  fileName?: string;
  sizeBytes?: number;
  contentType?: string;
  width?: number;
  height?: number;
}

export interface ImageUploadProgressContext {
  setProgress: (progress: number | null) => void;
}

export interface ImageUploadFieldProps extends ZoraBaseProps {
  value: ZoraImageAsset | null;
  onChange: (next: ZoraImageAsset | null) => void;
  label: React.ReactNode;
  description?: React.ReactNode;
  helperText?: React.ReactNode;
  errorText?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  accept?: string;
  maxSizeBytes?: number;
  validatePicked?: (picked: ZoraPickedImage) => string | undefined;
  onPick: () => Promise<ZoraPickedImage | null>;
  onUpload?: (
    picked: ZoraPickedImage,
    context: ImageUploadProgressContext,
  ) => Promise<ZoraImageAsset>;
  onRemove?: (current: ZoraImageAsset) => void | Promise<void>;
  aspectRatio?: number;
  previewTitle?: React.ReactNode;
  previewDescription?: React.ReactNode;
}
