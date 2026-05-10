import type React from 'react';

import type { ImageFit } from '../../components/image';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface ZoraImageMetadata {
  fileName?: string;
  sizeBytes?: number;
  createdAt?: string;
}

export type ZoraImageAsset =
  | {
      kind: 'url';
      url: string;
      alt?: string;
      width?: number;
      height?: number;
      contentType?: string;
      metadata?: ZoraImageMetadata;
    }
  | {
      kind: 'storage';
      storageId?: string;
      bucket: string;
      path: string;
      publicUrl?: string;
      alt?: string;
      width?: number;
      height?: number;
      contentType?: string;
      metadata?: ZoraImageMetadata;
    };

export interface ImagePreviewProps extends ZoraBaseProps {
  asset?: ZoraImageAsset | null;
  aspectRatio?: number;
  fit?: ImageFit;
  emptyTitle?: React.ReactNode;
  emptyDescription?: React.ReactNode;
}
