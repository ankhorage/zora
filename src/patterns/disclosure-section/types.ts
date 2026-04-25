import type { ButtonIconSpec } from '@ankhorage/surface';
import type { ReactNode } from 'react';

export interface DisclosureSectionProps {
  title: ReactNode;
  description?: ReactNode;
  icon?: ButtonIconSpec;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  actions?: ReactNode;
  children?: ReactNode;
  disabled?: boolean;
  testID?: string;
}
