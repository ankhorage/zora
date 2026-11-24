import type { FlowNodeConfigValue } from '@ankhorage/contracts/flow';
import React from 'react';
import { Platform, Pressable } from 'react-native';

import type {
  FlowExecutionStep,
  FlowInspectorField,
  FlowInspectorProps,
  FlowOutlineItem,
} from '../../../../types/flow-ui';
import { BottomSheet } from '../../../bottom-sheet/public';
import { Card } from '../../../card/public';
import { flowPublicDiagnostic } from '../../../flow-execution/application/flowPublicDiagnostic';
import { Field } from '../../../form/public';
import { TextInput } from '../../../form/text-input/public';
import { View } from '../../../layout/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { useZoraTheme } from '../../../theme/composition/useZoraTheme';
import { Heading, Text } from '../../../typography/public';

/** Presents a controlled node configuration inspector and a native selected-node sheet. */
export const FlowInspector = withZoraThemeScope(FlowInspectorInner);

/** Keeps fields, selections, configuration, and execution snapshots owned by the host. */
function FlowInspectorInner({
  node,
  fields = [],
  values = {},
  step,
  outline = [],
  selectedNodeId,
  disabled = false,
  interactionPolicy,
  onNodeSelectionChange,
  onValueChange,
  testID,
}: FlowInspectorProps) {
  const content = node ? (
    <FlowInspectorContent
      disabled={disabled || interactionPolicy === 'passive'}
      fields={fields}
      node={node}
      onValueChange={onValueChange}
      step={step}
      values={values}
    />
  ) : (
    <Text emphasis="muted">Select a node to inspect its settings.</Text>
  );

  if (Platform.OS !== 'web') {
    return (
      <View gap="s" testID={testID}>
        <FlowOutline
          disabled={disabled || interactionPolicy === 'passive'}
          items={outline}
          onSelectionChange={onNodeSelectionChange}
          selectedNodeId={selectedNodeId}
        />
        <BottomSheet
          dismissOnBackdropPress
          enablePanDownToClose
          onDismiss={() => onNodeSelectionChange?.(null)}
          open={node !== null}
          snapPoints={['60%', '90%']}
          keyboardBehavior="interactive"
          keyboardBlurBehavior="restore"
        >
          {content}
        </BottomSheet>
      </View>
    );
  }
  return (
    <View gap="s" testID={testID}>
      {outline.length > 0 ? (
        <View testID={testID ? `${testID}-outline` : undefined}>
          <FlowOutline
            disabled={disabled || interactionPolicy === 'passive'}
            items={outline}
            onSelectionChange={onNodeSelectionChange}
            selectedNodeId={selectedNodeId}
          />
        </View>
      ) : null}
      <View testID={testID ? `${testID}-content` : undefined}>{content}</View>
    </View>
  );
}

/** Renders the selected node's immutable contract fields and safe execution details. */
function FlowInspectorContent({
  node,
  fields,
  values,
  step,
  disabled,
  onValueChange,
}: {
  readonly node: NonNullable<FlowInspectorProps['node']>;
  readonly fields: readonly FlowInspectorField[];
  readonly values: NonNullable<FlowInspectorProps['values']>;
  readonly step: FlowInspectorProps['step'];
  readonly disabled: boolean;
  readonly onValueChange: FlowInspectorProps['onValueChange'];
}) {
  return (
    <View gap="m" p="m">
      <View gap="xxs">
        <Heading level={3}>{node.label ?? node.capability.capabilityId}</Heading>
        <Text emphasis="muted">{node.capability.providerId}</Text>
      </View>
      {fields.map((field) => (
        <FlowInspectorFieldControl
          disabled={disabled || field.disabled === true}
          field={field}
          key={field.id}
          onValueChange={onValueChange}
          value={values[field.id] ?? node.config?.[field.id]}
        />
      ))}
      {step ? <FlowStepDetails step={step} /> : null}
    </View>
  );
}

