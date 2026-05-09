import { describe, expect, it } from 'bun:test';

import { resolveAvatarInitials } from './resolveAvatarInitials';

describe('resolveAvatarInitials', () => {
  it('returns null for empty input', () => {
    expect(resolveAvatarInitials(undefined)).toBeNull();
    expect(resolveAvatarInitials('')).toBeNull();
    expect(resolveAvatarInitials('   ')).toBeNull();
  });

  it('returns the first two characters for a single word', () => {
    expect(resolveAvatarInitials('Zora')).toBe('ZO');
    expect(resolveAvatarInitials('a')).toBe('A');
  });

  it('returns first+last initials for multiple words', () => {
    expect(resolveAvatarInitials('Fabio Gartenmann')).toBe('FG');
    expect(resolveAvatarInitials('Fabio   Gartenmann')).toBe('FG');
    expect(resolveAvatarInitials('Fabio Gartenmann Example')).toBe('FE');
  });

  it('handles non-letter characters', () => {
    expect(resolveAvatarInitials('🧠 Brain')).toBe('🧠B');
    expect(resolveAvatarInitials('Brain 🧠')).toBe('B🧠');
  });
});
