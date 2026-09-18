import { describe, expect, test } from 'bun:test';

import { ZORA_COMPONENT_META, type ZoraComponentEventPayloadKind } from '.';

const componentMetaByName = new Map(Object.entries(ZORA_COMPONENT_META));

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
    const componentExports = Array.from(
      source.matchAll(
        /export\s+\{([^}]+)\}\s+from '\.\/(components\/[^']+|foundation|layout\/[^']+|patterns\/[^']+)';/g,
      ),
    )
      .flatMap((match) => match[1].split(',').map((item) => item.trim()))
      .map((item) => item.split(' as ')[0].trim())
      .filter((name) => /^[A-Z][A-Za-z0-9]+$/.test(name))
      .filter((name) => !['GradientRendererProvider', 'ToastProvider'].includes(name));
    componentExports.push('ThemeModeToggle');

    for (const name of componentExports) {
      expect(
        componentMetaByName.get(name),
        `${name} is missing from ZORA_COMPONENT_META`,
      ).toBeDefined();
    }
  });

  test('does not treat providers/scopes as direct manifest UI nodes', () => {
    expect(ZORA_COMPONENT_META.ToastProvider?.directManifestNode).toBe(false);
    expect(ZORA_COMPONENT_META.GradientRendererProvider).toBeUndefined();
    expect(ZORA_COMPONENT_META.ZoraProvider).toBeUndefined();
  });
});

describe('ZORA_COMPONENT_META event metadata', () => {
  test('declares form submit metadata', () => {
    const event = ZORA_COMPONENT_META.Form.events?.submit;
    const eventType: ZoraComponentEventPayloadKind = event?.eventType ?? 'form.submit';

    expect(eventType).toBe('form.submit');
    expect(event?.payloadFields).toEqual([]);
  });

  test('declares button event metadata', () => {
    const event = ZORA_COMPONENT_META.Button.events?.press;
    const eventType: ZoraComponentEventPayloadKind = event?.eventType ?? 'button.press';

    expect(eventType).toBe('button.press');
    expect(event?.payloadFields).toEqual([]);
  });

  test('declares collection item metadata for list rows', () => {
    const event = ZORA_COMPONENT_META.ListItem.events?.itemPress;
    const eventType: ZoraComponentEventPayloadKind = event?.eventType ?? 'collection.itemPress';

    expect(eventType).toBe('collection.itemPress');
    expect(event?.payloadFields?.map((field) => field.path)).toEqual([
      'payload.itemId',
      'payload.item',
    ]);
  });
});

describe('ZORA_COMPONENT_META requirement metadata', () => {
  test('declares camera permission metadata for camera permission UI', () => {
    expect(ZORA_COMPONENT_META.CameraPermissionView.requirements).toEqual({
      permissions: { camera: true },
    });
  });

  test('declares camera and barcode scanner metadata for barcode scanner UI', () => {
    expect(ZORA_COMPONENT_META.BarcodeScannerView.requirements).toEqual({
      permissions: { camera: true },
      capabilities: { barcodeScanner: true },
    });
  });

  test('declares ebook reader capability metadata for ReaderSurface', () => {
    expect(ZORA_COMPONENT_META.ReaderSurface.requirements).toEqual({
      capabilities: { ebookReader: true },
    });
  });

  test('does not declare runtime requirements for the camera-agnostic scan overlay', () => {
    expect(ZORA_COMPONENT_META.ScanOverlay.requirements).toBeUndefined();
  });
});

