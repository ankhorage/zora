import type { UploadAsset } from './upload';
import type { ZoraBaseProps } from './base';

/** Portable catalogue row. Providers retain permissions, pagination and storage objects. */
export type ExplorerItemKind = 'image' | 'video' | 'audio' | 'document' | 'file' | 'folder';

export interface ExplorerItem {
  readonly id: string;
  readonly kind: ExplorerItemKind;
  readonly name: string;
  readonly thumbnailUri?: string;
  readonly uri?: string;
  readonly contentType?: string;
  readonly sizeBytes?: number;
  readonly durationSeconds?: number;
  readonly providerId?: string;
  readonly disabled?: boolean;
  readonly uploadAsset?: UploadAsset;
}

export type ExplorerSelectionMode = 'single' | 'multi';

export interface ExplorerActivateEvent {
  readonly id: string;
}

export interface ExplorerSelectionChangeEvent {
  readonly selectedIds: readonly string[];
}

export interface ExplorerProps extends ZoraBaseProps {
  items: readonly ExplorerItem[];
  selectionMode?: ExplorerSelectionMode;
  selectedIds?: readonly string[];
  defaultSelectedIds?: readonly string[];
  onSelectionChange?: (event: ExplorerSelectionChangeEvent) => void;
  onActivate?: (event: ExplorerActivateEvent) => void;
  width?: number;
  height?: number;
  tileSize?: number;
  zoom?: number;
  loading?: boolean;
  errorText?: string;
  emptyText?: string;
  disabled?: boolean;
  readOnly?: boolean;
}
