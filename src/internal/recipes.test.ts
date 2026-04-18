import { describe, expect, test } from 'bun:test';

import {
  resolveBadgeRecipe,
  resolveButtonRecipe,
  resolveCardVariant,
  resolveDialogWidth,
  resolveIconSize,
  resolvePageMaxWidth,
} from './recipes';

describe('recipes', () => {
  test('maps button defaults to a more opinionated large solid primary button', () => {
    expect(resolveButtonRecipe({})).toEqual({
      size: 'l',
      tone: 'primary',
      variant: 'solid',
    });
  });

  test('maps badge defaults to a soft medium primary badge', () => {
    expect(resolveBadgeRecipe({})).toEqual({
      size: 'm',
      tone: 'primary',
      variant: 'soft',
    });
  });

  test('resolves elevated cards by default', () => {
    expect(resolveCardVariant()).toBe('raised');
    expect(resolveCardVariant('outline')).toBe('outline');
    expect(resolveCardVariant('subtle')).toBe('subtle');
  });

  test('keeps width presets stable for layouts and dialogs', () => {
    expect(resolveDialogWidth('narrow')).toBeLessThan(resolveDialogWidth('default'));
    expect(resolveDialogWidth('wide')).toBeGreaterThanOrEqual(resolveDialogWidth('default'));
    expect(resolvePageMaxWidth('wide')).toBeGreaterThan(resolvePageMaxWidth('default'));
  });

  test('keeps icon sizes aligned with control sizes', () => {
    expect(resolveIconSize('s')).toBe(16);
    expect(resolveIconSize('m')).toBe(18);
    expect(resolveIconSize('l')).toBe(20);
  });
});
