import { expect, mock, test } from 'bun:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

type EndReachedEvent = Readonly<{ distanceFromEnd: number }>;

type NativeListProps = Readonly<{
  readonly children?: React.ReactNode;
  readonly maxToRenderPerBatch?: number;
  readonly onEndReached?: (event: EndReachedEvent) => void;
  readonly onEndReachedThreshold?: number;
  readonly [key: string]: unknown;
}>;

const flatListProps: NativeListProps[] = [];
const sectionListProps: NativeListProps[] = [];

/*** Captures the props ZORA delivers to the React Native FlatList boundary. */
function NativeFlatList(props: NativeListProps) {
  flatListProps.push(props);
  return null;
}

/*** Captures the props ZORA delivers to the React Native SectionList boundary. */
function NativeSectionList(props: NativeListProps) {
  sectionListProps.push(props);
  return null;
}

await mock.module('react-native', () => ({
  FlatList: NativeFlatList,
  Platform: { OS: 'web' },
  SectionList: NativeSectionList,
  Text: () => null,
}));
await mock.module('@ankhorage/surface', () => ({
  ThemeScope: ({ children }: { readonly children: React.ReactNode }) => children,
  resolveResponsive: <T,>(value: T) => value,
  useResponsiveRuntime: () => ({ breakpoint: undefined }),
  useTheme: () => ({ theme: {} }),
}));
await mock.module('../../../layout/public', () => ({ Divider: () => null }));

const { FlatList } = await import('./FlatList');
const { SectionList } = await import('./SectionList');

test.each([
  {
    name: 'FlatList',
    props: flatListProps,
    render: (properties: {
      readonly interactionPolicy?: 'passive';
      readonly onEndReached?: (event: EndReachedEvent) => void;
      readonly maxToRenderPerBatch?: number;
      readonly onEndReachedThreshold?: number;
    }) => <FlatList {...properties} />,
  },
  {
    name: 'SectionList',
    props: sectionListProps,
    render: (properties: {
      readonly interactionPolicy?: 'passive';
      readonly onEndReached?: (event: EndReachedEvent) => void;
      readonly maxToRenderPerBatch?: number;
      readonly onEndReachedThreshold?: number;
    }) => <SectionList sections={[]} {...properties} />,
  },
])(
  '$name forwards virtualization and pagination defaults, overrides, and callbacks',
  ({ props, render }) => {
    const onEndReached = mock();
    renderToStaticMarkup(render({ onEndReached }));

    const defaults = props.at(-1);
    expect(defaults?.maxToRenderPerBatch).toBe(10);
    expect(defaults?.onEndReachedThreshold).toBe(2);
    defaults?.onEndReached?.({ distanceFromEnd: 24 });
    expect(onEndReached).toHaveBeenCalledWith({ distanceFromEnd: 24 });

    renderToStaticMarkup(
      render({ maxToRenderPerBatch: 4, onEndReachedThreshold: 0.25, onEndReached }),
    );
    const overrides = props.at(-1);
    expect(overrides?.maxToRenderPerBatch).toBe(4);
    expect(overrides?.onEndReachedThreshold).toBe(0.25);

    renderToStaticMarkup(render({ interactionPolicy: 'passive', onEndReached }));
    expect(props.at(-1)?.onEndReached).toBeUndefined();
  },
);
