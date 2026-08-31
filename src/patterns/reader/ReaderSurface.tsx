import React from 'react';

import { AppBar } from '../../components/app-bar';
import { IconButton } from '../../components/icon-button';
import { Progress } from '../../components/progress';
import { Text } from '../../components/text';
import { Box, Center, Inline, Stack, Surface } from '../../foundation';
import { useZoraTheme } from '../../theme/useZoraTheme';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { resolveReaderProgress } from './resolveReaderProgress';
import type { ReaderStatus, ReaderSurfaceProps } from './types';

function resolvePageLabel(page: number | undefined, pageCount: number | undefined): string | null {
  if (page === undefined || !Number.isFinite(page)) return null;
  if (pageCount === undefined || !Number.isFinite(pageCount)) return `Page ${page}`;
  return `Page ${page} of ${pageCount}`;
}

function resolveCanGoPrevious({
  canGoPrevious,
  page,
}: Pick<ReaderSurfaceProps, 'canGoPrevious' | 'page'>): boolean {
  if (canGoPrevious !== undefined) return canGoPrevious;
  return page === undefined || page > 1;
}

function resolveCanGoNext({
  canGoNext,
  page,
  pageCount,
}: Pick<ReaderSurfaceProps, 'canGoNext' | 'page' | 'pageCount'>): boolean {
  if (canGoNext !== undefined) return canGoNext;
  return page === undefined || pageCount === undefined || page < pageCount;
}

function ReaderEmptyState({
  status,
  loadingLabel,
  errorTitle,
  unavailableTitle,
}: {
  status: ReaderStatus;
  loadingLabel: string;
  errorTitle: string;
  unavailableTitle: string;
}) {
  const title =
    status === 'loading' ? loadingLabel : status === 'error' ? errorTitle : unavailableTitle;

  return (
    <Center flex={1} minHeight={360} p="l">
      <Text align="center" emphasis="muted" variant="bodySmall">
        {title}
      </Text>
    </Center>
  );
}

function invokeReaderAction(action: (() => void | Promise<void>) | undefined): void {
  void action?.();
}

function ReaderHeader({
  interactionPolicy,
  title,
  subtitle,
  contentsLabel,
  appearanceLabel,
  highlightLabel,
  highlighted,
  headerActions,
  onOpenContents,
  onOpenAppearance,
  onToggleHighlight,
}: Pick<
  ReaderSurfaceProps,
  | 'interactionPolicy'
  | 'title'
  | 'subtitle'
  | 'contentsLabel'
  | 'appearanceLabel'
  | 'highlightLabel'
  | 'highlighted'
  | 'headerActions'
  | 'onOpenContents'
  | 'onOpenAppearance'
  | 'onToggleHighlight'
>) {
  const actions =
    onOpenContents || onOpenAppearance || onToggleHighlight || headerActions ? (
      <Inline align="center" gap="xs" wrap="nowrap">
        {onOpenContents ? (
          <IconButton
            icon={{ name: 'list-outline' }}
            interactionPolicy={interactionPolicy}
            label={contentsLabel ?? 'Table of contents'}
            onPress={() => invokeReaderAction(onOpenContents)}
            size="l"
          />
        ) : null}
        {onOpenAppearance ? (
          <IconButton
            icon={{ name: 'text-outline' }}
            interactionPolicy={interactionPolicy}
            label={appearanceLabel ?? 'Reading appearance'}
            onPress={() => invokeReaderAction(onOpenAppearance)}
            size="l"
          />
        ) : null}
        {onToggleHighlight ? (
          <IconButton
            color={highlighted ? 'primary' : 'neutral'}
            icon={{ name: highlighted ? 'bookmark' : 'bookmark-outline' }}
            interactionPolicy={interactionPolicy}
            label={highlightLabel ?? 'Toggle highlight'}
            onPress={() => invokeReaderAction(onToggleHighlight)}
            size="l"
          />
        ) : null}
        {headerActions}
      </Inline>
    ) : undefined;

  return (
    <AppBar
      actions={actions}
      divider
      interactionPolicy={interactionPolicy}
      safeAreaTop
      subtitle={subtitle}
      title={title}
    />
  );
}

