import type { ListItemProps as SurfaceListItemProps } from '@ankhorage/surface';
import type React from 'react';

import type { ZoraBaseProps } from './base';

export type ListItemVariant = 'divider' | 'card';

interface ListItemBaseProps
  extends
    ZoraBaseProps,
    Pick<SurfaceListItemProps, 'compact' | 'disabled' | 'leading' | 'selected' | 'trailing'> {
  title: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  variant?: ListItemVariant;
}

interface ListItemPressableProps {
  onPress: () => void;
  action?: never;
}

interface ListItemActionProps {
  action: React.ReactNode;
  onPress?: never;
}

interface ListItemStaticProps {
  action?: never;
  onPress?: never;
}

export type ListItemProps = ListItemBaseProps &
  (ListItemPressableProps | ListItemActionProps | ListItemStaticProps);

export interface ListItemsProps extends ZoraBaseProps {
  items: readonly ListItemProps[];
  itemVariant?: ListItemVariant;
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
  items: readonly ListItemProps[];
  itemVariant?: ListItemVariant;
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
