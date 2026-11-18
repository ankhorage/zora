import { describe, expect, test } from 'bun:test';

import { flowPublicDiagnostic } from './flowPublicDiagnostic';

describe('flowPublicDiagnostic', () => {
  test.each(['constructor', '__proto__'])(
    'falls back for the untyped JavaScript key %s',
    (code) => {
      const diagnostic = Reflect.apply(flowPublicDiagnostic, undefined, [{ code }]);

      expect(diagnostic).toEqual({
        code: 'FLOW_EXECUTION_FAILED',
        message: 'The flow could not be completed.',
      });
    },
  );
});
