import { existsSync, readdirSync } from 'node:fs';

import { describe, expect, test } from 'bun:test';

describe('src ownership', () => {
  test('keeps the required package-wide and feature owner directories at the package source root', () => {
    const directories = readdirSync('src', { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();

    expect(directories).toEqual(['capabilities', 'cli', 'constants', 'features', 'types']);
  });

  test('does not reintroduce technical ownership roots', () => {
    for (const path of [
      'src/constants.ts',
      'src/context',
      'src/internal',
      'src/metadata',
      'src/theme',
      'src/utils',
    ]) {
      expect(existsSync(path), path).toBe(false);
    }
  });

  test('keeps reusable authoring, registry, and theme types centralized', () => {
    for (const path of [
      'src/types/authoring.ts',
      'src/types/registry.ts',
      'src/types/theme.ts',
      'src/types/theme-recipe.ts',
    ]) {
      expect(existsSync(path), path).toBe(true);
    }

    for (const path of [
      'src/features/authoring',
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
      'src/features/registry/public.ts',
      'src/features/theme/public.ts',
      'src/features/theme/runtime.ts',
    ]) {
      expect(existsSync(path), path).toBe(true);
    }

    for (const path of [
      'src/features/plugin',
      'src/features/registry/registry.ts',
      'src/features/theme/index.ts',
    ]) {
      expect(existsSync(path), path).toBe(false);
    }
  });

  test('keeps event capability projection with the registry metadata owner', () => {
    expect(existsSync('src/features/registry/createEventCapabilities.ts')).toBe(true);
    expect(existsSync('src/capabilities/createEventCapabilities.ts')).toBe(false);
  });
});
