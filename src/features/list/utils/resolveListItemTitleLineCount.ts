/*** Resolves the title line limit for compact list presentation. */
export function resolveListItemTitleLineCount(compact: boolean): number | undefined {
  return compact ? 1 : undefined;
}
