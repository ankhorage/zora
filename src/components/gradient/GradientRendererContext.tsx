import React, { createContext, use } from 'react';

import type { GradientRenderer, GradientRendererProviderProps } from './types';

const GradientRendererContext = createContext<GradientRenderer | null>(null);

/**
 * Supplies the host-owned renderer used by `Gradient`.
 *
 * Expo apps can adapt `expo-linear-gradient` here, while standalone React
 * Native hosts can inject another compatible implementation.
 */
export function GradientRendererProvider({ children, renderer }: GradientRendererProviderProps) {
  return <GradientRendererContext value={renderer}>{children}</GradientRendererContext>;
}

export function useGradientRenderer(): GradientRenderer {
  const renderer = use(GradientRendererContext);

  if (!renderer) {
    throw new Error(
      'Gradient requires a renderer. Wrap the app in GradientRendererProvider with a platform-compatible gradient implementation.',
    );
  }

  return renderer;
}
