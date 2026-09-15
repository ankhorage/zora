import type { ZoraPluginCompositionErrorCode } from '../../../types/plugin';

/*** Report one deterministic plugin composition contract violation. */
export class ZoraPluginCompositionError extends Error {
  readonly code: ZoraPluginCompositionErrorCode;
  readonly packageName: string;
  readonly componentName?: string;

  constructor(args: {
    readonly code: ZoraPluginCompositionErrorCode;
    readonly packageName: string;
    readonly message: string;
    readonly componentName?: string;
  }) {
    super(args.message);
    this.name = 'ZoraPluginCompositionError';
    this.code = args.code;
    this.packageName = args.packageName;
    this.componentName = args.componentName;
  }
}
