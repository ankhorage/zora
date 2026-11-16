import React from 'react';

import { withZoraThemeScope } from '../../../../theme/adapters/inbound/withZoraThemeScope';
import { useZoraTheme } from '../../../../theme/composition/useZoraTheme';

const animationClassName = 'zora-activity-indicator-animation';
const animationStyle = `.${animationClassName} { animation: zora-activity-indicator-spin 0.75s linear infinite; }
@keyframes zora-activity-indicator-spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .${animationClassName} { animation: none; } }`;

export interface ActivityIndicatorProps extends Omit<
  React.ComponentPropsWithoutRef<'span'>,
  'color' | 'role' | 'style'
> {
  readonly animating?: boolean;
  readonly color?: string;
  readonly hidesWhenStopped?: boolean;
  readonly inverted?: boolean;
  readonly mode?: 'dark' | 'light';
  readonly size?: 'large' | 'small' | number;
  readonly style?: React.CSSProperties;
  readonly testID?: string;
  readonly themeId?: string;
}

/*** Render a self-contained web loading indicator whose first server frame has deterministic bounds. */
/*** Render the indicator inside its resolved ZORA theme scope. */
function ActivityIndicatorInner({
  animating = true,
  color,
  hidesWhenStopped = true,
  inverted: _inverted,
  mode: _mode,
  size = 'small',
  style,
  testID,
  themeId: _themeId,
  ...props
}: ActivityIndicatorProps): React.JSX.Element {
  const { theme } = useZoraTheme();
  const dimension = typeof size === 'number' ? size : size === 'large' ? 36 : 20;
  const visible = animating || !hidesWhenStopped;
  const resolvedColor = typeof color === 'string' ? color : theme.semantics.content.muted;

  return (
    <>
      <style>{animationStyle}</style>
      <span
        {...props}
        aria-valuemax={1}
        aria-valuemin={0}
        data-testid={testID}
        role="progressbar"
        style={{
          ...style,
          alignItems: 'center',
          display: 'inline-flex',
          height: dimension,
          justifyContent: 'center',
          visibility: visible ? 'visible' : 'hidden',
          width: dimension,
        }}
      >
        <svg
          aria-hidden="true"
          focusable="false"
          height={dimension}
          viewBox="0 0 32 32"
          width={dimension}
          className={animating ? animationClassName : undefined}
          style={{ display: 'block' }}
        >
          <circle
            cx="16"
            cy="16"
            fill="none"
            r="14"
            stroke={resolvedColor}
            strokeOpacity="0.2"
            strokeWidth="4"
          />
          <circle
            cx="16"
            cy="16"
            fill="none"
            r="14"
            stroke={resolvedColor}
            strokeDasharray="80"
            strokeDashoffset="60"
            strokeWidth="4"
          />
        </svg>
      </span>
    </>
  );
}

/*** Render a self-contained web loading indicator whose first server frame has deterministic bounds. */
export const ActivityIndicator = withZoraThemeScope(ActivityIndicatorInner);
