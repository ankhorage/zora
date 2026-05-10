import type React from 'react';

import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export type ListRowVariant = 'divider' | 'card';

interface ListRowBaseProps extends ZoraBaseProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
  compact?: boolean;
  variant?: ListRowVariant;
}

interface ListRowPressableProps {
  onPress: () => void;
  action?: never;
}

interface ListRowActionProps {
  action: React.ReactNode;
  onPress?: never;
}

interface ListRowStaticProps {
  action?: never;
  onPress?: never;
}

export type ListRowProps = ListRowBaseProps &
  (ListRowPressableProps | ListRowActionProps | ListRowStaticProps);

export interface ListItemsProps extends ZoraBaseProps {
  items: readonly ListRowProps[];
  rowVariant?: ListRowVariant;
  compact?: boolean;
}

export interface ListChildrenProps extends ZoraBaseProps {
  children: React.ReactNode;
}

export type ListProps = ListItemsProps | ListChildrenProps;

interface ListSectionItemsProps extends ZoraBaseProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
  actions?: React.ReactNode;
  items: readonly ListRowProps[];
  rowVariant?: ListRowVariant;
  compact?: boolean;
}

interface ListSectionChildrenProps extends ZoraBaseProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export type ListSectionProps = ListSectionItemsProps | ListSectionChildrenProps;
