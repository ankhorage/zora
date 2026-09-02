import { describe, expect, test } from 'bun:test';

import { ZORA_BINDABLE_COMPONENT_META, ZORA_COMPONENT_META } from '../../metadata';
import { missingElementMeta } from './meta';

describe('MissingElement draft contract', () => {
  test('is a release-blocking manifest leaf distinct from completed states', () => {
    expect(ZORA_COMPONENT_META.MissingElement).toBe(missingElementMeta);
    expect(missingElementMeta.directManifestNode).toBe(true);
    expect(missingElementMeta.allowedChildren).toEqual([]);
    expect(missingElementMeta.manifestPolicy).toEqual({
      kind: 'unresolved-element',
      availability: 'draft-only',
      releaseGate: 'blocked',
    });
    expect(ZORA_COMPONENT_META.Notice.manifestPolicy).toBeUndefined();
    expect(ZORA_COMPONENT_META.EmptyState.manifestPolicy).toBeUndefined();
  });

  test('captures only stable serializable gap and layout data', () => {
    expect(Object.keys(missingElementMeta.props)).toEqual([
      'requestedCapability',
      'reason',
      'evidenceId',
      'minimumWidth',
      'minimumHeight',
    ]);
    expect(missingElementMeta.blueprint.defaultProps).toEqual({
      requestedCapability: 'Unresolved interface capability',
      reason: 'No matching ZORA element is available.',
      minimumWidth: 240,
      minimumHeight: 160,
    });
    expect(() => JSON.stringify(missingElementMeta)).not.toThrow();
  });

  test('has no event, data-binding, runtime-requirement, or fallback contract', () => {
    expect(missingElementMeta.events).toBeUndefined();
    expect(missingElementMeta.requirements).toBeUndefined();
    expect(ZORA_BINDABLE_COMPONENT_META).not.toHaveProperty('MissingElement');
  });

  test('visibly and accessibly identifies the gap while preserving its minimum dimensions', async () => {
    const source = await Bun.file('src/patterns/missing-element/MissingElement.tsx').text();

    expect(source).toContain('accessibilityLabel={accessibilityLabel}');
    expect(source).toContain('accessibilityRole="text"');
    expect(source).toContain('accessible');
    expect(source).toContain('minHeight={minimumHeight}');
    expect(source).toContain('minWidth={minimumWidth}');
    expect(source).toContain('{requestedCapability}');
    expect(source).toContain('{reason}');
  });

  test('accepts the canonical interaction policy without owning interactive behavior', async () => {
    const [source, types] = await Promise.all([
      Bun.file('src/patterns/missing-element/MissingElement.tsx').text(),
      Bun.file('src/patterns/missing-element/types.ts').text(),
    ]);

    expect(types).toContain('MissingElementProps extends ZoraBaseProps');
    expect(source).toContain('interactionPolicy: _interactionPolicy');
    expect(source).not.toMatch(/onPress|onLongPress|onChange|onSubmit/);
    expect(source).not.toMatch(/<Button|<IconButton|<Notice|<EmptyState/);
  });
});
