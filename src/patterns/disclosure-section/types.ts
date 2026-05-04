import type { ButtonIconSpec } from '@ankhorage/surface';
import type { ReactNode } from 'react';

import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface DisclosureSectionProps extends ZoraBaseProps {
  title: ReactNode;
  description?: ReactNode;
  icon?: ButtonIconSpec;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  actions?: ReactNode;
  children?: ReactNode;
  disabled?: boolean;
}
