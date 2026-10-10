import {
  Button,
  FileExplorer,
  MediaExplorer,
  Screen,
  ScreenSection,
  type UploadAsset,
  Uploader,
  View,
} from '@ankhorage/zora';
import React from 'react';

const mediaItems = Array.from({ length: 10000 }, (_, index) => ({
  id: `media-${index}`,
  kind: index % 5 === 0 ? ('video' as const) : ('image' as const),
  name: `Media asset ${index + 1}`,
  thumbnailUri: `https://picsum.photos/seed/grid-workspace-${index}/160`,
}));

const fileItems = [
  { id: 'designs', kind: 'folder' as const, name: 'Designs' },
  { id: 'brief', kind: 'document' as const, name: 'Creative brief.pdf' },
];

/*** Runs the canonical interactive media, file, focus and uploader GridView scenarios on native and web. */
export default function App() {
  const [density, setDensity] = React.useState(96);
  const [selectedIds, setSelectedIds] = React.useState<readonly string[]>([]);
  const [visibleMediaCount, setVisibleMediaCount] = React.useState(180);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [permissionStatus, setPermissionStatus] = React.useState<'granted' | 'limited' | 'denied'>(
    'granted',
  );
  const [uploadedAsset, setUploadedAsset] = React.useState<UploadAsset | null>(null);
  const visibleMedia = mediaItems.slice(0, visibleMediaCount);

  const loadNextMediaPage = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleMediaCount((count) => Math.min(count + 180, mediaItems.length));
      setLoadingMore(false);
    }, 250);
  };

  return (
    <Screen>
      <ScreenSection
        title="Media workspace"
        description="10,000 virtualized tiles; use arrow keys and Shift+arrow on web."
      >
        <View direction="row" gap="s">
          <Button onPress={() => setDensity((value) => Math.max(72, value - 24))}>Smaller</Button>
          <Button onPress={() => setDensity((value) => value + 24)}>Larger</Button>
          <Button onPress={() => setPermissionStatus('limited')}>Limited access</Button>
          <Button onPress={() => setPermissionStatus('denied')}>Deny access</Button>
        </View>
        <MediaExplorer
          height={400}
          hasMore={visibleMediaCount < mediaItems.length}
          items={visibleMedia}
          loadingMore={loadingMore}
          pagingCollectionId="workspace-media"
          permissionStatus={permissionStatus}
          onLoadMore={loadNextMediaPage}
          onRequestPermission={() => setPermissionStatus('granted')}
          selectedIds={selectedIds}
          selectionMode="multi"
          tileSize={density}
          onSelectionChange={({ selectedIds: next }) => setSelectedIds(next)}
        />
      </ScreenSection>
      <ScreenSection title="File workspace">
        <FileExplorer items={fileItems} selectionMode="multi" />
      </ScreenSection>
      <ScreenSection title="Uploader">
        <Uploader
          explorerItems={mediaItems.slice(0, 8).map((item) => ({
            ...item,
            uploadAsset: {
              kind: 'url' as const,
              url: item.thumbnailUri,
              fileName: item.name,
              contentType: 'image/jpeg',
            },
          }))}
          value={uploadedAsset}
          type="image"
          onChange={setUploadedAsset}
          onRemove={() => setUploadedAsset(null)}
          onUpload={async (asset, { setProgress }) => {
            setProgress(0.5);
            await Promise.resolve();
            setProgress(1);
            return asset;
          }}
        />
      </ScreenSection>
    </Screen>
  );
}
