import type {
  FlowDataRef,
  FlowExecutionStatus,
  FlowNode,
  FlowNodeConfigValue,
} from '@ankhorage/contracts/flow';

import type { ZoraBaseProps } from './base';

/** A controlled palette entry that asks a host to create a workflow node. */
export interface FlowNodePaletteItem {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly disabled?: boolean;
}

/** A portable field schema for the node configuration editor. */
export type FlowInspectorField =
  | Readonly<{
      readonly id: string;
      readonly kind: 'text';
      readonly label: string;
      readonly description?: string;
      readonly required?: boolean;
      readonly disabled?: boolean;
    }>
  | Readonly<{
      readonly id: string;
      readonly kind: 'number';
      readonly label: string;
      readonly description?: string;
      readonly required?: boolean;
      readonly disabled?: boolean;
      readonly minimum?: number;
      readonly maximum?: number;
    }>
  | Readonly<{
      readonly id: string;
      readonly kind: 'boolean';
      readonly label: string;
      readonly description?: string;
      readonly disabled?: boolean;
    }>
  | Readonly<{
      readonly id: string;
      readonly kind: 'select';
      readonly label: string;
      readonly description?: string;
      readonly required?: boolean;
      readonly disabled?: boolean;
      readonly options: readonly Readonly<{ readonly label: string; readonly value: string }>[];
    }>;

/** A node entry for a narrow-screen accessible workflow outline. */
export interface FlowOutlineItem {
  readonly id: string;
  readonly title: string;
  readonly status?: FlowExecutionStatus;
  readonly disabled?: boolean;
}

/** Controlled properties for the independent node catalogue. */
export interface FlowNodePaletteProps extends ZoraBaseProps {
  readonly items: readonly FlowNodePaletteItem[];
  readonly selectedItemId?: string;
  readonly focusedItemId?: string;
  readonly disabled?: boolean;
  readonly onSelectionChange?: (itemId: string | null) => void;
  readonly onFocusChange?: (itemId: string | null) => void;
  readonly onInsert?: (itemId: string) => void;
}

/** An allowlisted diagnostic code whose public message is owned by ZORA. */
export type FlowPublicDiagnosticCode =
  'FLOW_EXECUTION_FAILED' | 'FLOW_EXECUTION_TIMED_OUT' | 'FLOW_STEP_FAILED' | 'FLOW_STEP_TIMED_OUT';

/** A host-projected diagnostic that never carries provider-controlled error text. */
export interface FlowPublicDiagnostic {
  readonly code: FlowPublicDiagnosticCode;
  readonly retryable?: boolean;
}

/** A trace entry whose optional detail was explicitly projected and redacted by a trusted host. */
export interface FlowTrustedTrace {
  readonly timestamp: string;
  readonly level: 'debug' | 'error' | 'info' | 'warn';
  readonly trustedMessage?: string;
}

/** A presentation-safe step projection that deliberately excludes raw Flow errors and traces. */
export interface FlowExecutionStep {
  readonly id: string;
  readonly nodeId: string;
  readonly status: FlowExecutionStatus;
  readonly attempt: number;
  readonly diagnostic?: FlowPublicDiagnostic;
  readonly inputPortIds?: readonly string[];
  readonly outputPortIds?: readonly string[];
  readonly trace?: readonly FlowTrustedTrace[];
}

/** Controlled properties for the inspector and mobile selected-node sheet. */
export interface FlowInspectorProps extends ZoraBaseProps {
  readonly node: FlowNode | null;
  readonly fields?: readonly FlowInspectorField[];
  readonly values?: Readonly<Record<string, FlowNodeConfigValue | undefined>>;
  readonly step?: FlowExecutionStep;
  readonly outline?: readonly FlowOutlineItem[];
  readonly selectedNodeId?: string;
  readonly disabled?: boolean;
  readonly onValueChange?: (fieldId: string, value: FlowNodeConfigValue | undefined) => void;
  readonly onNodeSelectionChange?: (nodeId: string | null) => void;
}

/** Controlled execution-state presentation for a run or its individual steps. */
export interface FlowExecutionOverlayProps extends ZoraBaseProps {
  readonly status: FlowExecutionStatus;
  readonly steps: readonly FlowExecutionStep[];
  readonly error?: FlowPublicDiagnostic;
  readonly trace?: readonly FlowTrustedTrace[];
  readonly progress?: Readonly<{
    readonly value: number;
    readonly max?: number;
    readonly label?: string;
  }>;
  readonly onStepPress?: (step: FlowExecutionStep) => void;
  readonly onTracePress?: (trace: FlowTrustedTrace) => void;
}

/** A redaction-safe value shown in a trace or inspector input/output section. */
export interface FlowInspectorDataSection {
  readonly label: string;
  readonly value: FlowDataRef;
}
