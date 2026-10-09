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
}

export type ExplorerSelectionMode = 'single' | 'multi';

/** Provider-owned access state projected into the portable explorer presentation. */
export type ExplorerPermissionStatus = 'granted' | 'limited' | 'denied' | 'unavailable';

export interface ExplorerActivateEvent {
  readonly id: string;
}

export interface ExplorerSelectionChangeEvent {
  readonly selectedIds: readonly string[];
}

/** Requests the next provider page without exposing a provider cursor or native object. */
export interface ExplorerPageRequestEvent {
  readonly loadedItemCount: number;
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
  /** Provider paging remains application-owned; Explorer only requests the next page near its end. */
  hasMore?: boolean;
  loadingMore?: boolean;
  /**
   * Stable serializable identity for a provider collection.
   *
   * Supply this whenever paging is enabled so a replacement collection with the same number of
   * loaded rows receives its own initial page request.
   */
  pagingCollectionId?: string;
  /**
   * Provider-controlled retry token for the current page boundary.
   *
   * Change this after a failed request to permit one deliberate retry without causing automatic
   * retry loops.
   */
  pagingRetryToken?: string;
  onLoadMore?: (event: ExplorerPageRequestEvent) => void;
  /** Never pass a native permission object through this presentation boundary. */
  permissionStatus?: ExplorerPermissionStatus;
  permissionText?: string;
  onRequestPermission?: () => void;
  errorText?: string;
  emptyText?: string;
  disabled?: boolean;
  readOnly?: boolean;
}
