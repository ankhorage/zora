import { describe, expect, test } from 'bun:test';

import { ZORA_COLOR_TONES } from '../../theme/types';
import {
  getZoraColorToneRecipe,
  getZoraColorToneRoleChromaFactor,
  type ZoraColorToneRecipe,
  type ZoraHueScaleRoleId,
} from './index';

const HUE_BACKED_ROLES: readonly ZoraHueScaleRoleId[] = [
  'primary',
  'secondary',
  'accent',
  'highlight',
  'surfaceTint',
];

function expectFinitePositive(value: number) {
  expect(Number.isFinite(value)).toBe(true);
  expect(value).toBeGreaterThan(0);
}

function expectSaneRecipe(recipe: ZoraColorToneRecipe) {
  expectFinitePositive(recipe.maxChroma);
  expectFinitePositive(recipe.minMidChroma);
  expect(recipe.minMidChroma).toBeLessThan(recipe.maxChroma);

  for (const role of HUE_BACKED_ROLES) {
    expectFinitePositive(getZoraColorToneRoleChromaFactor(recipe, role));
  }
}

describe('color tone recipes', () => {
  test('every ZORA color tone has a recipe', () => {
    for (const colorTone of ZORA_COLOR_TONES) {
      expect(getZoraColorToneRecipe(colorTone).colorTone).toBe(colorTone);
    }
  });

  test('every recipe has sane chroma values and all hue-backed role factors', () => {
    for (const colorTone of ZORA_COLOR_TONES) {
      expectSaneRecipe(getZoraColorToneRecipe(colorTone));
    }
  });

  test('records the initial background and foreground lane pairings', () => {
    expect(getZoraColorToneRecipe('fluorescent').laneRecipe).toEqual({
      backgroundTone: 'obsidian',
      foregroundTone: 'fluorescent',
    });
    expect(getZoraColorToneRecipe('obsidian').laneRecipe).toEqual({
      backgroundTone: 'obsidian',
      foregroundTone: 'fluorescent',
    });
    expect(getZoraColorToneRecipe('pastel').laneRecipe).toEqual({
      backgroundTone: 'pastel',
      foregroundTone: 'jewel',
    });
    expect(getZoraColorToneRecipe('earth').laneRecipe).toEqual({
      backgroundTone: 'earth',
      foregroundTone: 'mineral',
    });
  });

  test('surface tint remains lower intensity than foreground action roles', () => {
    for (const colorTone of ZORA_COLOR_TONES) {
      const recipe = getZoraColorToneRecipe(colorTone);
      const surfaceTint = getZoraColorToneRoleChromaFactor(recipe, 'surfaceTint');

      expect(surfaceTint).toBeLessThan(getZoraColorToneRoleChromaFactor(recipe, 'primary'));
      expect(surfaceTint).toBeLessThan(getZoraColorToneRoleChromaFactor(recipe, 'accent'));
      expect(surfaceTint).toBeLessThan(getZoraColorToneRoleChromaFactor(recipe, 'highlight'));
    }
  });

  test('high-energy tones allow higher chroma than neutral and pastel', () => {
    expect(getZoraColorToneRecipe('fluorescent').maxChroma).toBeGreaterThan(
      getZoraColorToneRecipe('neutral').maxChroma,
    );
    expect(getZoraColorToneRecipe('fluorescent').maxChroma).toBeGreaterThan(
      getZoraColorToneRecipe('pastel').maxChroma,
    );
  });

  test('getter is deterministic', () => {
    expect(getZoraColorToneRecipe('jewel')).toEqual(getZoraColorToneRecipe('jewel'));
  });
});