/** Renders one typed editor field and only emits serializable non-secret config references. */
function FlowInspectorFieldControl({
  field,
  value,
  disabled,
  onValueChange,
}: {
  readonly field: FlowInspectorField;
  readonly value: FlowNodeConfigValue | undefined;
  readonly disabled: boolean;
  readonly onValueChange: FlowInspectorProps['onValueChange'];
}) {
  const { theme } = useZoraTheme();
  const valueText = readInlineValue(value);
  const commit = (next: string) => {
    if (disabled) return;
    if (field.kind === 'number') {
      if (next.trim().length === 0) {
        onValueChange?.(field.id, undefined);
        return;
      }
      const normalized = Number(next);
      if (
        !Number.isFinite(normalized) ||
        (field.minimum !== undefined && normalized < field.minimum) ||
        (field.maximum !== undefined && normalized > field.maximum)
      ) {
        return;
      }
      onValueChange?.(field.id, { kind: 'inline', value: normalized });
      return;
    }
    onValueChange?.(field.id, { kind: 'inline', value: next });
  };
  if (field.kind === 'boolean') {
    const checked = valueText === 'true';
    return (
      <Pressable
        accessibilityLabel={field.label}
        accessibilityRole="checkbox"
        accessibilityState={{ checked, disabled }}
        disabled={disabled}
        onPress={() => onValueChange?.(field.id, { kind: 'inline', value: !checked })}
        style={{ minHeight: 44 }}
      >
        <Card
          compact
          style={{ borderColor: theme.semantics.neutral.divider, borderWidth: 1 }}
          tone="subtle"
        >
          <View p="s">
            <Text>{`${field.label}: ${checked ? 'On' : 'Off'}`}</Text>
          </View>
        </Card>
      </Pressable>
    );
  }
  if (field.kind === 'select') {
    const selectedIndex = field.options.findIndex((option) => option.value === valueText);
    const selected = field.options.find((option) => option.value === valueText);
    return (
      <Pressable
        accessibilityLabel={field.label}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={() => {
          const nextIndex = (selectedIndex + 1) % field.options.length;
          const next = field.options.find((_option, index) => index === nextIndex);
          if (next) onValueChange?.(field.id, { kind: 'inline', value: next.value });
        }}
        style={{ minHeight: 44 }}
      >
        <Card
          compact
          style={{ borderColor: theme.semantics.neutral.divider, borderWidth: 1 }}
          tone="subtle"
        >
          <View p="s">
            <Text>{`${field.label}: ${selected?.label ?? 'Select'}`}</Text>
          </View>
        </Card>
      </Pressable>
    );
  }
  return (
    <Field
      description={field.description}
      disabled={disabled}
      label={field.label}
      required={field.required}
    >
      <TextInput
        accessibilityLabel={field.label}
        disabled={disabled}
        keyboardType={field.kind === 'number' ? 'numeric' : undefined}
        onChangeText={commit}
        value={valueText}
      />
    </Field>
  );
}

/** Presents host-projected step input, output, diagnostics, and trusted trace metadata. */
function FlowStepDetails({ step }: { readonly step: NonNullable<FlowInspectorProps['step']> }) {
  return (
    <View gap="xs">
      <Heading level={4}>Execution</Heading>
      <Text>{`${step.status} · Attempt ${step.attempt}`}</Text>
      {step.diagnostic ? <FlowStepDiagnostic diagnostic={step.diagnostic} /> : null}
      <FlowStepDataSection label="Input" portIds={step.inputPortIds} />
      <FlowStepDataSection label="Output" portIds={step.outputPortIds} />
      {step.trace?.map((event, index) => (
        <Text key={`${event.timestamp}-${index}`} emphasis="muted" variant="caption">
          {formatTrustedTrace(event)}
        </Text>
      ))}
    </View>
  );
}

/** Renders a ZORA-owned public diagnostic instead of a raw FlowError. */
function FlowStepDiagnostic({
  diagnostic,
}: {
  readonly diagnostic: NonNullable<FlowExecutionStep['diagnostic']>;
}) {
  const publicDiagnostic = flowPublicDiagnostic(diagnostic);
  return <Text color="error">{`${publicDiagnostic.code}: ${publicDiagnostic.message}`}</Text>;
}

/** Formats only a trace's explicit trusted projection and its useful metadata. */
function formatTrustedTrace(trace: NonNullable<FlowExecutionStep['trace']>[number]): string {
  return [trace.timestamp, trace.level, trace.trustedMessage].filter(Boolean).join(' · ');
}

/** Lists input or output port references while retaining opaque artifact and secret-safe boundaries. */
function FlowStepDataSection({
  label,
  portIds,
}: {
  readonly label: string;
  readonly portIds: readonly string[] | undefined;
}) {
  if (!portIds || portIds.length === 0) return null;
  return (
    <View gap="xxs">
      <Text weight="semiBold">{label}</Text>
      {portIds.map((portId) => (
        <Text key={portId} emphasis="muted" variant="caption">
          {portId}
        </Text>
      ))}
    </View>
  );
}

/** Provides a touch-accessible node outline for narrow native workflow screens. */
function FlowOutline({
  disabled,
  items,
  selectedNodeId,
  onSelectionChange,
}: {
  readonly disabled: boolean;
  readonly items: readonly FlowOutlineItem[];
  readonly selectedNodeId: string | undefined;
  readonly onSelectionChange: FlowInspectorProps['onNodeSelectionChange'];
}) {
  return (
    <View accessibilityRole="list" gap="xs">
      {items.map((item) => (
        <Pressable
          accessibilityLabel={`${item.title}${item.status ? `, ${item.status}` : ''}`}
          accessibilityRole="button"
          accessibilityState={{
            disabled: disabled || item.disabled === true,
            selected: item.id === selectedNodeId,
          }}
          disabled={disabled || item.disabled}
          key={item.id}
          onPress={() => onSelectionChange?.(item.id)}
          style={{ minHeight: 44 }}
        >
          <Text weight={item.id === selectedNodeId ? 'bold' : 'regular'}>{item.title}</Text>
        </Pressable>
      ))}
    </View>
  );
}

/** Converts only ordinary inline primitive values to input text; references and secrets remain opaque. */
function readInlineValue(value: FlowNodeConfigValue | undefined): string {
  if (value?.kind !== 'inline') return '';
  if (
    typeof value.value === 'string' ||
    typeof value.value === 'number' ||
    typeof value.value === 'boolean'
  ) {
    return String(value.value);
  }
  return '';
}
