import { describe, expect, test } from 'bun:test';

import type { ZoraComponentMeta } from './metadata';
import {
  composeZoraPlugins,
  ZoraPluginCompositionError,
  type ZoraPluginDescriptor,
} from './pluginComposition';

const pluginLeafMeta: ZoraComponentMeta = {
  name: 'PluginLeaf',
  category: 'component',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: { label: 'Plugin leaf' },
  bindings: {
    props: {
      value: { value: { type: 'string' } },
    },
  },
  props: {
    value: { type: 'string', category: 'Content', authoring: { authority: 'instance' } },
  },
};

const PluginLeaf = () => null;

const Host = () => null;

const core = {
  packageName: '@example/core',
  componentRegistry: { Host },
  componentMeta: {
    Host: {
      name: 'Host',
      category: 'layout',
      directManifestNode: true,
      allowedChildren: [],
      props: {},
    },
  },
  extensionHosts: ['Host'],
} satisfies ZoraPluginDescriptor;

const plugin = {
  packageName: '@example/zora-plugin',
  displayName: 'Example plugin',
  componentRegistry: { PluginLeaf },
  componentMeta: { PluginLeaf: pluginLeafMeta },
  placements: [{ child: 'PluginLeaf', parents: ['Host'] }],
} satisfies ZoraPluginDescriptor;

describe('composeZoraPlugins', () => {
  test('composes runtime, authoring, binding, package, and placement projections', () => {
    const catalog = composeZoraPlugins([core, plugin]);

    expect(catalog.componentRegistry.PluginLeaf).toBe(PluginLeaf);
    expect(catalog.componentMeta.PluginLeaf).toBe(pluginLeafMeta);
    expect(catalog.bindableComponentMeta.PluginLeaf?.bindings).toEqual(pluginLeafMeta.bindings);
    expect(catalog.componentMeta.Host.allowedChildren).toContain('PluginLeaf');
    expect(catalog.packageManifests.map((entry) => entry.packageName)).toEqual([
      '@example/core',
      '@example/zora-plugin',
    ]);
  });

  test('is deterministic regardless of plugin input order', () => {
    const Alpha = () => null;
    const alpha = createPlugin('@example/alpha', 'Alpha', Alpha);
    const beta = createPlugin('@example/beta', 'Beta', () => null);

    expect(Object.keys(composeZoraPlugins([core, beta, alpha]).componentMeta)).toEqual(
      Object.keys(composeZoraPlugins([alpha, core, beta]).componentMeta),
    );
  });

  test('rejects duplicate component ownership with a stable diagnostic code', () => {
    const duplicate = createPlugin('@example/duplicate', 'Host', () => null);

    expect(() => composeZoraPlugins([core, duplicate])).toThrow(ZoraPluginCompositionError);
    try {
      composeZoraPlugins([core, duplicate]);
    } catch (error) {
      expect(error).toMatchObject({
        code: 'duplicate-component',
        packageName: '@example/duplicate',
        componentName: 'Host',
      });
    }
  });

  test('rejects runtime and metadata mismatches', () => {
    const invalid = {
      ...plugin,
      packageName: '@example/invalid',
      componentMeta: {},
    } satisfies ZoraPluginDescriptor;

    expectCompositionError(invalid, 'missing-component-meta');
  });

  test('rejects placement into components that did not opt in as extension hosts', () => {
    const invalid = {
      ...plugin,
      packageName: '@example/invalid-placement',
      placements: [{ child: 'PluginLeaf', parents: ['PluginLeaf'] }],
    } satisfies ZoraPluginDescriptor;

    expectCompositionError(invalid, 'invalid-placement-parent');
  });
});

function createPlugin(
  packageName: string,
  componentName: string,
  component: ZoraPluginDescriptor['componentRegistry'][string],
): ZoraPluginDescriptor {
  return {
    packageName,
    componentRegistry: { [componentName]: component },
    componentMeta: {
      [componentName]: {
        ...pluginLeafMeta,
        name: componentName,
      },
    },
  };
}

function expectCompositionError(
  descriptor: ZoraPluginDescriptor,
  code: ZoraPluginCompositionError['code'],
): void {
  try {
    composeZoraPlugins([core, descriptor]);
    throw new Error('Expected plugin composition to fail.');
  } catch (error) {
    expect(error).toBeInstanceOf(ZoraPluginCompositionError);
    expect(error).toMatchObject({ code });
  }
}
