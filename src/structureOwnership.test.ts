import { existsSync, readdirSync } from 'node:fs';

import { describe, expect, test } from 'bun:test';

describe('src ownership', () => {
  test('keeps the required CLI, feature, and type owner directories at the package source root', () => {
    const directories = readdirSync('src', { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();

    expect(directories).toEqual(['cli', 'features', 'types']);
  });

  test('does not reintroduce technical ownership roots', () => {
    for (const path of [
      'src/constants.ts',
      'src/constants',
      'src/context',
      'src/internal',
      'src/metadata',
      'src/theme',
      'src/utils',
    ]) {
      expect(existsSync(path), path).toBe(false);
    }
  });

  test('keeps reusable authoring, plugin, registry, and theme types centralized', () => {
    for (const path of [
      'src/types/authoring.ts',
      'src/types/plugin.ts',
      'src/types/registry.ts',
      'src/types/theme.ts',
      'src/types/theme-recipe.ts',
    ]) {
      expect(existsSync(path), path).toBe(true);
    }

    for (const path of [
      'src/features/authoring/types.ts',
      'src/features/authoring/themeRecipeTypes.ts',
      'src/features/theme/ZoraBaseProps.ts',
      'src/features/theme/ThemeModeToggleProps.ts',
    ]) {
      expect(existsSync(path), path).toBe(false);
    }
  });

  test('keeps deliberate feature facades instead of legacy catch-all implementation files', () => {
    for (const path of [
      'src/features/plugin/public.ts',
      'src/features/plugin/runtime.ts',
      'src/features/registry/public.ts',
      'src/features/theme/public.ts',
      'src/features/theme/runtime.ts',
    ]) {
      expect(existsSync(path), path).toBe(true);
    }

    for (const path of [
      'src/features/plugin/pluginComposition.ts',
      'src/features/plugin/corePlugin.ts',
      'src/features/plugin/corePluginMetadata.ts',
      'src/features/registry/registry.ts',
      'src/features/theme/index.ts',
    ]) {
      expect(existsSync(path), path).toBe(false);
    }
  });
});
