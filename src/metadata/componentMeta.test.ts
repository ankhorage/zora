import { describe, expect, test } from 'bun:test';

import { ZORA_COMPONENT_META, type ZoraComponentEventPayloadKind } from './index';

describe('ZORA_COMPONENT_META public API', () => {
  test('src/index.ts re-exports ZORA_COMPONENT_META', () => {
    expect(ZORA_COMPONENT_META).toBeDefined();
  });

  test('src/index.ts re-exports component event metadata types', () => {
    const eventType: ZoraComponentEventPayloadKind = 'button.press';

    expect(eventType).toBe('button.press');
  });
});

describe('ZORA_COMPONENT_META registry coverage', () => {
  test('covers every public UI React component export (foundation/components/patterns/layout)', async () => {
    const source = await Bun.file('src/index.ts').text();
    const componentExports = Array.from(source.matchAll(/export \{ ([^}]+) \} from '\.\/(components|foundation|layout|patterns)\/[^']+';/g))
      .flatMap((match) => match[1].split(',').map((item) => item.trim()))
      .map((item) => item.split(' as ')[0].trim())
      .filter((name) => /^[A-Z]/.test(name))
      .filter((name) => !['ToastProvider'].includes(name));

    for (const name of componentExports) {
      expect(ZORA_COMPONENT_META[name], `${name} is missing from ZORA_COMPONENT_META`).toBeDefined();
    }
  });

  test('does not treat providers/scopes as UI component registry entries', () => {
    expect(ZORA_COMPONENT_META.ToastProvider).toBeUndefined();
    expect(ZORA_COMPONENT_META.ZoraProvider).toBeUndefined();
  });
});

describe('ZORA_COMPONENT_META event metadata', () => {
  test('declares form submit metadata', () => {
    const event = ZORA_COMPONENT_META.Form.events?.submit;
    const eventType: ZoraComponentEventPayloadKind = event?.eventType ?? 'form.submit';

    expect(eventType).toBe('form.submit');
    expect(event?.payloadFields?.map((field) => field.path)).toEqual(['payload.values']);
  });

  test('declares button event metadata', () => {
    const event = ZORA_COMPONENT_META.Button.events?.press;
    const eventType: ZoraComponentEventPayloadKind = event?.eventType ?? 'button.press';

    expect(eventType).toBe('button.press');
    expect(event?.payloadFields).toEqual([]);
  });

  test('declares collection item metadata for list rows', () => {
    const event = ZORA_COMPONENT_META.ListRow.events?.itemPress;
    const eventType: ZoraComponentEventPayloadKind = event?.eventType ?? 'collection.itemPress';

    expect(eventType).toBe('collection.itemPress');
    expect(event?.payloadFields?.map((field) => field.path)).toEqual([
      'payload.itemId',
      'payload.item',
    ]);
  });
});

describe('ZORA_COMPONENT_META invariants', () => {
  test('every key matches meta.name', () => {
    for (const [key, meta] of Object.entries(ZORA_COMPONENT_META)) {
      expect(meta.name).toBe(key);
    }
  });

  test('allowedChildren always points to a known direct manifest node', () => {
    for (const [key, meta] of Object.entries(ZORA_COMPONENT_META)) {
      for (const child of meta.allowedChildren) {
        const childMeta = ZORA_COMPONENT_META[child];
        expect(childMeta, `${key} allowedChildren includes unknown key '${child}'`).toBeDefined();
        expect(
          childMeta.directManifestNode,
          `${key} allowedChildren includes non-directManifestNode key '${child}'`,
        ).toBe(true);
      }
    }
  });

  test('direct manifest node leaf/container rules', () => {
    const expectedLeafNodes = new Set([
      'SectionHeader',
      'SettingsRow',
      'EmptyState',
      'Hero',
      'Button',
      'Input',
      'Textarea',
      'Text',
      'Heading',
      'Divider',
      'ChatListItem',
      'CameraPermissionView',
      'ScanOverlay',
    ]);

    const expectedContainerNodes = new Set([
      'FormField',
      'ButtonGroup',
      'Screen',
      'ScreenSection',
      'Card',
      'Panel',
      'Notice',
      'PostCard',
      'MessageBubble',
      'Box',
      'Stack',
      'Grid',
      'Container',
      'BarcodeScannerView',
    ]);

    for (const [key, meta] of Object.entries(ZORA_COMPONENT_META)) {
      if (!meta.directManifestNode) continue;

      if (expectedLeafNodes.has(key)) {
        expect(meta.allowedChildren.length, `${key} should be a leaf manifest node`).toBe(0);
        continue;
      }

      if (expectedContainerNodes.has(key)) {
        expect(
          meta.allowedChildren.length,
          `${key} should be a container manifest node`,
        ).toBeGreaterThan(0);
        continue;
      }

      throw new Error(
        `Direct manifest node '${key}' must be categorized as leaf or container in the test.`,
      );
    }
  });

  test('non-direct manifest nodes include an explicit note', () => {
    for (const [key, meta] of Object.entries(ZORA_COMPONENT_META)) {
      if (meta.directManifestNode) continue;

      expect(
        typeof meta.note === 'string' && meta.note.trim().length > 0,
        `${key} must include a note when directManifestNode is false`,
      ).toBe(true);
    }
  });

  test('registry and blueprints are JSON serializable', () => {
    expect(() => JSON.stringify(ZORA_COMPONENT_META)).not.toThrow();

    for (const [key, meta] of Object.entries(ZORA_COMPONENT_META)) {
      if (!meta.blueprint?.defaultProps) continue;
      expect(() => JSON.stringify(meta.blueprint.defaultProps), key).not.toThrow();
    }
  });
});
