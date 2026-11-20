import { describe, expect, test } from 'bun:test';

const publicEntrypoints = [
  'flow-node-palette/public.ts',
  'flow-inspector/public.ts',
  'flow-execution-overlay/public.ts',
] as const;

describe('flow controlled UI public API', () => {
  test('builds each independent public component without resolving FlowCanvas', async () => {
    const results = await Promise.all(publicEntrypoints.map(buildPublicEntrypoint));
    expect(results).toEqual([true, true, true]);
  });

  test('keeps the root public surface independent from FlowCanvas until its release', async () => {
    const source = await Bun.file(new URL('../index.ts', import.meta.url).pathname).text();
    expect(source).toContain("from './features/flow-inspector/public'");
    expect(source).toContain("from './features/flow-node-palette/public'");
    expect(source).toContain("from './features/flow-execution-overlay/public'");
    expect(source).not.toContain('flow/');
  });
});

/** Bundles one public feature edge with inert presentation dependencies to prove its standalone shape. */
async function buildPublicEntrypoint(
  entrypoint: (typeof publicEntrypoints)[number],
): Promise<boolean> {
  const result = await Bun.build({
    entrypoints: [new URL(`./${entrypoint}`, import.meta.url).pathname],
    plugins: [
      {
        name: 'inert-flow-ui-presentation',
        setup(builder) {
          builder.onResolve(
            { filter: /react-native|@ankhorage\/surface|\/public$/u },
            ({ path }) => ({ path, namespace: 'inert-flow-ui-presentation' }),
          );
          builder.onLoad({ filter: /.*/u, namespace: 'inert-flow-ui-presentation' }, () => ({
            loader: 'js',
            contents: `export const Pressable='Pressable', Platform={OS:'web'}, Card='Card', View='View', Heading='Heading', Text='Text', Badge='Badge', Progress='Progress', BottomSheet='BottomSheet', Field='Field', TextInput='TextInput', ThemeScope='ThemeScope'; export const withZoraThemeScope=(component)=>component; export const useTheme=()=>({}); export const useZoraTheme=()=>({theme:{colors:{primary:'#000'},semantics:{neutral:{divider:'#000'}}}});`,
          }));
        },
      },
    ],
    target: 'bun',
  });
  return result.success && result.outputs.length === 1;
}
