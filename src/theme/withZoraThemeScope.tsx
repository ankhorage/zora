import React from 'react';

import type { ZoraBaseProps } from './ZoraBaseProps';
import { ZoraThemeScope } from './ZoraThemeScope';

export function withZoraThemeScope<P extends ZoraBaseProps>(
  Component: (props: P) => React.ReactElement | null,
): (props: P) => React.ReactElement | null {
  const Wrapped = (props: P) => {
    if (props.mode === undefined && props.themeId === undefined) {
      return Component(props);
    }

    return (
      <ZoraThemeScope mode={props.mode} themeId={props.themeId}>
        {Component(props)}
      </ZoraThemeScope>
    );
  };

  const name =
    (Component as { displayName?: string }).displayName ?? (Component.name || 'Component');
  (Wrapped as { displayName?: string }).displayName = `withZoraThemeScope(${name})`;

  return Wrapped;
}
