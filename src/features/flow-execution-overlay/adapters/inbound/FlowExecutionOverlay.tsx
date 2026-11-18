import type { FlowExecutionStatus, FlowStepSnapshot } from '@ankhorage/contracts/flow';
import React from 'react';
import { Pressable } from 'react-native';

import type { FlowExecutionOverlayProps } from '../../../../types/flow-ui';
import { Badge } from '../../../badge/public';
import { Card } from '../../../card/public';
import { View } from '../../../layout/public';
import { Progress } from '../../../progress/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { Heading, Text } from '../../../typography/public';

/** Shows controlled workflow progress, step state, errors, and redaction-safe trace metadata. */
export const FlowExecutionOverlay = withZoraThemeScope(FlowExecutionOverlayInner);

/** Renders execution snapshots without initiating, retrying, or mutating a run. */
function FlowExecutionOverlayInner({
  status,
  steps,
  error,
  trace = [],
  progress,
  onStepPress,
  onTracePress,
  testID,
}: FlowExecutionOverlayProps) {
  return (
    <View accessibilityRole="summary" gap="s" testID={testID}>
      <View style={{ alignItems: 'center', flexDirection: 'row', gap: 8 }}>
        <Heading level={4}>Execution</Heading>
        <Badge color={statusTone(status)}>{formatStatus(status)}</Badge>
      </View>
      {progress ? (
        <View gap="xxs">
          {progress.label ? <Text>{progress.label}</Text> : null}
          <Progress max={progress.max} value={progress.value} />
        </View>
      ) : null}
      {error ? <Text color="error">{`${error.code}: ${error.message}`}</Text> : null}
      {steps.map((step) => (
        <FlowStepRow key={step.id} onPress={onStepPress} step={step} />
      ))}
      {trace.map((event, index) => (
        <Pressable
          accessibilityLabel={`${event.level}: ${event.message}`}
          accessibilityRole="button"
          key={`${event.timestamp}-${index}`}
          onPress={() => onTracePress?.(event)}
        >
          <Text emphasis="muted" variant="caption">
            {`${event.timestamp} · ${event.level} · ${event.message}`}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

/** Renders one selectable step snapshot with its visible progress and error state. */
function FlowStepRow({
  step,
  onPress,
}: {
  readonly step: FlowStepSnapshot;
  readonly onPress: FlowExecutionOverlayProps['onStepPress'];
}) {
  const content = (
    <Card compact tone="subtle">
      <View gap="xxs" p="s">
        <View style={{ alignItems: 'center', flexDirection: 'row', gap: 8 }}>
          <Text>{step.nodeId}</Text>
          <Badge color={statusTone(step.status)}>{formatStatus(step.status)}</Badge>
        </View>
        <Text emphasis="muted" variant="caption">{`Attempt ${step.attempt}`}</Text>
        {step.error ? <Text color="error">{step.error.message}</Text> : null}
      </View>
    </Card>
  );
  if (!onPress) return content;
  return (
    <Pressable accessibilityRole="button" onPress={() => onPress(step)} style={{ minHeight: 44 }}>
      {content}
    </Pressable>
  );
}

/** Translates portable execution states to stable, human-readable labels. */
function formatStatus(status: FlowExecutionStatus): string {
  return status.replaceAll('_', ' ');
}

/** Maps portable execution states to existing ZORA semantic badge tones. */
function statusTone(status: FlowExecutionStatus): 'danger' | 'neutral' | 'success' | 'warning' {
  if (status === 'failed' || status === 'timed_out') return 'danger';
  if (status === 'succeeded') return 'success';
  if (status === 'waiting_for_approval' || status === 'running') return 'warning';
  return 'neutral';
}
