export function resolveReaderProgress({
  progress,
  page,
  pageCount,
}: {
  progress?: number;
  page?: number;
  pageCount?: number;
}): number {
  if (progress !== undefined && Number.isFinite(progress)) {
    return Math.min(1, Math.max(0, progress));
  }

  if (
    page === undefined ||
    pageCount === undefined ||
    !Number.isFinite(page) ||
    !Number.isFinite(pageCount) ||
    pageCount < 1
  ) {
    return 0;
  }

  if (pageCount === 1) {
    return 1;
  }

  return Math.min(1, Math.max(0, (page - 1) / (pageCount - 1)));
}
