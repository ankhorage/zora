import type React from 'react';

import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface PaginationProps extends ZoraBaseProps {
  page: number;
  pageCount: number;
  onPageChange?: (page: number) => void;
  disabled?: boolean;
  siblingCount?: number;
  boundaryCount?: number;
  showFirstLast?: boolean;
  previousLabel?: React.ReactNode;
  nextLabel?: React.ReactNode;
  firstLabel?: React.ReactNode;
  lastLabel?: React.ReactNode;
  compact?: boolean;
  testID?: string;
}
