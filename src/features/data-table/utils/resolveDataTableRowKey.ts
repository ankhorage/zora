/*** Resolves a table row's identity from its declared field or explicit React callback. */
export function resolveDataTableRowKey<TRow extends object>(
  row: TRow,
  index: number,
  rowKey?: keyof TRow,
  rowId?: (row: TRow, index: number) => string,
): string {
  if (rowId) return rowId(row, index);
  const key: unknown =
    rowKey === undefined ? undefined : new Map(Object.entries(row)).get(String(rowKey));
  if (typeof key === 'string' || typeof key === 'number') return String(key);
  throw new Error('DataTable requires a rowKey field containing a string or number for every row.');
}
