import type {
  FlowDataRef,
  FlowError,
  FlowExecutionStatus,
  FlowNode,
  FlowNodeConfigValue,
  FlowStepSnapshot,
  FlowTraceEvent,
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

/** Controlled properties for the inspector and mobile selected-node sheet. */
export interface FlowInspectorProps extends ZoraBaseProps {
  readonly node: FlowNode | null;
  readonly fields?: readonly FlowInspectorField[];
  readonly values?: Readonly<Record<string, FlowNodeConfigValue | undefined>>;
  readonly step?: FlowStepSnapshot;
  readonly outline?: readonly FlowOutlineItem[];
  readonly selectedNodeId?: string;
  readonly disabled?: boolean;
  readonly onValueChange?: (fieldId: string, value: FlowNodeConfigValue | undefined) => void;
  readonly onNodeSelectionChange?: (nodeId: string | null) => void;
}

/** Controlled execution-state presentation for a run or its individual steps. */
export interface FlowExecutionOverlayProps extends ZoraBaseProps {
  readonly status: FlowExecutionStatus;
  readonly steps: readonly FlowStepSnapshot[];
  readonly error?: FlowError;
  readonly trace?: readonly FlowTraceEvent[];
  readonly progress?: Readonly<{
    readonly value: number;
    readonly max?: number;
    readonly label?: string;
  }>;
  readonly onStepPress?: (step: FlowStepSnapshot) => void;
  readonly onTracePress?: (trace: FlowTraceEvent) => void;
}

/** A redaction-safe value shown in a trace or inspector input/output section. */
export interface FlowInspectorDataSection {
  readonly label: string;
  readonly value: FlowDataRef;
}
