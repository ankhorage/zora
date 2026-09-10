function takeFirstCharacter(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const chars = Array.from(trimmed);
  return chars[0] ? chars[0].toUpperCase() : null;
}

function takeFirstTwoCharacters(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const chars = Array.from(trimmed);
  const [first, second] = chars;
  if (!first) return null;

  return `${first}${second ?? ''}`.toUpperCase();
}

export function resolveAvatarInitials(name: string | undefined): string | null {
  if (!name) return null;

  const parts = name
    .trim()
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 0) return null;

  if (parts.length === 1) {
    const [part] = parts;
    return part ? takeFirstTwoCharacters(part) : null;
  }

  const [firstPart] = parts;
  const [lastPart] = parts.slice(-1);
  const first = firstPart ? takeFirstCharacter(firstPart) : null;
  const last = lastPart ? takeFirstCharacter(lastPart) : null;

  if (!first && !last) return null;
  if (!last) return first;
  if (!first) return last;

  return `${first}${last}`;
}
