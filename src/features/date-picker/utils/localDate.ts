const LOCAL_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/u;

/*** Parse a calendar date without applying a UTC offset. */
export function parseLocalDate(value: string | null | undefined): Date | undefined {
  if (!value) return undefined;

  const match = LOCAL_DATE_PATTERN.exec(value);
  if (!match) return undefined;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(year, month - 1, day);
  parsed.setFullYear(year);

  return parsed.getFullYear() === year &&
    parsed.getMonth() === month - 1 &&
    parsed.getDate() === day
    ? parsed
    : undefined;
}

/*** Serialize a Date as a local calendar date suitable for manifest state. */
export function formatLocalDate(value: Date): string {
  const year = String(value.getFullYear()).padStart(4, '0');
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
