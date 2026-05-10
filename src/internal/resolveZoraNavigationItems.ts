import type React from 'react';

import type {
  ZoraNavigationRouteMetadata,
  ZoraNavigationRouteState,
} from '../components/navigation-item';
import type { ZoraNavigationRouteMap } from '../components/navigation-list';

export interface ZoraNavigationDescriptorOptions {
  title?: string;
  tabBarLabel?: string | React.ReactNode;
  drawerLabel?: string | React.ReactNode;
}

export interface ZoraNavigationDescriptor {
  options?: ZoraNavigationDescriptorOptions;
}

export type ZoraNavigationDescriptors = Readonly<
  Record<string, ZoraNavigationDescriptor | undefined>
>;

export interface ZoraNavigationState {
  index: number;
  routes: readonly ZoraNavigationRouteState[];
}

export interface ZoraTabPressEvent {
  type: 'tabPress';
  target: string;
  canPreventDefault: true;
}

export interface ZoraTabPressEventResult {
  defaultPrevented: boolean;
}

export interface ZoraTabBarNavigation {
  emit?: (event: ZoraTabPressEvent) => ZoraTabPressEventResult;
  navigate: (name: string) => void;
}

export interface ZoraDrawerNavigation {
  navigate: (name: string) => void;
  closeDrawer?: () => void;
}

export interface ZoraResolvedNavigationItem {
  route: ZoraNavigationRouteState;
  metadata?: ZoraNavigationRouteMetadata;
  label: React.ReactNode;
  active: boolean;
  disabled: boolean;
}

export type ZoraRouteLabelSource = 'routeMap' | 'descriptor' | 'name';

export function resolveRouteLabel({
  route,
  metadata,
  descriptor,
  kind,
}: {
  route: ZoraNavigationRouteState;
  metadata: ZoraNavigationRouteMetadata | undefined;
  descriptor: ZoraNavigationDescriptor | undefined;
  kind: 'tab' | 'drawer';
}): { label: React.ReactNode; source: ZoraRouteLabelSource } {
  if (metadata?.label !== undefined) {
    return { label: metadata.label, source: 'routeMap' };
  }

  const options = descriptor?.options;
  const fallback =
    kind === 'tab'
      ? (options?.tabBarLabel ?? options?.title)
      : (options?.drawerLabel ?? options?.title);

  if (fallback !== undefined) {
    return { label: fallback, source: 'descriptor' };
  }

  return { label: route.name, source: 'name' };
}

export function resolveNavigationItems({
  state,
  descriptors,
  routeMap,
  kind,
}: {
  state: ZoraNavigationState;
  descriptors?: ZoraNavigationDescriptors | undefined;
  routeMap?: ZoraNavigationRouteMap | undefined;
  kind: 'tab' | 'drawer';
}): readonly ZoraResolvedNavigationItem[] {
  const activeRoute = state.routes[state.index];

  return state.routes.map((route) => {
    const metadata = routeMap?.[route.name];
    const descriptor = descriptors?.[route.key];
    const { label } = resolveRouteLabel({ route, metadata, descriptor, kind });
    const disabled = Boolean(metadata?.disabled);

    return {
      route,
      metadata,
      label,
      active: activeRoute ? activeRoute.key === route.key : false,
      disabled,
    };
  });
}

export function createTabBarItemPressHandler({
  item,
  navigation,
}: {
  item: ZoraResolvedNavigationItem;
  navigation: ZoraTabBarNavigation;
}): (() => void) | undefined {
  if (item.disabled || item.active) {
    return undefined;
  }

  return () => {
    const result = navigation.emit?.({
      type: 'tabPress',
      target: item.route.key,
      canPreventDefault: true,
    });

    if (result?.defaultPrevented) {
      return;
    }

    navigation.navigate(item.route.name);
  };
}

export function createDrawerItemPressHandler({
  item,
  navigation,
}: {
  item: ZoraResolvedNavigationItem;
  navigation: ZoraDrawerNavigation;
}): (() => void) | undefined {
  if (item.disabled) {
    return undefined;
  }

  return () => {
    navigation.navigate(item.route.name);
    navigation.closeDrawer?.();
  };
}
