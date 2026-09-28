import React from 'react';
import { Animated, StyleSheet, type View, type ViewStyle } from 'react-native';

import type { GameEntityProps } from '../../../../types/gamePresentation';
import { useGameEntityAnimatedStyle } from '../../utils/useGameEntityAnimatedStyle';
import { useGameEntityMeasurement } from '../../utils/useGameEntityMeasurement';

/*** Render one generic positioned game entity without owning gameplay semantics. */
export function GameEntity(props: GameEntityProps) {
  const elementRef = React.useRef<View | null>(null);
  const animatedStyle = useGameEntityAnimatedStyle(props);
  useGameEntityMeasurement(elementRef, props.measurementId);

  return (
    <Animated.View
      ref={elementRef}
      accessibilityLabel={props.accessibilityLabel}
      testID={props.testID}
      pointerEvents={
        props.interactionPolicy === 'passive' ? 'none' : (props.pointerEvents ?? 'auto')
      }
      style={[styles.root, createEntityStaticStyle(props), animatedStyle]}
    >
      {props.children}
    </Animated.View>
  );
}

/*** Convert non-animated GameEntity presentation props into a React Native view style. */
function createEntityStaticStyle(props: GameEntityProps): ViewStyle {
  return {
    display: props.hidden === true ? 'none' : 'flex',
    position: 'absolute',
    zIndex: props.zIndex ?? 0,
    ...(props.height === undefined ? {} : { height: props.height }),
    ...(props.width === undefined ? {} : { width: props.width }),
  };
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
  },
});
