import type { HeadingLevel, HeadingSize } from '../../../types/heading';

/*** Maps an accessible heading level to its default semantic visual size. */
export function resolveHeadingSizeFromLevel(level: HeadingLevel): HeadingSize {
  switch (level) {
    case 1:
      return 'h1';
    case 2:
      return 'h2';
    case 3:
      return 'h3';
    case 4:
      return 'h4';
    case 5:
      return 'h5';
    case 6:
      return 'h6';
  }
}
