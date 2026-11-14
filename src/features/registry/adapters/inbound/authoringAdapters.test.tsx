import { describe, expect, test } from 'bun:test';
import { isValidElement, type ReactElement } from 'react';

import type { ZoraComponentMeta } from '../../../../types/authoring';
import type {
  AuthoringBindingEditorAdapterProps,
  AuthoringPropertyInspectorAdapterProps,
  AuthoringSelectionAdapterProps,
  ThemeEditorAdapterProps,
} from '../../../../types/authoring-adapters';
import type { ZoraThemeRecipeMetaRegistry } from '../../../../types/theme-recipe';

type AuthoringSelectionAdapter = <TItem>(
  props: AuthoringSelectionAdapterProps<TItem>,
) => ReactElement;
type AuthoringPropertyInspectorAdapter = <TNode>(
  props: AuthoringPropertyInspectorAdapterProps<TNode>,
) => ReactElement | null;
type AuthoringBindingEditorAdapter = <TNode, TBinding>(
  props: AuthoringBindingEditorAdapterProps<TNode, TBinding>,
) => ReactElement | null;
type ThemeEditorAdapter = <TTheme>(props: ThemeEditorAdapterProps<TTheme>) => ReactElement | null;

interface LoadedAdapters {
  readonly AuthoringBindingEditorAdapter: AuthoringBindingEditorAdapter;
  readonly AuthoringPropertyInspectorAdapter: AuthoringPropertyInspectorAdapter;
  readonly AuthoringSelectionAdapter: AuthoringSelectionAdapter;
  readonly ThemeEditorAdapter: ThemeEditorAdapter;
}

const component: ZoraComponentMeta = {
  name: 'Example',
  category: 'component',
  directManifestNode: true,
  allowedChildren: [],
  props: {
    title: { type: 'string', category: 'Content', label: 'Title' },
  },
  bindings: {
    props: {
      title: {
        label: 'Title binding',
        value: { type: 'string' },
        acceptsFallback: true,
        acceptsTransforms: true,
      },
    },
  },
};

const recipes: ZoraThemeRecipeMetaRegistry = {
  Example: {
    name: 'Example',
    kind: 'component',
    fields: {
      color: { type: 'token', label: 'Color', tokenFamily: 'colors' },
    },
  },
};

describe('authoring adapters', () => {
  test('maps consumer-owned selection data back from ZORA selection ids', async () => {
    const { AuthoringSelectionAdapter } = await loadAdapters();
    const selected: ({ id: string } | null)[] = [];
    const element = AuthoringSelectionAdapter({
      items: [{ id: 'first' }, { id: 'second' }],
      selectedItemId: 'first',
      getItemId: (item) => item.id,
      onSelectionChange: (item) => selected.push(item),
      renderItem: ({ item }) => <item data-id={item.id} />,
    });
    const change = findElement(element, 'SelectionProvider')?.props.onSelectionChange;

    if (typeof change !== 'function') throw new Error('Missing selection mutation callback.');
    Reflect.apply(change, undefined, [['second']]);
    Reflect.apply(change, undefined, [[]]);

    expect(selected).toEqual([{ id: 'second' }, null]);
    expect(findElement(element, 'SelectionProvider')?.props.selectedIds).toEqual(['first']);
  });

  test('passes required state and real property mutations while preventing disabled mutations', async () => {
    const { AuthoringPropertyInspectorAdapter } = await loadAdapters();
    const mutations: [string, string | undefined][] = [];
    const enabled = AuthoringPropertyInspectorAdapter({
      node: { title: 'Current title' },
      component,
      getPropertyValue: (node, name) => (name === 'title' ? node.title : undefined),
      onPropertyChange: (_node, name, value) => mutations.push([name, value as string | undefined]),
      isPropertyRequired: () => true,
      renderProperty: ({ disabled, onChange, required }) => (
        <property disabled={disabled} onChange={onChange} required={required} />
      ),
    });
    const enabledControl = findElement(enabled, 'property');
    const change = readStringChange(enabledControl, 'property mutation callback');
    change('Updated title');

    const disabled = AuthoringPropertyInspectorAdapter({
      node: { title: 'Current title' },
      component,
      getPropertyValue: (node, name) => (name === 'title' ? node.title : undefined),
      onPropertyChange: (_node, name, value) => mutations.push([name, value as string | undefined]),
      disabled: true,
      renderProperty: ({ disabled: controlDisabled, onChange }) => (
        <property disabled={controlDisabled} onChange={onChange} />
      ),
    });
    const disabledChange = readStringChange(
      findElement(disabled, 'property'),
      'disabled property callback',
    );
    disabledChange('Ignored title');

    expect(enabledControl?.props.required).toBe(true);
    expect(findElement(disabled, 'property')?.props.disabled).toBe(true);
    expect(mutations).toEqual([['title', 'Updated title']]);
  });

  test('passes disabled binding state and suppresses disabled binding mutations', async () => {
    const { AuthoringBindingEditorAdapter } = await loadAdapters();
    const mutations: [string, string | undefined][] = [];
    const element = AuthoringBindingEditorAdapter({
      node: { binding: 'source.title' },
      component,
      getBinding: (node) => node.binding,
      onBindingChange: (_node, name, binding) => mutations.push([name, binding]),
      disabled: true,
      isBindingRequired: () => true,
      renderBinding: ({ disabled, onChange, required }) => (
        <binding disabled={disabled} onChange={onChange} required={required} />
      ),
    });
    const control = findElement(element, 'binding');
    const change = readStringChange(control, 'binding mutation callback');
    change('replacement.title');

    expect(control?.props.disabled).toBe(true);
    expect(control?.props.required).toBe(true);
    expect(mutations).toEqual([]);
  });

  test('passes theme field state and suppresses disabled theme mutations', async () => {
    const { ThemeEditorAdapter } = await loadAdapters();
    const mutations: [string, string, string | boolean | undefined][] = [];
    const element = ThemeEditorAdapter({
      theme: { color: 'primary' },
      recipes,
      getRecipeFieldValue: (theme) => theme.color,
      onRecipeFieldChange: (_theme, recipeName, fieldName, value) =>
        mutations.push([recipeName, fieldName, value]),
      disabled: true,
      isFieldRequired: () => true,
      renderField: ({ disabled, onChange, required }) => (
        <theme-field disabled={disabled} onChange={onChange} required={required} />
      ),
    });
    const control = findElement(element, 'theme-field');
    const change = readStringChange(control, 'theme mutation callback');
    change('secondary');

    expect(control?.props.disabled).toBe(true);
    expect(control?.props.required).toBe(true);
    expect(mutations).toEqual([]);
  });
});

