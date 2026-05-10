import { describe, expect, test } from 'bun:test';
import React from 'react';

import {
  createDrawerItemPressHandler,
  createTabBarItemPressHandler,
  resolveNavigationItems,
  resolveRouteLabel,
  type ZoraNavigationDescriptor,
  type ZoraNavigationState,
  type ZoraResolvedNavigationItem,
  type ZoraRouteLabelSource,
} from './resolveZoraNavigationItems';

describe('resolveRouteLabel', () => {
  test('prefers routeMap label over descriptor label', () => {
    const descriptor: ZoraNavigationDescriptor = {
      options: {
        title: 'Home Title',
        tabBarLabel: 'Home Tab',
      },
    };

    const result = resolveRouteLabel({
      kind: 'tab',
      route: { key: 'k1', name: 'home' },
      metadata: { label: 'Home Map' },
      descriptor,
    });

    const expectedSource: ZoraRouteLabelSource = 'routeMap';
    expect(result).toEqual({ label: 'Home Map', source: expectedSource });
  });

  test('uses descriptor label/title as fallback for label only', () => {
    const descriptor: ZoraNavigationDescriptor = {
      options: {
        title: 'Settings Title',
        tabBarLabel: undefined,
      },
    };

    const result = resolveRouteLabel({
      kind: 'tab',
      route: { key: 'k2', name: 'settings' },
      metadata: undefined,
      descriptor,
    });

    expect(result).toEqual({ label: 'Settings Title', source: 'descriptor' });
  });

  test('falls back to route name if nothing else provided', () => {
    const result = resolveRouteLabel({
      kind: 'drawer',
      route: { key: 'k3', name: 'profile' },
      metadata: undefined,
      descriptor: undefined,
    });

    expect(result).toEqual({ label: 'profile', source: 'name' });
  });
});

describe('resolveNavigationItems', () => {
  test('maps active index + routeMap disabled state without using descriptors for icons/badges', () => {
    const state: ZoraNavigationState = {
      index: 1,
      routes: [
        { key: 'r1', name: 'home' },
        { key: 'r2', name: 'settings' },
      ],
    };

    const items = resolveNavigationItems({
      state,
      kind: 'tab',
      descriptors: {
        r1: { options: { tabBarLabel: 'Home Opt', title: 'Home Title' } },
        r2: { options: { tabBarLabel: 'Settings Opt' } },
      },
      routeMap: {
        settings: { disabled: true, badge: React.createElement('span', null, '3') },
      },
    });

    expect(items).toHaveLength(2);
    expect(items[0]).toMatchObject({ active: false, disabled: false });
    expect(items[1]).toMatchObject({ active: true, disabled: true });
    expect(items[1]?.metadata?.badge).toBeDefined();
  });
});

describe('press handler helpers', () => {
  test('tab press handler is undefined for disabled or active items', () => {
    const handlerDisabled = createTabBarItemPressHandler({
      item: {
        route: { key: 'k1', name: 'home' },
        metadata: { disabled: true },
        label: 'Home',
        active: false,
        disabled: true,
      },
      navigation: { navigate: () => undefined },
    });
    expect(handlerDisabled).toBeUndefined();

    const handlerActive = createTabBarItemPressHandler({
      item: {
        route: { key: 'k1', name: 'home' },
        metadata: undefined,
        label: 'Home',
        active: true,
        disabled: false,
      },
      navigation: { navigate: () => undefined },
    });
    expect(handlerActive).toBeUndefined();
  });

  test('tab press handler respects preventDefault', () => {
    let navigatedTo: string | null = null;
    const handler = createTabBarItemPressHandler({
      item: {
        route: { key: 'k1', name: 'home' },
        metadata: undefined,
        label: 'Home',
        active: false,
        disabled: false,
      },
      navigation: {
        emit: () => ({ defaultPrevented: true }),
        navigate: (name) => {
          navigatedTo = name;
        },
      },
    });

    expect(handler).toBeDefined();
    handler?.();
    expect(navigatedTo).toBeNull();
  });

  test('drawer press handler navigates and closes drawer', () => {
    const calls: string[] = [];
    const handler = createDrawerItemPressHandler({
      item: {
        route: { key: 'k1', name: 'home' },
        metadata: undefined,
        label: 'Home',
        active: false,
        disabled: false,
      } satisfies ZoraResolvedNavigationItem,
      navigation: {
        navigate: (name) => calls.push(`navigate:${name}`),
        closeDrawer: () => calls.push('close'),
      },
    });

    handler?.();
    expect(calls).toEqual(['navigate:home', 'close']);
  });
});
