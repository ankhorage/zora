import type { ZoraBaseProps } from './base';

export interface PaginationProps extends ZoraBaseProps {
  page: number;
  pageCount: number;
  onPageChange?: (page: number) => void;
  disabled?: boolean;
  siblingCount?: number;
  boundaryCount?: number;
  showFirstLast?: boolean;
  previousLabel?: string;
  nextLabel?: string;
  firstLabel?: string;
  lastLabel?: string;
  compact?: boolean;
}