/*** Find a host element emitted by an adapter render prop without mounting platform controls. */
function findElement(
  node: unknown,
  type: string,
): ReactElement<Record<string, unknown>> | undefined {
  if (Array.isArray(node)) {
    return node.map((item) => findElement(item, type)).find((item) => item !== undefined);
  }
  if (!isValidElement<Record<string, unknown>>(node)) return undefined;
  if (node.type === type) return node;
  return findElement(node.props.children, type);
}

/*** Read the string-valued render-prop mutation callback after its runtime boundary check. */
function readStringChange(
  element: ReactElement<Record<string, unknown>> | undefined,
  description: string,
): (value: string) => void {
  const value = element?.props.onChange;
  if (typeof value !== 'function') throw new Error(`Missing ${description}.`);
  return value as (nextValue: string) => void;
}

/*** Load adapter modules with inert ZORA controls so unit assertions stay at the public callback boundary. */
async function loadAdapters(): Promise<LoadedAdapters> {
  const build = await Bun.build({
    entrypoints: [new URL('../../../../authoring.ts', import.meta.url).pathname],
    target: 'bun',
    plugins: [
      {
        name: 'inert-zora-authoring-controls',
        setup(builder) {
          builder.onResolve(
            { filter: /(?:card|form|layout|registry|selection)\/public$/u },
            ({ path }) => ({ path, namespace: 'inert-zora-controls' }),
          );
          builder.onLoad({ filter: /.*/u, namespace: 'inert-zora-controls' }, () => ({
            loader: 'js',
            contents: `export const Card='Card', Field='Field', View='View',
              SelectableItem='SelectableItem', SelectionProvider='SelectionProvider';`,
          }));
        },
      },
    ],
  });
  if (!build.success || !build.outputs[0]) {
    throw new Error(build.logs.map((log) => log.message).join('\n'));
  }
  const loaded: unknown = await import(
    `data:text/javascript;base64,${Buffer.from(await build.outputs[0].text()).toString('base64')}`
  );
  return {
    AuthoringBindingEditorAdapter: readAdapter(loaded, 'AuthoringBindingEditorAdapter'),
    AuthoringPropertyInspectorAdapter: readAdapter(loaded, 'AuthoringPropertyInspectorAdapter'),
    AuthoringSelectionAdapter: readAdapter(loaded, 'AuthoringSelectionAdapter'),
    ThemeEditorAdapter: readAdapter(loaded, 'ThemeEditorAdapter'),
  };
}

/*** Read one bundled adapter only after its runtime export has been verified as callable. */
function readAdapter<TAdapter extends (...arguments_: never[]) => unknown>(
  module: unknown,
  name: string,
): TAdapter {
  const value = isRecord(module)
    ? Object.entries(module).find(([key]) => key === name)?.[1]
    : undefined;
  if (typeof value !== 'function') throw new Error(`Missing ${name}.`);
  return value as TAdapter;
}

/*** Narrow an unknown module namespace before reading a dynamic public export. */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
