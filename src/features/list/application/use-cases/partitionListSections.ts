import type { ManifestListSection } from '../../../../types/manifest-list';

/*** Partitions ordered list children into declared sections while enforcing complete coverage and identity. */
export function partitionListSections<T>(
  items: readonly T[],
  sections: readonly ManifestListSection[],
) {
  const keys = new Set<string>();
  let offset = 0;
  const result = sections.map((section) => {
    if (!section.key || keys.has(section.key))
      throw new Error('SectionList requires unique non-empty section keys.');
    if (!Number.isInteger(section.itemCount) || section.itemCount < 0)
      throw new Error('SectionList itemCount must be a non-negative integer.');
    keys.add(section.key);
    const data = items.slice(offset, offset + section.itemCount);
    offset += section.itemCount;
    return { ...section, data };
  });
  if (offset !== items.length)
    throw new Error('SectionList section item counts must cover every child exactly once.');
  return result;
}
