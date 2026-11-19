import type React from 'react';

/** The instance accepted by a React Native component ref across supported React Native type APIs. */
export type ReactNativeComponentInstance<TComponent extends React.ElementType> =
  React.ComponentPropsWithRef<TComponent> extends { readonly ref?: infer TRef }
    ? Exclude<TRef, string | null | undefined> extends React.Ref<infer TInstance>
      ? TInstance
      : never
    : never;
