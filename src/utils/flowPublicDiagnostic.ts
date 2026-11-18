import type { FlowPublicDiagnostic, FlowPublicDiagnosticCode } from '../types/flow-ui';

const PUBLIC_DIAGNOSTIC_MESSAGES: Readonly<Record<FlowPublicDiagnosticCode, string>> = {
  FLOW_EXECUTION_FAILED: 'The flow could not be completed.',
  FLOW_EXECUTION_TIMED_OUT: 'The flow took too long to complete.',
  FLOW_STEP_FAILED: 'This step could not be completed.',
  FLOW_STEP_TIMED_OUT: 'This step took too long to complete.',
};

const FALLBACK_DIAGNOSTIC = {
  code: 'FLOW_EXECUTION_FAILED',
  message: PUBLIC_DIAGNOSTIC_MESSAGES.FLOW_EXECUTION_FAILED,
} as const;

/*** Resolves an allowlisted code to ZORA-owned public text without rendering host error strings.
 *
 * @security The fallback keeps untyped JavaScript consumers from displaying an arbitrary code.
 */
export function flowPublicDiagnostic(diagnostic: FlowPublicDiagnostic): Readonly<{
  readonly code: FlowPublicDiagnosticCode;
  readonly message: string;
}> {
  const message = PUBLIC_DIAGNOSTIC_MESSAGES[diagnostic.code];
  return message ? { code: diagnostic.code, message } : FALLBACK_DIAGNOSTIC;
}
