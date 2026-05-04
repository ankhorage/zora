import type { ZoraHexColor, ZoraTheme } from '../../theme/types';
import type {
  ThemeComposerAppCategory,
  ThemeComposerAppMood,
  ThemeComposerRecommendation,
} from './types';

export function findThemeComposerRecommendation(options: {
  appCategory?: ThemeComposerAppCategory;
  appMood?: ThemeComposerAppMood;
  recommendations?: readonly ThemeComposerRecommendation[];
}): ThemeComposerRecommendation | undefined {
  if (options.appCategory === undefined || options.recommendations === undefined) {
    return undefined;
  }

  return options.recommendations.find(
    (recommendation) =>
      recommendation.appCategory === options.appCategory &&
      (options.appMood === undefined || recommendation.appMood === options.appMood),
  );
}

export function formatThemeComposerLabel(value: string): string {
  const spaced = value
    .replace(/_/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .trim();

  if (spaced.length === 0) {
    return value;
  }

  return `${spaced.slice(0, 1).toUpperCase()}${spaced.slice(1)}`;
}

export function hueDegreesToZoraHexColor(hueDegrees: number): ZoraHexColor {
  const normalizedHue = ((hueDegrees % 360) + 360) % 360;
  const chroma = 0.56;
  const lightness = 0.46;
  const second = chroma * (1 - Math.abs(((normalizedHue / 60) % 2) - 1));
  const match = lightness - chroma / 2;

  const hueSector = Math.floor(normalizedHue / 60);
  const [redPrime, greenPrime, bluePrime] = (() => {
    switch (hueSector) {
      case 0:
        return [chroma, second, 0] as const;
      case 1:
        return [second, chroma, 0] as const;
      case 2:
        return [0, chroma, second] as const;
      case 3:
        return [0, second, chroma] as const;
      case 4:
        return [second, 0, chroma] as const;
      default:
        return [chroma, 0, second] as const;
    }
  })();

  const toHexChannel = (channel: number): string => {
    const value = Math.round(Math.min(1, Math.max(0, channel + match)) * 255);
    return value.toString(16).padStart(2, '0');
  };

  return `#${toHexChannel(redPrime)}${toHexChannel(greenPrime)}${toHexChannel(bluePrime)}`;
}

export function createThemeFromThemeComposerRecommendation(options: {
  value: ZoraTheme;
  recommendation: ThemeComposerRecommendation;
}): ZoraTheme {
  const suggestedPrimaryColor =
    options.recommendation.suggestedPrimaryHueDegrees === undefined
      ? options.value.primaryColor
      : hueDegreesToZoraHexColor(options.recommendation.suggestedPrimaryHueDegrees);

  return {
    ...options.value,
    primaryColor: suggestedPrimaryColor,
    harmony: options.recommendation.suggestedHarmony,
    colorTone: options.recommendation.suggestedColorTone,
  };
}
