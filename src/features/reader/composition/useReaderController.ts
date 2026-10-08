import type { ReaderCommand, ReaderErrorEvent, ReaderViewportState } from '@ankhorage/reader';
import React from 'react';
import { Image } from 'react-native';

import type { ReaderProps } from '../../../types/reader';

const INITIAL_STATE: ReaderViewportState = {
  canGoNext: false,
  canGoPrevious: false,
  page: 1,
  progress: 0,
  status: 'loading',
};

type ControllerProps = Pick<
  ReaderProps,
  | 'source'
  | 'format'
  | 'location'
  | 'readerColorScheme'
  | 'fontScale'
  | 'lineHeight'
  | 'onNextPage'
  | 'onPreviousPage'
  | 'onLocationChange'
  | 'onOpenExternalLink'
  | 'onReaderError'
>;

/*** Coordinate themed Reader chrome with the standalone ReaderView's controlled events. */
export function useReaderController(props: ControllerProps) {
  const {
    source,
    readerColorScheme,
    fontScale,
    lineHeight,
    onLocationChange,
    onReaderError,
    onOpenExternalLink,
    onNextPage,
    onPreviousPage,
  } = props;
  const sourceUri = resolveReaderSourceUri(source);
  const [snapshot, setSnapshot] = React.useState({
    sourceUri,
    value: INITIAL_STATE,
  });
  const [failure, setFailure] = React.useState<{
    sourceUri: string | undefined;
    event?: ReaderErrorEvent;
  }>({ sourceUri });
  const [command, setCommand] = React.useState<ReaderCommand>();
  const state = snapshot.sourceUri === sourceUri ? snapshot.value : INITIAL_STATE;
  const error = failure.sourceUri === sourceUri ? failure.event : undefined;

  const handleStateChange = React.useCallback(
    (next: ReaderViewportState) => {
      setSnapshot({ sourceUri, value: next });
      setFailure({ sourceUri });
      if (next.location !== undefined) void onLocationChange?.(next.location);
    },
    [sourceUri, onLocationChange],
  );
  const handleError = React.useCallback(
    (event: ReaderErrorEvent) => {
      setFailure({ sourceUri, event });
      void onReaderError?.(event);
    },
    [sourceUri, onReaderError],
  );
  const handleOpenExternalLink = React.useCallback(
    (event: { readonly url: string }) => {
      void onOpenExternalLink?.(event);
    },
    [onOpenExternalLink],
  );
  const navigate = (type: ReaderCommand['type']) => {
    if (sourceUri === undefined) return;
    setCommand((previous) => ({
      id: (previous?.id ?? 0) + 1,
      sourceUri,
      type,
    }));
    if (type === 'next') void onNextPage?.();
    else void onPreviousPage?.();
  };
  return {
    appearance: {
      colorScheme: readerColorScheme ?? 'system',
      fontScale: fontScale ?? 1,
      lineHeight:
        lineHeight === 'compact' ? 1.25 : lineHeight === 'relaxed' ? 1.75 : 1.5,
    },
    command,
    error,
    goNext: () => navigate('next'),
    goPrevious: () => navigate('previous'),
    handleStateChange,
    handleError,
    handleOpenExternalLink,
    sourceUri,
    state,
  };
}

/*** Resolve a ZORA file source to the independent ReaderView's URI. */
function resolveReaderSourceUri(source: ReaderProps['source']): string | undefined {
  if (typeof source === 'string') return source;
  if (typeof source === 'number') return Image.resolveAssetSource(source).uri;
  return source?.uri;
}
