import { describe, expect, test } from 'bun:test';

import { fileExplorerMeta, mediaExplorerMeta } from './meta';

describe('Explorer authoring metadata', () => {
  const authorableProps = [
    'items',
    'selectionMode',
    'selectedIds',
    'defaultSelectedIds',
    'width',
    'height',
    'tileSize',
    'zoom',
    'loading',
    'hasMore',
    'loadingMore',
    'pagingCollectionId',
    'pagingRetryToken',
    'permissionStatus',
    'permissionText',
    'errorText',
    'emptyText',
    'disabled',
    'readOnly',
  ] as const;

  test('keeps MediaExplorer and FileExplorer serializable props in parity', () => {
    for (const meta of [mediaExplorerMeta, fileExplorerMeta]) {
      expect(meta.directManifestNode).toBe(true);
      for (const prop of authorableProps) expect(meta.props).toHaveProperty(prop);
      expect(meta.props.pagingCollectionId).toMatchObject({ type: 'string', category: 'Paging' });
      expect(meta.props.pagingRetryToken).toMatchObject({ type: 'string', category: 'Paging' });
      expect(meta.props.permissionStatus).toMatchObject({
        type: 'enum',
        enum: ['granted', 'limited', 'denied', 'unavailable'],
      });
    }
  });

  test('normalizes paging and permission actions without exposing provider objects', () => {
    for (const meta of [mediaExplorerMeta, fileExplorerMeta]) {
      expect(meta.events.loadMore).toEqual({
        label: 'Load more',
        eventType: 'explorer.loadMore',
        payloadFields: [{ path: 'loadedItemCount', type: 'number' }],
      });
      expect(meta.events.requestPermission).toEqual({
        label: 'Request permission',
        eventType: 'explorer.requestPermission',
        payloadFields: [],
      });
    }
  });
});
