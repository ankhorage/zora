import React from 'react';

import type { ZoraBaseProps } from './ZoraBaseProps';
import { ZoraThemeScope } from './ZoraThemeScope';

export function withZoraThemeScope<P extends ZoraBaseProps>(
  Component: React.ComponentType<P>,
): React.FC<P> {
  const Wrapped: React.FC<P> = (props) => {
    if (props.mode === undefined && props.themeId === undefined) {
      return <Component {...props} />;
    }

    return (
      <ZoraThemeScope mode={props.mode} themeId={props.themeId}>
        <Component {...props} />
      </ZoraThemeScope>
    );
  };

  const name = Component.displayName ?? (Component.name || 'Component');
  Wrapped.displayName = `withZoraThemeScope(${name})`;

  return Wrapped;
}
