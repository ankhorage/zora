import type React from 'react';

import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export type ReaderDocumentFormat = 'epub' | 'pdf';

export type ReaderStatus = 'idle' | 'loading' | 'ready' | 'error';

export type ReaderNavigationTrigger =
  'swipe' | 'previousControl' | 'nextControl' | 'keyboard' | 'location';

export interface ReaderLocationChangeEvent {
  format: ReaderDocumentFormat;
  locator: string;
  page: number;
  pageCount?: number;
  progression: number;
  chapterId?: string;
  chapterTitle?: string;
  trigger: ReaderNavigationTrigger;
}

export type ReaderErrorCode =
  'invalid-document' | 'load-failed' | 'protected-document' | 'unsupported-format';

export interface ReaderErrorEvent {
  code: ReaderErrorCode;
  format?: ReaderDocumentFormat;
  message: string;
}

export type ReaderColorScheme = 'system' | 'light' | 'dark' | 'sepia';

export type ReaderLineHeight = 'compact' | 'normal' | 'relaxed';

export type ReaderResolvedSource = string | number | { readonly uri: string };

export interface ReaderExternalLinkEvent {
  url: string;
}

export interface ReaderSurfaceProps extends ZoraBaseProps {
  source?: ReaderResolvedSource | null;
  format: ReaderDocumentFormat;
  location?: string;
  status?: ReaderStatus;
  page?: number;
  pageCount?: number;
  progress?: number;
  canGoPrevious?: boolean;
  canGoNext?: boolean;
  title?: string;
  subtitle?: string;
  chapterLabel?: string;
  pageLabel?: string;
  previousPageLabel?: string;
  nextPageLabel?: string;
  contentsLabel?: string;
  appearanceLabel?: string;
  highlightLabel?: string;
  loadingLabel?: string;
  errorTitle?: string;
  unavailableTitle?: string;
  showChrome?: boolean;
  readerColorScheme?: ReaderColorScheme;
  fontScale?: number;
  lineHeight?: ReaderLineHeight;
  highlighted?: boolean;
  viewport?: React.ReactNode;
  headerActions?: React.ReactNode;
  footerActions?: React.ReactNode;
  onPreviousPage?: () => void | Promise<void>;
  onNextPage?: () => void | Promise<void>;
  onLocationChange?: (event: ReaderLocationChangeEvent) => void | Promise<void>;
  onOpenContents?: () => void | Promise<void>;
  onOpenAppearance?: () => void | Promise<void>;
  onToggleHighlight?: () => void | Promise<void>;
  onOpenExternalLink?: (event: ReaderExternalLinkEvent) => void | Promise<void>;
  onReaderError?: (event: ReaderErrorEvent) => void | Promise<void>;
}