describe('ZORA_COMPONENT_META invariants', () => {
  test('keeps form nodes in their canonical hierarchy', () => {
    expect(ZORA_COMPONENT_META.Form.allowedChildren).toEqual(['FormError', 'Field']);
    expect(ZORA_COMPONENT_META.Field.allowedChildren).toEqual([
      'Checkbox',
      'CheckboxGroup',
      'RadioGroup',
      'SearchInput',
      'Select',
      'Switch',
      'TextInput',
    ]);
    for (const [name, meta] of Object.entries(ZORA_COMPONENT_META)) {
      if (name === 'Form') continue;
      expect(meta.allowedChildren).not.toContain('FormError');
      expect(meta.allowedChildren).not.toContain('Field');
    }
  });

  test('every key matches meta.name', () => {
    for (const [key, meta] of Object.entries(ZORA_COMPONENT_META)) {
      expect(meta.name).toBe(key);
    }
  });

  test('allowedChildren always points to a known direct manifest node', () => {
    for (const [key, meta] of Object.entries(ZORA_COMPONENT_META)) {
      for (const child of meta.allowedChildren) {
        const childMeta = componentMetaByName.get(child);
        expect(childMeta, `${key} allowedChildren includes unknown key '${child}'`).toBeDefined();
        expect(
          childMeta?.directManifestNode,
          `${key} allowedChildren includes non-directManifestNode key '${child}'`,
        ).toBe(true);
      }
    }
  });

  test('direct manifest node leaf/container rules', () => {
    const expectedLeafNodes = new Set([
      'ActivityIndicator',
      'ForgotPasswordForm',
      'OAuthProviderButton',
      'OAuthProviderList',
      'OtpForm',
      'SignInForm',
      'SignUpForm',
      'Avatar',
      'AvatarGroup',
      'Badge',
      'Breadcrumbs',
      'Chip',
      'ChipGroup',
      'DataTable',
      'DatePicker',
      'Pagination',
      'Rating',
      'SearchInput',
      'Tab',
      'Skeleton',
      'SkeletonCard',
      'SkeletonList',
      'SkeletonText',
      'IconButton',
      'MetricCard',
      'Uploader',
      'SectionHeader',
      'EmptyState',
      'Hero',
      'Button',
      'FormError',
      'Checkbox',
      'CheckboxGroup',
      'Radio',
      'RadioGroup',
      'Select',
      'ThemeModeToggle',
      'Switch',
      'TextInput',
      'Text',
      'Heading',
      'Icon',
      'Image',
      'Divider',
      'ChatListItem',
      'CameraPermissionView',
      'ScanOverlay',
      'ProductCard',
      'Progress',
      'ProgressRing',
      'ReaderSurface',
      'MissingElement',
      'TimePicker',
    ]);

    const expectedContainerNodes = new Set([
      'Accordion',
      'AccordionItem',
      'Dialog',
      'Form',
      'Gradient',
      'Surface',
      'MediaCard',
      'FlatList',
      'SectionList',
      'BottomSheet',
      'KeyboardAvoidingView',
      'Field',
      'ButtonGroup',
      'Screen',
      'ScreenSection',
      'Card',
      'PostCard',
      'MessageBubble',
      'View',
      'ScrollView',
      'Grid',
      'BarcodeScannerView',
      'ContentRail',
      'Tabs',
      'TabList',
      'TabPanel',
      'Toolbar',
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

  test('Tabs constrain authored content to the accessible tab hierarchy', () => {
    expect(ZORA_COMPONENT_META.Tabs.allowedChildren).toEqual(['TabList', 'TabPanel']);
    expect(ZORA_COMPONENT_META.TabList.allowedChildren).toEqual(['Tab']);
    expect(ZORA_COMPONENT_META.Tab.allowedChildren).toEqual([]);
    expect(ZORA_COMPONENT_META.TabPanel.allowedChildren.length).toBeGreaterThan(0);
    expect(ZORA_COMPONENT_META.Tabs.events?.valueChange?.eventType).toBe('tabs.valueChange');
  });

  test('Accordion constrains authored items to its canonical hierarchy', () => {
    expect(ZORA_COMPONENT_META.Accordion.directManifestNode).toBe(true);
    expect(ZORA_COMPONENT_META.Accordion.allowedChildren).toEqual(['AccordionItem']);
    expect(ZORA_COMPONENT_META.AccordionItem.directManifestNode).toBe(true);
    expect(ZORA_COMPONENT_META.AccordionItem.allowedChildren).not.toContain('AccordionItem');
  });

  test('Image is a direct manifest leaf with canonical media authoring metadata', () => {
    expect(ZORA_COMPONENT_META.Image.directManifestNode).toBe(true);
    expect(ZORA_COMPONENT_META.Image.allowedChildren).toEqual([]);
    expect(ZORA_COMPONENT_META.Image.props.source).toEqual({
      type: 'media',
      category: 'Content',
      label: 'Source',
      mediaKinds: ['image'],
      authoring: { authority: 'instance' },
    });
    expect(ZORA_COMPONENT_META.Image.props.alt?.authoring).toEqual({ authority: 'instance' });
  });

  test('RadioGroup is a direct manifest leaf with card presentation and normalized value events', () => {
    const radioGroup = ZORA_COMPONENT_META.RadioGroup;

    expect(radioGroup.directManifestNode).toBe(true);
    expect(radioGroup.allowedChildren).toEqual([]);
    expect(radioGroup.props.presentation?.enum).toEqual(['inline', 'card']);
    expect(radioGroup.props.options?.type).toBe('array');
    expect(radioGroup.props.options?.itemSchema?.map((item) => item.key)).toEqual([
      'value',
      'label',
      'description',
      'iconSource',
      'disabled',
    ]);
    expect(radioGroup.bindings?.props?.value?.value).toEqual({ type: 'string' });
    expect(radioGroup.events?.valueChange?.eventType).toBe('radioGroup.valueChange');
    expect(radioGroup.events?.valueChange?.payloadFields).toEqual([
      { path: 'value', type: 'string', label: 'Value' },
    ]);
  });

  test('ThemeModeToggle is a direct manifest leaf with serializable defaults', () => {
    expect(ZORA_COMPONENT_META.ThemeModeToggle.directManifestNode).toBe(true);
    expect(ZORA_COMPONENT_META.ThemeModeToggle.allowedChildren).toEqual([]);
    expect(ZORA_COMPONENT_META.ThemeModeToggle.blueprint?.defaultProps).toEqual({ size: 'm' });
  });

  test('KeyboardAvoidingView is a direct manifest container with native behavior props', () => {
    const keyboardAvoidingView = ZORA_COMPONENT_META.KeyboardAvoidingView;

    expect(keyboardAvoidingView.directManifestNode).toBe(true);
    expect(keyboardAvoidingView.allowedChildren.length).toBeGreaterThan(0);
    expect(keyboardAvoidingView.blueprint?.defaultProps).toEqual({
      behavior: 'padding',
      enabled: true,
      keyboardVerticalOffset: 0,
    });
    expect(keyboardAvoidingView.props.behavior?.enum).toEqual(['height', 'position', 'padding']);
  });

  test('Progress is a direct manifest leaf with serializable defaults', () => {
    expect(ZORA_COMPONENT_META.Progress.directManifestNode).toBe(true);
    expect(ZORA_COMPONENT_META.Progress.allowedChildren).toEqual([]);
    expect(ZORA_COMPONENT_META.Progress.blueprint?.defaultProps).toEqual({
      value: 50,
      max: 100,
      color: 'primary',
      size: 'm',
    });
  });

  test('ProgressRing is a direct manifest leaf with serializable center content', () => {
    const progressRing = ZORA_COMPONENT_META.ProgressRing;

    expect(progressRing.directManifestNode).toBe(true);
    expect(progressRing.allowedChildren).toEqual([]);
    expect(progressRing.blueprint?.defaultProps).toMatchObject({
      centerLabel: 'Complete',
      centerValue: '68%',
      max: 100,
      value: 68,
    });
    expect(progressRing.props.centerValue?.type).toBe('string');
    expect(progressRing.props.centerLabel?.type).toBe('string');
    expect(progressRing.props.accessibilityValueText?.type).toBe('string');
  });

  test('ReaderSurface exposes a safe file-media blueprint and normalized events', () => {
    const reader = ZORA_COMPONENT_META.ReaderSurface;

    expect(reader.directManifestNode).toBe(true);
    expect(reader.allowedChildren).toEqual([]);
    expect(reader.props.source).toMatchObject({ type: 'media', mediaKinds: ['file'] });
    expect(reader.props.format.enum).toEqual(['epub', 'pdf']);
    expect(reader.blueprint?.defaultProps).toEqual({
      format: 'epub',
      status: 'idle',
      showChrome: true,
      readerColorScheme: 'system',
      fontScale: 1,
      lineHeight: 'normal',
    });
    expect(reader.blueprint?.defaultProps).not.toHaveProperty('source');
    expect(reader.events?.locationChange?.payloadFields?.map((field) => field.path)).toEqual([
      'format',
      'locator',
      'page',
      'pageCount',
      'progression',
      'chapterId',
      'chapterTitle',
      'trigger',
    ]);
    expect(reader.events?.readerError?.eventType).toBe('reader.error');
  });

  test('ContentRail exposes manifest children, serializable controls, and normalized events', () => {
    const rail = ZORA_COMPONENT_META.ContentRail;

    expect(rail.directManifestNode).toBe(true);
    expect(rail.allowedChildren).toEqual([
      'Chip',
      'ChipGroup',
      'MediaCard',
      'MetricCard',
      'Avatar',
      'AvatarGroup',
      'Badge',
      'Button',
      'IconButton',
      'View',
      'ScrollView',
      'Card',
      'Image',
      'ProductCard',
      'PostCard',
      'ChatListItem',
      'MessageBubble',
      'MissingElement',
    ]);
    expect(rail.slots?.children?.allowedChildren).toEqual(rail.allowedChildren);
    expect(rail.blueprint?.defaultProps).toEqual({
      itemSize: 'responsive',
      gap: 'm',
      padding: 'm',
      peek: 32,
      showControls: true,
      direction: 'auto',
      motion: 'system',
      accessibilityLabel: 'Content rail',
      previousLabel: 'Previous items',
      nextLabel: 'Next items',
    });
    expect(rail.events?.controlPress?.eventType).toBe('contentRail.controlPress');
    expect(rail.events?.visibleRangeChange?.eventType).toBe('contentRail.visibleRangeChange');
    expect(rail.requirements).toBeUndefined();
  });

  test('MissingElement exposes a release-blocking unresolved manifest policy', () => {
    const missingElement = ZORA_COMPONENT_META.MissingElement;

    expect(missingElement.directManifestNode).toBe(true);
    expect(missingElement.allowedChildren).toEqual([]);
    expect(missingElement.manifestPolicy).toEqual({
      kind: 'unresolved-element',
      availability: 'draft-only',
      releaseGate: 'blocked',
    });
    expect(missingElement.events).toBeUndefined();
    expect(missingElement.requirements).toBeUndefined();
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
