import { describe, expect, test } from 'bun:test';

import { cardMeta } from '../card/cardMeta';
import { emptyStateMeta } from '../empty-state/emptyStateMeta';
import { missingElementMeta } from './missingElementMeta';

describe('MissingElement draft contract', () => {
  test('is a release-blocking manifest leaf distinct from completed states', () => {
    expect(missingElementMeta.directManifestNode).toBe(true);
    expect(missingElementMeta.allowedChildren).toEqual([]);
    expect(missingElementMeta.manifestPolicy).toEqual({
      kind: 'unresolved-element',
      availability: 'draft-only',
      releaseGate: 'blocked',
    });
    expect(cardMeta.manifestPolicy).toBeUndefined();
    expect(emptyStateMeta.manifestPolicy).toBeUndefined();
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

  test('has no event, data-binding, runtime-requirement, or fallback contract', async () => {
    expect(missingElementMeta.events).toBeUndefined();
    expect(missingElementMeta.requirements).toBeUndefined();
    const bindableSource = await Bun.file('src/features/registry/bindableComponentMeta.ts').text();
    expect(bindableSource).not.toContain('MissingElement');
  });

  test('visibly and accessibly identifies the gap while preserving its minimum dimensions', async () => {
    const source = await Bun.file(
      'src/features/missing-element/adapters/inbound/MissingElement.tsx',
    ).text();

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
      Bun.file('src/features/missing-element/adapters/inbound/MissingElement.tsx').text(),
      Bun.file('src/types/missing-element.ts').text(),
    ]);

    expect(types).toContain('MissingElementProps extends ZoraBaseProps');
    expect(source).toContain('interactionPolicy: _interactionPolicy');
    expect(source).not.toMatch(/onPress|onLongPress|onChange|onSubmit/);
    expect(source).not.toMatch(/<Button|<IconButton|<EmptyState/);
  });
});
