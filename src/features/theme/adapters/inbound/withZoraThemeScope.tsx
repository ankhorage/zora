import React from 'react';

import type { ZoraBaseProps } from '../../../../types/base';
import { ZoraThemeScope } from './ZoraThemeScope';

/*** Applies optional theme and polarity overrides to any ZORA component. */
export function withZoraThemeScope<P extends ZoraBaseProps>(
  Component: (props: P) => React.ReactElement | null,
): (props: P) => React.ReactElement | null {
  const Wrapped = (props: P) => {
    const componentProps = { ...props };
    delete componentProps.themeId;
    delete componentProps.mode;
    delete componentProps.inverted;
    if (props.mode === undefined && props.themeId === undefined && props.inverted === undefined) {
      return React.createElement(Component, componentProps);
    }

    return (
      <ZoraThemeScope mode={props.mode} themeId={props.themeId} inverted={props.inverted}>
        {React.createElement(Component, componentProps)}
      </ZoraThemeScope>
    );
  };

  const name =
    (Component as { displayName?: string }).displayName ?? (Component.name || 'Component');
  (Wrapped as { displayName?: string }).displayName = `withZoraThemeScope(${name})`;

  return Wrapped;
}