function ReaderFooter({
  interactionPolicy,
  status,
  page,
  pageCount,
  progress,
  canGoPrevious,
  canGoNext,
  chapterLabel,
  pageLabel,
  previousPageLabel,
  nextPageLabel,
  footerActions,
  onPreviousPage,
  onNextPage,
}: Pick<
  ReaderSurfaceProps,
  | 'interactionPolicy'
  | 'status'
  | 'page'
  | 'pageCount'
  | 'progress'
  | 'canGoPrevious'
  | 'canGoNext'
  | 'chapterLabel'
  | 'pageLabel'
  | 'previousPageLabel'
  | 'nextPageLabel'
  | 'footerActions'
  | 'onPreviousPage'
  | 'onNextPage'
>) {
  const { theme } = useZoraTheme();
  const resolvedProgress = resolveReaderProgress({ progress, page, pageCount });
  const resolvedPageLabel = pageLabel ?? resolvePageLabel(page, pageCount);
  const previousEnabled =
    status === 'ready' && Boolean(onPreviousPage) && resolveCanGoPrevious({ canGoPrevious, page });
  const nextEnabled =
    status === 'ready' && Boolean(onNextPage) && resolveCanGoNext({ canGoNext, page, pageCount });

  return (
    <Stack
      bg={theme.semantics.surface.raised}
      borderColor={theme.semantics.neutral.divider}
      borderWidth={1}
      gap="s"
      p="m"
    >
      <Progress value={resolvedProgress} max={1} size="s" />
      <Stack align="center" direction="row" gap="m" justify="space-between" wrap="nowrap">
        <IconButton
          disabled={!previousEnabled}
          icon={{ name: 'chevron-back' }}
          interactionPolicy={interactionPolicy}
          label={previousPageLabel ?? 'Previous page'}
          onPress={() => invokeReaderAction(onPreviousPage)}
          size="l"
        />
        <Box flex={1} minWidth={0}>
          <Stack align="center" gap="xs">
            {chapterLabel ? (
              <Text
                align="center"
                ellipsizeMode="tail"
                numberOfLines={1}
                variant="label"
                weight="semiBold"
              >
                {chapterLabel}
              </Text>
            ) : null}
            {resolvedPageLabel ? (
              <Text
                accessibilityLiveRegion="polite"
                align="center"
                emphasis="muted"
                variant="caption"
              >
                {resolvedPageLabel}
              </Text>
            ) : null}
          </Stack>
        </Box>
        <IconButton
          disabled={!nextEnabled}
          icon={{ name: 'chevron-forward' }}
          interactionPolicy={interactionPolicy}
          label={nextPageLabel ?? 'Next page'}
          onPress={() => invokeReaderAction(onNextPage)}
          size="l"
        />
      </Stack>
      {footerActions ? <Box>{footerActions}</Box> : null}
    </Stack>
  );
}

function ReaderSurfaceInner({
  themeId: _themeId,
  mode: _mode,
  interactionPolicy,
  source: _source,
  format: _format,
  location: _location,
  status = 'idle',
  page,
  pageCount,
  progress,
  canGoPrevious,
  canGoNext,
  title,
  subtitle,
  chapterLabel,
  pageLabel,
  previousPageLabel = 'Previous page',
  nextPageLabel = 'Next page',
  contentsLabel = 'Table of contents',
  appearanceLabel = 'Reading appearance',
  highlightLabel = 'Toggle highlight',
  loadingLabel = 'Loading document…',
  errorTitle = 'Unable to open this document.',
  unavailableTitle = 'Reader preview unavailable.',
  showChrome = true,
  readerColorScheme: _readerColorScheme = 'system',
  fontScale: _fontScale = 1,
  lineHeight: _lineHeight = 'normal',
  highlighted = false,
  viewport,
  headerActions,
  footerActions,
  onPreviousPage,
  onNextPage,
  onLocationChange: _onLocationChange,
  onOpenContents,
  onOpenAppearance,
  onToggleHighlight,
  onOpenExternalLink: _onOpenExternalLink,
  onReaderError: _onReaderError,
  testID,
}: ReaderSurfaceProps) {
  const { theme } = useZoraTheme();

  const viewportContent =
    viewport && status !== 'error' ? (
      viewport
    ) : (
      <ReaderEmptyState
        errorTitle={errorTitle}
        loadingLabel={loadingLabel}
        status={status}
        unavailableTitle={unavailableTitle}
      />
    );

  return (
    <Surface
      radius="l"
      testID={testID}
      variant="default"
      style={{ minHeight: 480, overflow: 'hidden' }}
    >
      <Stack flex={1} gap={0}>
        {showChrome ? (
          <ReaderHeader
            appearanceLabel={appearanceLabel}
            contentsLabel={contentsLabel}
            headerActions={headerActions}
            highlightLabel={highlightLabel}
            highlighted={highlighted}
            interactionPolicy={interactionPolicy}
            onOpenAppearance={onOpenAppearance}
            onOpenContents={onOpenContents}
            onToggleHighlight={onToggleHighlight}
            subtitle={subtitle}
            title={title}
          />
        ) : null}

        <Box bg={theme.semantics.surface.default} flex={1} minHeight={360} overflow="hidden">
          {viewportContent}
        </Box>

        {showChrome ? (
          <ReaderFooter
            canGoNext={canGoNext}
            canGoPrevious={canGoPrevious}
            chapterLabel={chapterLabel}
            footerActions={footerActions}
            interactionPolicy={interactionPolicy}
            nextPageLabel={nextPageLabel}
            onNextPage={onNextPage}
            onPreviousPage={onPreviousPage}
            page={page}
            pageCount={pageCount}
            pageLabel={pageLabel}
            previousPageLabel={previousPageLabel}
            progress={progress}
            status={status}
          />
        ) : null}
      </Stack>
    </Surface>
  );
}

/***
 * Adapter-neutral reader shell for EPUB and PDF experiences.
 *
 * Supply the actual renderer through `viewport`; ZORA owns only the reader
 * chrome, controlled state, progress, accessible controls, and normalized
 * adapter callbacks.
 */
export const ReaderSurface = withZoraThemeScope(ReaderSurfaceInner);
