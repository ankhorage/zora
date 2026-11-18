import type { FlowExecutionStatus } from '@ankhorage/contracts/flow';
import React from 'react';
import { Pressable } from 'react-native';

import type { FlowExecutionOverlayProps, FlowExecutionStep } from '../../../../types/flow-ui';
import { flowPublicDiagnostic } from '../../../../utils/flowPublicDiagnostic';
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
      {error ? <FlowDiagnostic diagnostic={error} /> : null}
      {steps.map((step) => (
        <FlowStepRow key={step.id} onPress={onStepPress} step={step} />
      ))}
      {trace.map((event, index) => (
        <Pressable
          accessibilityLabel={`Trace ${event.level} at ${event.timestamp}`}
          accessibilityRole="button"
          key={`${event.timestamp}-${index}`}
          onPress={() => onTracePress?.(event)}
        >
          <Text emphasis="muted" variant="caption">
            {formatTrace(event)}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

/** Renders one selectable, presentation-safe step with its visible progress and diagnostic state. */
function FlowStepRow({
  step,
  onPress,
}: {
  readonly step: FlowExecutionStep;
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
        {step.diagnostic ? <FlowDiagnostic diagnostic={step.diagnostic} /> : null}
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

/** Renders a code and message selected by the public ZORA diagnostic allowlist. */
function FlowDiagnostic({
  diagnostic,
}: {
  readonly diagnostic: NonNullable<FlowExecutionOverlayProps['error']>;
}) {
  const publicDiagnostic = flowPublicDiagnostic(diagnostic);
  return <Text color="error">{`${publicDiagnostic.code}: ${publicDiagnostic.message}`}</Text>;
}

/** Formats only trusted trace projection fields; raw FlowTraceEvent.message is never read. */
function formatTrace(trace: NonNullable<FlowExecutionOverlayProps['trace']>[number]): string {
  return [trace.timestamp, trace.level, trace.trustedMessage].filter(Boolean).join(' · ');
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
