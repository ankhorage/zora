import type React from 'react';

import type { ZoraBaseProps } from './base';

export interface TabsProps extends ZoraBaseProps {
  children?: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export interface TabListProps extends ZoraBaseProps {
  children?: React.ReactNode;
}

export interface TabProps extends ZoraBaseProps {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface TabPanelProps extends ZoraBaseProps {
  value: string;
  children?: React.ReactNode;
}
